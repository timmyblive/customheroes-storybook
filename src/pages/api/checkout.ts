import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, PRODUCT_PRICES, ProductType } from '../../lib/stripe';
import { 
  createOrUpdateCustomer, 
  createOrder, 
  updateOrderStatus, 
  createBookOrder, 
  createCharacter,
  initializeDatabase,
  getGiftCardByCode,
  getGiftCardAvailableBalance,
  createGiftCardReservation,
  cleanupExpiredReservations
} from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting checkout process...');
    
    // Initialize database tables if they don't exist
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Clean up expired reservations periodically
    await cleanupExpiredReservations();

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
      characterPhotoUrls = [],
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
    console.log(`- characterPhotoUrls: ${Array.isArray(characterPhotoUrls) ? characterPhotoUrls.length + ' photos' : 'not an array'}`);
    console.log(`- characterPhotoUrls content:`, characterPhotoUrls);
    
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

    // Validate and process character photo URLs
    let validatedPhotoUrls: string[] = [];
    if (Array.isArray(characterPhotoUrls)) {
      validatedPhotoUrls = characterPhotoUrls
        .filter(url => url && typeof url === 'string')
        .map(url => url.length > 2000 ? url.substring(0, 2000) : url);
      console.log(`Processed ${validatedPhotoUrls.length} valid photo URLs`);
    } else if (characterPhotoUrls && typeof characterPhotoUrls === 'string') {
      // Handle backward compatibility with single URL
      validatedPhotoUrls = [characterPhotoUrls.length > 2000 ? characterPhotoUrls.substring(0, 2000) : characterPhotoUrls];
      console.log('Converted single photo URL to array for backward compatibility');
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

    console.log('About to create/update customer...');
    // Create or update customer in database
    const customer = await createOrUpdateCustomer(customerEmail, customerName);
    console.log('Customer created/updated:', customer.id);

    // Helper function to safely format metadata values
    const formatMetadataValue = (value: any): string => {
      if (value == null) return '';
      const stringValue = String(value);
      // Truncate to 500 characters (Stripe limit)
      return stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
    };

    // Validate gift card if one is being applied
    let validatedGiftCardDiscount = 0;
    let validatedGiftCardCode = null;
    
    if (appliedGiftCardCode && appliedGiftCardDiscount > 0) {
      console.log(`Validating gift card: ${appliedGiftCardCode} for discount: $${(appliedGiftCardDiscount / 100).toFixed(2)}`);
      
      try {
        // Get gift card details
        const giftCard = await getGiftCardByCode(appliedGiftCardCode);
        
        if (!giftCard) {
          console.error(`Gift card not found: ${appliedGiftCardCode}`);
          return res.status(400).json({ error: 'Invalid gift card code' });
        }
        
        // Check if the gift card is active
        if (giftCard.status !== 'active') {
          console.error(`Gift card is ${giftCard.status}: ${appliedGiftCardCode}`);
          return res.status(400).json({ error: `Gift card is ${giftCard.status}` });
        }
        
        // Check if the gift card has expired
        if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
          console.error(`Gift card has expired: ${appliedGiftCardCode}`);
          return res.status(400).json({ error: 'Gift card has expired' });
        }
        
        // Check if the gift card has sufficient available balance (accounting for active reservations)
        const availableBalance = await getGiftCardAvailableBalance(giftCard.id);
        if (availableBalance < appliedGiftCardDiscount) {
          console.error(`Gift card has insufficient available balance: ${appliedGiftCardCode}. Requested: $${(appliedGiftCardDiscount / 100).toFixed(2)}, Available: $${(availableBalance / 100).toFixed(2)}`);
          return res.status(400).json({ 
            error: `Gift card has insufficient balance. Available: $${(availableBalance / 100).toFixed(2)}` 
          });
        }
        
        // Gift card is valid, use it
        validatedGiftCardDiscount = appliedGiftCardDiscount;
        validatedGiftCardCode = appliedGiftCardCode;
        console.log(`Gift card validated successfully: ${validatedGiftCardCode} with discount: $${(validatedGiftCardDiscount / 100).toFixed(2)}`);
      } catch (error) {
        console.error('Error validating gift card:', error);
        return res.status(500).json({ error: 'Failed to validate gift card' });
      }
    }
    
    // Calculate total price
    const additionalCopiesPrice = additionalCopies * 1999; // $19.99 per additional copy in cents
    const baseTotal = product.price + additionalCopiesPrice + (giftCardAmount * 100);
    const finalTotal = Math.max(0, baseTotal - validatedGiftCardDiscount); // Ensure total is not negative
    
    // Calculate how much discount to apply to each item proportionally
    let remainingDiscount = validatedGiftCardDiscount;
    
    // Apply discount to product first
    const productDiscount = Math.min(remainingDiscount, product.price);
    const discountedProductPrice = product.price - productDiscount;
    remainingDiscount -= productDiscount;
    
    // Apply remaining discount to additional copies
    const additionalCopiesDiscount = Math.min(remainingDiscount, additionalCopiesPrice);
    const discountedAdditionalCopiesPrice = Math.max(0, 1999 - Math.floor(additionalCopiesDiscount / Math.max(1, additionalCopies)));
    remainingDiscount -= additionalCopiesDiscount;
    
    // Apply remaining discount to gift card purchase
    const giftCardDiscount = Math.min(remainingDiscount, giftCardAmount * 100);
    const discountedGiftCardPrice = Math.max(0, (giftCardAmount * 100) - giftCardDiscount);

    // Create line items array
    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: validatedGiftCardDiscount > 0 
              ? `CustomHeroes - ${product.name} (Gift Card Applied)` 
              : `CustomHeroes - ${product.name}`,
            description: validatedGiftCardDiscount > 0 
              ? `${product.description} - $${(productDiscount / 100).toFixed(2)} gift card discount applied`
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
            name: additionalCopiesDiscount > 0 ? 'Additional Copy (Gift Card Applied)' : 'Additional Copy',
            description: additionalCopiesDiscount > 0 
              ? `Additional copy of your personalized storybook - $${(additionalCopiesDiscount / 100).toFixed(2)} gift card discount applied`
              : `Additional copy of your personalized storybook`,
          },
          unit_amount: discountedAdditionalCopiesPrice,
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
            name: giftCardDiscount > 0 ? 'Digital Gift Card (Gift Card Applied)' : 'Digital Gift Card',
            description: giftCardDiscount > 0 
              ? `Digital gift card for CustomHeroes - $${(giftCardDiscount / 100).toFixed(2)} gift card discount applied`
              : `Digital gift card for CustomHeroes`,
          },
          unit_amount: discountedGiftCardPrice,
        },
        quantity: 1,
      });
    }

    console.log('About to create Stripe checkout session...');
    console.log('Line items:', JSON.stringify(lineItems, null, 2));
    
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
        characterPhotoUrls: formatMetadataValue(validatedPhotoUrls.join(',')),
        additionalCopies: formatMetadataValue(additionalCopies),
        giftCardAmount: formatMetadataValue(giftCardAmount),
        appliedGiftCardDiscount: formatMetadataValue(validatedGiftCardDiscount),
        appliedGiftCardCode: formatMetadataValue(validatedGiftCardCode),
      },
      success_url: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/create/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/create?step=4`,
    });
    console.log('Stripe session created:', session.id);

    // Process gift card redemption immediately after successful session creation
    if (validatedGiftCardCode && validatedGiftCardDiscount > 0) {
      console.log(`🎁 Processing gift card redemption: ${validatedGiftCardCode} for $${(validatedGiftCardDiscount / 100).toFixed(2)}`);
      
      try {
        // Get the gift card details to get the ID
        const giftCard = await getGiftCardByCode(validatedGiftCardCode);
        
        if (giftCard) {
          // Create a reservation for the gift card redemption
          await createGiftCardReservation(giftCard.id, session.id, validatedGiftCardDiscount);
          console.log('✅ Gift card reservation created');
        } else {
          console.error('❌ Gift card not found during reservation - this should not happen');
        }
      } catch (error) {
        console.error('💥 Error creating gift card reservation:', error);
        // Note: We don't fail the checkout here since the Stripe session was already created
        // The customer has already been charged the discounted amount
      }
    }

    console.log('About to create order record...');
    // Create order record in database
    const order = await createOrder(customer.id, session.id, finalTotal);
    console.log('Order created:', order.id);

    console.log('About to update order status...');
    // Update order status to completed since payment will be processed by Stripe
    await updateOrderStatus(session.id, 'completed');
    console.log('Order status updated to completed');

    console.log('About to create book order...');
    // Create book order record
    const bookOrder = await createBookOrder(
      order.id,
      validatedBookTitle,
      productTypeKey,
      artStyle || 'Cartoon',
      personalMessage || ''
    );
    console.log('Book order created:', bookOrder.id);

    // Create character record if we have character data
    if (characterName) {
      console.log('About to create character record...');
      await createCharacter(
        bookOrder.id,
        characterName,
        characterAge || '',
        validatedPhotoUrls.join(',') || ''
      );
      console.log('Character record created');
    }

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url,
      orderId: order.id
    });

  } catch (error) {
    console.error('Checkout error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error,
      error: error
    });
    
    // Log environment variable status (without exposing values)
    console.error('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasServiceUrl: !!process.env.NEXT_PUBLIC_AI_SERVICE_URL
    });
    
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
