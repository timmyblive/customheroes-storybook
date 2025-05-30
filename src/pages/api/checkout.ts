import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, PRODUCT_PRICES, ProductType } from '../../lib/stripe';
import { createOrUpdateCustomer, createOrder, updateOrderStatus, createBookOrder, createCharacter } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }
    
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return res.status(500).json({ error: 'Database configuration error' });
    }
    
    console.log('Environment check passed');
    console.log('Checkout API called with body:', JSON.stringify(req.body, null, 2));
    
    const { 
      productType, 
      customerEmail, 
      customerName,
      bookTitle,
      characterName,
      characterAge,
      personalMessage,
      artStyle,
      characterPhotoUrl,
      additionalCopies = 0,
      giftCardAmount = 0,
      appliedGiftCardDiscount = 0,
      appliedGiftCardCode = null
    } = req.body;

    console.log('Extracted fields:');
    console.log(`- productType: ${productType} ${typeof productType}`);
    console.log(`- customerEmail: ${customerEmail}`);
    console.log(`- customerName: ${customerName}`);
    console.log(`- additionalCopies: ${additionalCopies}`);
    console.log(`- giftCardAmount: ${giftCardAmount}`);
    console.log(`- appliedGiftCardDiscount: ${appliedGiftCardDiscount}`);
    console.log(`- appliedGiftCardCode: ${appliedGiftCardCode}`);
    console.log(`- characterPhotoUrl length: ${characterPhotoUrl ? characterPhotoUrl.length : 'null'}`);
    
    // Validate required fields
    const missingFields = [];
    if (!productType) missingFields.push('productType');
    if (!customerEmail) missingFields.push('customerEmail');
    if (!customerName) missingFields.push('customerName');
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }

    // Validate and truncate characterPhotoUrl if it's too long
    let validatedPhotoUrl = characterPhotoUrl;
    if (characterPhotoUrl && characterPhotoUrl.length > 2000) {
      console.warn(`Character photo URL too long (${characterPhotoUrl.length} chars), truncating to 2000 chars`);
      validatedPhotoUrl = characterPhotoUrl.substring(0, 2000);
    }

    // Validate and truncate book title if it's too long
    let validatedBookTitle = bookTitle || `${characterName}'s Adventure`;
    if (validatedBookTitle.length > 255) {
      console.warn(`Book title too long (${validatedBookTitle.length} chars), truncating to 255 chars`);
      validatedBookTitle = validatedBookTitle.substring(0, 255);
    }

    // Validate product type
    console.log('Product type received:', productType);
    console.log('Valid product types:', Object.keys(PRODUCT_PRICES));
    console.log('PRODUCT_PRICES object:', PRODUCT_PRICES);
    console.log('Is valid product type?', Boolean(PRODUCT_PRICES[productType as ProductType]));
    
    // Ensure product type is one of the valid types
    const validProductTypes = Object.keys(PRODUCT_PRICES);
    
    // Force productType to be a string and trim it
    const normalizedProductType = String(productType).trim();
    console.log('Normalized product type:', normalizedProductType);
    
    // Check if it's a valid product type
    if (!validProductTypes.includes(normalizedProductType)) {
      const errorMsg = `Invalid product type: '${normalizedProductType}'. Must be one of: ${validProductTypes.join(', ')}`;
      console.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }
    
    // Use the normalized product type
    const productTypeKey = normalizedProductType as ProductType;

    const product = PRODUCT_PRICES[productTypeKey];
    console.log('Selected product:', product);

    // Create or update customer in database
    const customer = await createOrUpdateCustomer(customerEmail, customerName);

    // Helper function to safely format metadata values
    const formatMetadataValue = (value: any): string => {
      if (value == null) return '';
      const stringValue = String(value);
      // Truncate to 500 characters (Stripe limit)
      return stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
    };

    // Calculate total price
    const additionalCopiesPrice = additionalCopies * 1999; // $19.99 per additional copy in cents
    const baseTotal = product.price + additionalCopiesPrice + (giftCardAmount * 100);
    const finalTotal = Math.max(0, baseTotal - appliedGiftCardDiscount); // Ensure total is not negative
    
    // Calculate the effective product price after discount
    const discountedProductPrice = Math.max(0, product.price - appliedGiftCardDiscount);

    // Create line items array
    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: appliedGiftCardDiscount > 0 
              ? `CustomHeroes - ${product.name} (Gift Card Applied)` 
              : `CustomHeroes - ${product.name}`,
            description: appliedGiftCardDiscount > 0 
              ? `${product.description} - $${(appliedGiftCardDiscount / 100).toFixed(2)} gift card discount applied`
              : product.description,
            metadata: {
              bookTitle: formatMetadataValue(validatedBookTitle),
              characterName: formatMetadataValue(characterName),
              characterAge: formatMetadataValue(characterAge),
              personalMessage: formatMetadataValue(personalMessage),
              artStyle: formatMetadataValue(artStyle),
              customerId: formatMetadataValue(customer.id),
            },
          },
          unit_amount: discountedProductPrice,
        },
        quantity: 1,
      }
    ];

    // Add additional copies as a separate line item if any
    if (additionalCopies > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Additional Copy',
            description: `Additional copy of your personalized storybook`,
          },
          unit_amount: 1999, // $19.99 in cents
        },
        quantity: additionalCopies,
      });
    }

    // Add gift card as a separate line item if any
    if (giftCardAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Digital Gift Card',
            description: `Digital gift card for CustomHeroes`,
          },
          unit_amount: giftCardAmount * 100, // Convert to cents
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      locale: 'en',
      line_items: lineItems,
      metadata: {
        productType: formatMetadataValue(productTypeKey),
        customerId: formatMetadataValue(customer.id),
        bookTitle: formatMetadataValue(validatedBookTitle),
        characterName: formatMetadataValue(characterName),
        characterAge: formatMetadataValue(characterAge),
        personalMessage: formatMetadataValue(personalMessage),
        artStyle: formatMetadataValue(artStyle),
        characterPhotoUrl: formatMetadataValue(validatedPhotoUrl),
        additionalCopies: formatMetadataValue(additionalCopies),
        giftCardAmount: formatMetadataValue(giftCardAmount),
        appliedGiftCardDiscount: formatMetadataValue(appliedGiftCardDiscount),
        appliedGiftCardCode: formatMetadataValue(appliedGiftCardCode),
      },
      success_url: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/create/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/create?step=4`,
    });

    // Create order record in database
    const order = await createOrder(customer.id, session.id, finalTotal);

    // Update order status to completed since payment will be processed by Stripe
    await updateOrderStatus(session.id, 'completed');

    // Create book order record
    const bookOrder = await createBookOrder(
      order.id,
      validatedBookTitle,
      productTypeKey,
      artStyle || 'Cartoon',
      personalMessage || ''
    );

    // Create character record if we have character data
    if (characterName) {
      await createCharacter(
        bookOrder.id,
        characterName,
        characterAge || '',
        validatedPhotoUrl || ''
      );
    }

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url,
      orderId: order.id
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
