
export enum Species {
  Dog = 'Perro',
  Cat = 'Gato'
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite';

export interface DoctorSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled';
  nextBillingDate: string;
  price: number;
  usage: {
    clients: number;
    clientsLimit: number;
    invoices: number;
    invoicesLimit: number;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  phone: string;
  email: string;
  clinicName: string;
  subscription: DoctorSubscription;
}

export interface HaciendaConfig {
  apiUser: string;
  apiPass: string;
  pin: string;
  keyFileName: string;
  environment: 'sandbox' | 'production';
  isConfigured: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  date: string;
}

export interface MedicalEntry {
  id: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  attachments: Attachment[];
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  notified: boolean;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string;
  weight: number;
  ownerId: string;
  vaccinations: Vaccination[];
  history: MedicalEntry[];
}

export interface Client {
  id: string;
  cedula: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  pets: Pet[];
}

export type ItemType = 'product' | 'service' | 'bundle';

export interface ProductService {
  id: string;
  code: string; // CABYS
  sku?: string;
  name: string;
  description: string;
  price: number;
  taxRate: number;
  type: ItemType;
  stock?: number;
  category: string;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  tax: number;
  name: string;
  cabys: string;
}

export type DocumentType = 'FE' | 'TE' | 'NC'; 

export type SaleCondition = '01' | '02' | '03' | '04' | '99';
export type PaymentMethod = '01' | '02' | '03' | '04' | '05';
export type NCCode = '01' | '02' | '03';

export interface Invoice {
  id: string;
  consecutive: string; 
  clientId: string;
  clientName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  type: DocumentType;
  status: 'draft' | 'sending' | 'accepted' | 'rejected' | 'voided';
  paymentStatus: 'paid' | 'unpaid';
  saleCondition: SaleCondition;
  paymentMethod: PaymentMethod;
  creditTerm?: number;
  referenceId?: string; 
  voidReason?: string;
  ncCode?: NCCode;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'invoiced';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
