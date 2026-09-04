import { StudioInfo, Service, Photography } from '@/types/photography';

export const studioInfo: StudioInfo = {
  name: 'Precious One Photography',
  tagline: 'Timeless Memories of Your Most Precious Moments',
  description:
    'Welcome to Precious One Photography, an Abu Dhabi-based photography studio specialising in baby and family photography.',
  speciality:
    'We have a special love for newborn photography. Those first few days are incredibly precious and pass by so quickly. We focus on capturing your baby\'s tiny details, beautiful expressions, and those once-in-a-lifetime moments in a timeless and artistic way. Every session is thoughtfully planned with care, patience, and attention to detail to ensure a comfortable experience for both baby and family.',
  privacy:
    'Your comfort, privacy, and security are extremely important to us. To provide a comfortable experience that respects local culture and family privacy, the entire process at Precious One Photography—including photography, editing, and printing—is handled exclusively by women. We are committed to creating a welcoming and private environment where families can feel completely comfortable throughout their photography experience.',
  phone: '+971 50 123 4567',
  whatsapp: '+971 50 123 4567',
  email: 'hello@preciousonephotography.com',
  address: 'Abu Dhabi, United Arab Emirates',
  openingHours: 'Sunday - Saturday: 9:00 AM - 6:00 PM',
  instagram: 'https://www.instagram.com/preciousonephotography',
  bookingMethod: 'whatsapp',
};

export const services: Service[] = [
  {
    id: 'newborn',
    title: 'Newborn Photography',
    description:
      'Capturing the delicate details and fleeting moments of your baby\'s first days with timeless artistry.',
    category: 'newborn',
  },
  {
    id: 'baby-milestone',
    title: 'Baby Milestone Photography',
    description:
      'Celebrating every precious milestone from first smiles to first steps.',
    category: 'baby-milestone',
  },
  {
    id: 'cake-smash',
    title: 'Cake Smash Photography',
    description:
      'Joyful and playful sessions celebrating your little one\'s first birthday.',
    category: 'cake-smash',
  },
  {
    id: 'pre-birthday',
    title: 'Pre-Birthday Photography',
    description:
      'Anticipation and excitement captured before the big celebration.',
    category: 'pre-birthday',
  },
  {
    id: 'family',
    title: 'Family Sessions',
    description:
      'Beautiful portraits that celebrate the love shared between family members.',
    category: 'family',
  },
  {
    id: 'maternity',
    title: 'Maternity Photography',
    description:
      'Elegantly documenting the beautiful journey of motherhood.',
    category: 'maternity',
  },
];

export const portfolio: Photography[] = [
  {
    id: 'newborn-1',
    title: 'Tiny Details',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-1.jpeg',
    description: 'Beautiful newborn photography capturing tiny details',
    order: 1,
    featured: true,
  },
  {
    id: 'newborn-2',
    title: 'Peaceful Dreams',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-2.jpeg',
    description: 'Serene newborn portrait with delicate headband',
    order: 2,
    featured: true,
  },
  {
    id: 'newborn-3',
    title: 'Sweet Slumber',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-3.jpeg',
    description: 'Peaceful sleeping newborn on soft pink backdrop',
    order: 3,
    featured: true,
  },
  {
    id: 'newborn-4',
    title: 'Little Explorer',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-4.jpeg',
    description: 'Adorable newborn on swing with teddy bear',
    order: 4,
    featured: true,
  },
  {
    id: 'newborn-5',
    title: 'Wrapped in Love',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-5.jpeg',
    description: 'Swaddled newborn in warm embrace',
    order: 5,
    featured: false,
  },
  {
    id: 'newborn-6',
    title: 'First Moments',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-6.jpeg',
    description: 'Capturing the very first moments of life',
    order: 6,
    featured: false,
  },
  {
    id: 'newborn-7',
    title: 'Gentle Touch',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-7.jpeg',
    description: 'Delicate newborn details captured beautifully',
    order: 7,
    featured: false,
  },
  {
    id: 'newborn-8',
    title: 'Angel Baby',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-8.jpeg',
    description: 'Angelic newborn portrait with soft lighting',
    order: 8,
    featured: false,
  },
  {
    id: 'newborn-9',
    title: 'Tiny Treasures',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-9.jpeg',
    description: 'Cherishing the tiny treasures of newborn days',
    order: 9,
    featured: false,
  },
  {
    id: 'newborn-10',
    title: 'Pure Love',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-10.jpeg',
    description: 'Pure love captured in a single frame',
    order: 10,
    featured: false,
  },
  {
    id: 'newborn-11',
    title: 'Dreamy Eyes',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-11.jpeg',
    description: 'Newborn with dreamy peaceful expression',
    order: 11,
    featured: false,
  },
  {
    id: 'newborn-12',
    title: 'Soft Embrace',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-12.jpeg',
    description: 'Newborn wrapped in soft comforting embrace',
    order: 12,
    featured: false,
  },
  {
    id: 'newborn-13',
    title: 'Little Star',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-13.jpeg',
    description: 'Our little star shining bright',
    order: 13,
    featured: false,
  },
  {
    id: 'newborn-14',
    title: 'Precious Smile',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-14.jpeg',
    description: 'A precious smile that melts hearts',
    order: 14,
    featured: false,
  },
  {
    id: 'newborn-15',
    title: 'Sweet Dreams',
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-15.jpeg',
    description: 'Dreaming of a beautiful future',
    order: 15,
    featured: false,
  },
];

export const heroMessage = 'Capturing the moments you will treasure forever.';
