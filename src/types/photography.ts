export interface Photography {
  id: string;
  title: string;
  category: PhotographyCategory;
  imageUrl: string;
  description?: string;
  order: number;
  featured: boolean;
}

export type PhotographyCategory =
  | 'newborn'
  | 'baby-milestone'
  | 'cake-smash'
  | 'pre-birthday'
  | 'family'
  | 'maternity';

export interface ServicePackage {
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: PhotographyCategory;
  imageUrl: string;
  gallery: string[];
  longDescription: string;
  idealFor: string;
  packages: ServicePackage[];
}

export interface StudioInfo {
  name: string;
  tagline: string;
  description: string;
  speciality: string;
  privacy: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  instagram: string;
  bookingMethod: 'whatsapp' | 'phone' | 'email' | 'form';
}
