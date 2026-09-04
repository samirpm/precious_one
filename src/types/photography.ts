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

export interface Service {
  id: string;
  title: string;
  description: string;
  category: PhotographyCategory;
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
