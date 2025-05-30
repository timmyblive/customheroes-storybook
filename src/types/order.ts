export type OrderStatus = 
  | 'pending'
  | 'completed'
  | 'proof_generation'
  | 'proof_sent'
  | 'proof_approved'
  | 'proof_revision'
  | 'printing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Book {
  title: string;
  coverImage: string;
  pages: number;
  pdfUrl?: string;
}

export interface ProofSendRecord {
  id: string;
  proofUrl: string;
  sentAt: string;
  sentBy?: string;
  isRevision: boolean;
  revisionNumber?: number;
  emailStatus: 'sent' | 'failed' | 'delivered' | 'opened';
  emailId?: string;
}

export interface Proof {
  url?: string;
  status: 'pending' | 'uploaded' | 'sent' | 'approved' | 'revision_requested';
  sentAt?: string;
  approvedAt?: string;
  revisionCount?: number;
  customerNotes?: string;
  sendHistory?: ProofSendRecord[];
}

export interface Shipping {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  shippedAt?: string;
}

export interface Payment {
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  productType: string;
  bookTitle: string;
  characterName: string;
  characterAge: string;
  characterPhotoUrl?: string;
  artStyle: string;
  personalMessage?: string;
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  book: Book;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery?: string;
  proof?: Proof;
  shipping?: Shipping;
  payment?: Payment;
}
