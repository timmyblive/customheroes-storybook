import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the connection string
// This follows Neon's recommended pattern for serverless environments
const createSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
};

// Database interfaces
export interface Customer {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  customer_id: number;
  stripe_session_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface BookOrder {
  id: number;
  order_id: number;
  title: string;
  package_type: string;
  art_style: string;
  personal_message: string;
  proof_url: string;
  revision_notes: string;
  created_at: Date;
}

export interface Character {
  id: number;
  book_order_id: number;
  name: string;
  age: string;
  photo_url: string;
  created_at: Date;
}

export interface GiftCard {
  id: number;
  code: string;
  initial_amount: number;
  remaining_amount: number;
  currency: string;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  created_at: Date;
  expires_at: Date | null;
  recipient_email: string | null;
  recipient_name: string | null;
  sender_name: string | null;
  sender_email: string | null;
  message: string | null;
  last_used_at: Date | null;
  stripe_payment_id: string | null;
}

export interface GiftCardTransaction {
  id: number;
  gift_card_id: number;
  order_id: string | null;
  amount: number;
  transaction_type: 'purchase' | 'redemption' | 'refund';
  created_at: Date;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const sql = createSql();
    
    // Create customers table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        stripe_session_id VARCHAR(500) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'usd',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create book_orders table
    await sql`
      CREATE TABLE IF NOT EXISTS book_orders (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        title VARCHAR(255) NOT NULL,
        package_type VARCHAR(100) NOT NULL,
        art_style VARCHAR(100) NOT NULL,
        personal_message TEXT,
        proof_url TEXT,
        revision_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create characters table
    await sql`
      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        book_order_id INTEGER REFERENCES book_orders(id),
        name VARCHAR(255) NOT NULL,
        age VARCHAR(50),
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
    return { success: true, message: 'Database tables created successfully' };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Customer operations
export async function createOrUpdateCustomer(email: string, name: string): Promise<Customer> {
  try {
    const sql = createSql();
    
    // Validate field lengths
    if (email.length > 255) {
      throw new Error(`Email too long: ${email.length} characters (max 255)`);
    }
    if (name.length > 255) {
      throw new Error(`Name too long: ${name.length} characters (max 255)`);
    }
    
    console.log('Creating/updating customer:', { email: email.substring(0, 50), name: name.substring(0, 50) });
    
    // Try to find existing customer
    const existingCustomer = await sql`
      SELECT * FROM customers WHERE email = ${email}
    `;

    if (existingCustomer.length > 0) {
      // Update existing customer
      const result = await sql`
        UPDATE customers 
        SET name = ${name}, updated_at = CURRENT_TIMESTAMP 
        WHERE email = ${email}
        RETURNING *
      `;
      return result[0] as Customer;
    } else {
      // Create new customer
      const result = await sql`
        INSERT INTO customers (email, name)
        VALUES (${email}, ${name})
        RETURNING *
      `;
      return result[0] as Customer;
    }
  } catch (error) {
    console.error('Error creating/updating customer:', error);
    throw error;
  }
}

// Order operations
export async function createOrder(
  customerId: number,
  stripeSessionId: string,
  amount: number,
  currency: string = 'usd'
): Promise<Order> {
  try {
    const sql = createSql();
    
    // Validate field lengths
    if (stripeSessionId.length > 500) {
      throw new Error(`Stripe session ID too long: ${stripeSessionId.length} characters (max 500)`);
    }
    if (currency.length > 10) {
      throw new Error(`Currency too long: ${currency.length} characters (max 10)`);
    }
    
    console.log('Creating order:', { customerId, stripeSessionId: stripeSessionId.substring(0, 50), amount, currency });
    
    const result = await sql`
      INSERT INTO orders (customer_id, stripe_session_id, amount, currency)
      VALUES (${customerId}, ${stripeSessionId}, ${amount}, ${currency})
      RETURNING *
    `;
    return result[0] as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(stripeSessionId: string, status: string): Promise<Order> {
  try {
    const sql = createSql();
    
    // Validate field lengths
    if (status.length > 50) {
      throw new Error(`Status too long: ${status.length} characters (max 50)`);
    }
    
    console.log('Updating order status:', { stripeSessionId: stripeSessionId.substring(0, 50), status });
    
    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE stripe_session_id = ${stripeSessionId}
      RETURNING *
    `;
    return result[0] as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Book order operations
export async function createBookOrder(
  orderId: number,
  title: string,
  packageType: string,
  artStyle: string,
  personalMessage: string
): Promise<BookOrder> {
  try {
    const sql = createSql();
    
    // Validate field lengths
    if (title.length > 255) {
      throw new Error(`Title too long: ${title.length} characters (max 255)`);
    }
    if (packageType.length > 100) {
      throw new Error(`Package type too long: ${packageType.length} characters (max 100)`);
    }
    if (artStyle.length > 100) {
      throw new Error(`Art style too long: ${artStyle.length} characters (max 100)`);
    }
    
    console.log('Creating book order:', { orderId, title: title.substring(0, 50), packageType: packageType.substring(0, 50), artStyle: artStyle.substring(0, 50) });
    
    const result = await sql`
      INSERT INTO book_orders (order_id, title, package_type, art_style, personal_message)
      VALUES (${orderId}, ${title}, ${packageType}, ${artStyle}, ${personalMessage})
      RETURNING *
    `;
    return result[0] as BookOrder;
  } catch (error) {
    console.error('Error creating book order:', error);
    throw error;
  }
}

// Character operations
export async function createCharacter(
  bookOrderId: number,
  name: string,
  age: string,
  photoUrl: string
): Promise<Character> {
  try {
    const sql = createSql();
    
    // Validate field lengths
    if (name.length > 255) {
      throw new Error(`Name too long: ${name.length} characters (max 255)`);
    }
    if (age.length > 50) {
      throw new Error(`Age too long: ${age.length} characters (max 50)`);
    }
    
    console.log('Creating character:', { bookOrderId, name: name.substring(0, 50), age: age.substring(0, 50) });
    
    const result = await sql`
      INSERT INTO characters (book_order_id, name, age, photo_url)
      VALUES (${bookOrderId}, ${name}, ${age}, ${photoUrl})
      RETURNING *
    `;
    return result[0] as Character;
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
}

// Get complete order details by order ID (for admin dashboard)
export async function getOrderWithDetailsById(orderId: string) {
  try {
    const sql = createSql();
    
    const result = await sql`
      SELECT 
        o.*,
        c.email as customer_email,
        c.name as customer_name,
        bo.title as book_title,
        bo.package_type,
        bo.art_style,
        bo.personal_message,
        bo.proof_url,
        bo.revision_notes,
        ch.name as character_name,
        ch.age as character_age,
        ch.photo_url as character_photo_url
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN book_orders bo ON bo.order_id = o.id
      LEFT JOIN characters ch ON ch.book_order_id = bo.id
      WHERE o.id = ${parseInt(orderId)}
    `;
    return result;
  } catch (error) {
    console.error('Error getting order details by ID:', error);
    throw error;
  }
}

// Get complete order details
export async function getOrderWithDetails(stripeSessionId: string) {
  try {
    const sql = createSql();
    
    const result = await sql`
      SELECT 
        o.*,
        c.email as customer_email,
        c.name as customer_name,
        bo.title as book_title,
        bo.package_type,
        bo.art_style,
        bo.personal_message,
        bo.proof_url,
        bo.revision_notes,
        ch.name as character_name,
        ch.age as character_age,
        ch.photo_url as character_photo_url
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN book_orders bo ON bo.order_id = o.id
      LEFT JOIN characters ch ON ch.book_order_id = bo.id
      WHERE o.stripe_session_id = ${stripeSessionId}
    `;
    return result;
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
}

// Update proof URL for an order
export async function updateProofUrl(stripeSessionId: string, proofUrl: string) {
  try {
    const sql = createSql();
    
    const result = await sql`
      UPDATE book_orders 
      SET proof_url = ${proofUrl}
      FROM orders o
      WHERE book_orders.order_id = o.id 
      AND o.stripe_session_id = ${stripeSessionId}
      RETURNING book_orders.*
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error updating proof URL:', error);
    throw error;
  }
}

// Update revision notes for an order
export async function updateRevisionNotes(stripeSessionId: string, revisionNotes: string) {
  try {
    const sql = createSql();
    
    const result = await sql`
      UPDATE book_orders
      SET revision_notes = ${revisionNotes}
      FROM orders
      WHERE book_orders.order_id = orders.id
      AND orders.stripe_session_id = ${stripeSessionId}
      RETURNING book_orders.*
    `;
    
    if (result.length === 0) {
      throw new Error(`No book order found for stripe session ID: ${stripeSessionId}`);
    }
    
    return result[0];
  } catch (error) {
    console.error('Error updating revision notes:', error);
    throw error;
  }
}

// Gift Card Operations

// Generate a unique gift card code
export function generateGiftCardCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters like O, 0, I, 1
  const codeLength = 12;
  let code = '';
  
  // Generate 3 groups of 4 characters separated by hyphens (e.g., ABCD-1234-XYZ9)
  for (let i = 0; i < codeLength; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-';
    }
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

// Create a new gift card
export async function createGiftCard(
  initialAmount: number,
  currency: string = 'USD',
  recipientEmail?: string,
  recipientName?: string,
  senderName?: string,
  senderEmail?: string,
  message?: string,
  expiresAt?: Date,
  stripePaymentId?: string
): Promise<GiftCard> {
  try {
    const sql = createSql();
    let code: string;
    let codeExists = true;
    
    // Keep generating codes until we find a unique one
    while (codeExists) {
      code = generateGiftCardCode();
      const existingCodes = await sql`
        SELECT code FROM gift_cards WHERE code = ${code}
      `;
      codeExists = existingCodes.length > 0;
    }
    
    const result = await sql`
      INSERT INTO gift_cards (
        code,
        initial_amount,
        remaining_amount,
        currency,
        status,
        recipient_email,
        recipient_name,
        sender_name,
        sender_email,
        message,
        expires_at,
        stripe_payment_id
      ) VALUES (
        ${code!},
        ${initialAmount},
        ${initialAmount},
        ${currency},
        'active',
        ${recipientEmail || null},
        ${recipientName || null},
        ${senderName || null},
        ${senderEmail || null},
        ${message || null},
        ${expiresAt || null},
        ${stripePaymentId || null}
      ) RETURNING *
    `;
    
    return result[0] as GiftCard;
  } catch (error) {
    console.error('Error creating gift card:', error);
    throw error;
  }
}

// Record a gift card transaction
export async function recordGiftCardTransaction(
  giftCardId: number,
  amount: number,
  transactionType: 'purchase' | 'redemption' | 'refund',
  orderId?: string
): Promise<GiftCardTransaction> {
  try {
    const sql = createSql();
    
    const result = await sql`
      INSERT INTO gift_card_transactions (
        gift_card_id,
        amount,
        transaction_type,
        order_id
      ) VALUES (
        ${giftCardId},
        ${amount},
        ${transactionType},
        ${orderId || null}
      ) RETURNING *
    `;
    
    return result[0] as GiftCardTransaction;
  } catch (error) {
    console.error('Error recording gift card transaction:', error);
    throw error;
  }
}

// Get gift card by code
export async function getGiftCardByCode(code: string): Promise<GiftCard | null> {
  try {
    const sql = createSql();
    
    const result = await sql`
      SELECT * FROM gift_cards WHERE code = ${code}
    `;
    
    return result.length > 0 ? result[0] as GiftCard : null;
  } catch (error) {
    console.error('Error getting gift card by code:', error);
    throw error;
  }
}

// Update gift card remaining balance
export async function updateGiftCardBalance(
  giftCardId: number,
  newRemainingAmount: number,
  lastUsedAt: Date = new Date()
): Promise<GiftCard> {
  try {
    const sql = createSql();
    
    const result = await sql`
      UPDATE gift_cards
      SET 
        remaining_amount = ${newRemainingAmount},
        last_used_at = ${lastUsedAt},
        status = CASE 
          WHEN ${newRemainingAmount} <= 0 THEN 'redeemed'
          ELSE status
        END
      WHERE id = ${giftCardId}
      RETURNING *
    `;
    
    if (result.length === 0) {
      throw new Error(`No gift card found with ID: ${giftCardId}`);
    }
    
    return result[0] as GiftCard;
  } catch (error) {
    console.error('Error updating gift card balance:', error);
    throw error;
  }
}

// Get gift card transactions
export async function getGiftCardTransactions(giftCardId: number): Promise<GiftCardTransaction[]> {
  try {
    const sql = createSql();
    
    const result = await sql`
      SELECT * FROM gift_card_transactions 
      WHERE gift_card_id = ${giftCardId}
      ORDER BY created_at DESC
    `;
    
    return result as GiftCardTransaction[];
  } catch (error) {
    console.error('Error getting gift card transactions:', error);
    throw error;
  }
}

// Get all gift cards (for admin dashboard)
export async function getAllGiftCards(): Promise<GiftCard[]> {
  try {
    const sql = createSql();
    
    const result = await sql`
      SELECT * FROM gift_cards
      ORDER BY created_at DESC
    `;
    
    return result as GiftCard[];
  } catch (error) {
    console.error('Error getting all gift cards:', error);
    throw error;
  }
}
