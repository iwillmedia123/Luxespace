// Types for Luxespace Properties Foundation

export type Role = 'super_admin' | 'admin' | 'agent' | 'editor' | 'client';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  foundedYear?: number;
  website?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  coordinates?: { lat: number; lng: number };
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  profileId?: string;
  name: string;
  slug: string;
  title: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatarUrl?: string;
  languages: string[];
  specialization: string[];
  experienceYears?: number;
  bio?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'mansion' | 'duplex' | 'commercial' | 'retail' | 'office';
export type PropertyStatus = 'buy' | 'rent' | 'off-plan' | 'sold' | 'rented';
export type CompletionStatus = 'ready' | 'off-plan' | 'under-construction';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in AED
  priceUsd?: number;
  type: PropertyType;
  status: PropertyStatus;
  completionStatus: CompletionStatus;
  handoverDate?: string; // e.g. "Q4 2027"
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parking?: number;
  location: string;
  communityId: string;
  developerId?: string;
  agentId: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  videos?: string[];
  propertyPlanUrl?: string;
  amenities: string[];
  isFeatured: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional loaded)
  community?: Community;
  developer?: Developer;
  agent?: Agent;
}

export interface PropertyEnquiry {
  id: string;
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  message: string;
  createdAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string; // e.g. 'website_contact', 'whatsapp', 'property_detail'
  status: LeadStatus;
  propertyInterestId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 'in-person' | 'virtual' | 'phone_call';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  leadId: string;
  propertyId?: string;
  agentId: string;
  appointmentDate: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string; // e.g., "CEO, Global Tech"
  rating: number; // 1-5
  content: string;
  avatarUrl?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  authorId: string;
  publishedAt?: string;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex?: number;
  createdAt?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  year: number;
  issuer: string;
  description?: string;
  icon?: string;
  certificateUrl?: string;
  createdAt: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  type: 'developer' | 'bank' | 'legal' | 'mortgage';
  logoUrl: string;
  websiteUrl?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  type: 'brochure' | 'report' | 'guide' | 'floorplan';
  fileUrl: string;
  fileSize?: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface LifestyleArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  coverImage: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
