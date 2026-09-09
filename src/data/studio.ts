export const studio = {
  name: 'Precious One Photography',
  shortName: 'Precious One',
  tagline: 'Newborn and family photography in Abu Dhabi',
  description:
    'A private, women-only newborn and family photography studio in Abu Dhabi. Gentle, unhurried sessions for newborns, babies, mothers-to-be and families.',
  // TODO: replace with the studio's real numbers before launch.
  phone: '+971 50 123 4567',
  whatsapp: '+971 50 123 4567',
  email: 'hello@preciousonephotography.com',
  address: 'Abu Dhabi, United Arab Emirates',
  hours: 'Every day, 9am to 6pm',
  instagram: 'https://www.instagram.com/preciousonephotography',
  city: 'Abu Dhabi',
};

export const whatsappDigits = studio.whatsapp.replace(/[^0-9]/g, '');

/** wa.me link with an optional pre-filled message. */
export const whatsappLink = (message?: string) =>
  `https://wa.me/${whatsappDigits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const telLink = `tel:${studio.phone.replace(/\s+/g, '')}`;

export interface Package {
  name: string;
  price: string;
  popular?: boolean;
  includes: string[];
}

export interface Service {
  id: string;
  title: string;
  /** Short name used in navigation and cards. */
  name: string;
  summary: string;
  story: string;
  idealFor: string;
  /** Photo ids from photos.ts. The first is the cover. */
  photos: string[];
  packages: Package[];
}

export const services: Service[] = [
  {
    id: 'newborn',
    title: 'Newborn photography',
    name: 'Newborn',
    summary: 'The tiny details of the first two weeks, photographed slowly and safely.',
    story:
      'The first weeks pass in a blur of feeds and naps, and then the curled-up newborn stage is gone. Our newborn sessions are paced entirely around your baby: the studio is kept warm, there is time to feed and settle, and every pose is chosen with safety first. We use soft natural light and a small collection of wraps, bonnets and props to make portraits that feel calm and timeless.',
    idealFor: 'Babies between 5 and 14 days old, in our warm Abu Dhabi studio.',
    photos: ['pearls', 'basket', 'knitted-friends', 'powder-blue', 'fox', 'pink-lace'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 1,200',
        includes: ['2-hour studio session', '15 edited photographs', '1 setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,800',
        popular: true,
        includes: [
          '3-hour studio session',
          '30 edited photographs',
          '3 setups',
          'Parents and siblings included',
          'Fine-art retouching',
        ],
      },
      {
        name: 'Complete',
        price: 'AED 2,500',
        includes: [
          '4-hour studio session',
          '45 edited photographs',
          'Unlimited setups and props',
          'Parents and siblings included',
          '10×8 fine-art print',
          'Leather keepsake album',
        ],
      },
    ],
  },
  {
    id: 'baby-milestone',
    title: 'Baby milestone photography',
    name: 'Milestones',
    summary: 'First smiles, sitting up, first steps: every stage, as it happens.',
    story:
      'From the first gummy smile to sitting, crawling and those wobbly first steps, each stage is a chapter worth keeping. Milestone sessions are relaxed and playful, built around what your baby can do right now, with gentle prompts and simple styling so their personality comes through.',
    idealFor: 'Babies from 4 to 12 months, at whichever stage they have just reached.',
    photos: ['swing', 'fox', 'knitted-friends'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 900',
        includes: ['1.5-hour studio session', '12 edited photographs', '1 setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,400',
        popular: true,
        includes: [
          '2.5-hour studio session',
          '25 edited photographs',
          '3 setups',
          'Family included',
          'Fine-art retouching',
        ],
      },
      {
        name: 'Complete',
        price: 'AED 1,900',
        includes: [
          '3-hour studio session',
          '35 edited photographs',
          'Unlimited setups and props',
          'Family and siblings included',
          'Fine-art print',
          'Keepsake album',
        ],
      },
    ],
  },
  {
    id: 'cake-smash',
    title: 'Cake smash photography',
    name: 'Cake smash',
    summary: 'A first birthday, a cake, and permission to make a glorious mess.',
    story:
      'One year old, one very excited little person, and one cake. Cake smash sessions are about letting go of “perfect” and enjoying the mess. We design a small set around your child’s favourite colours, provide the smash cake, and photograph every giggle and frosting-covered grin. A bubble bath or splash set finishes the story.',
    idealFor: 'Babies around their first birthday.',
    photos: ['tutu', 'pink-lace', 'basket'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 1,100',
        includes: ['2-hour studio session', '15 edited photographs', '1 themed set and smash cake', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,600',
        popular: true,
        includes: [
          '2.5-hour studio session',
          '30 edited photographs',
          '2 themed sets',
          'Smash cake and bubble bath',
          'Family included',
        ],
      },
      {
        name: 'Complete',
        price: 'AED 2,100',
        includes: [
          '3-hour studio session',
          '45 edited photographs',
          'Unlimited set changes',
          'Smash, bath and cake photographs',
          'Fine-art print',
          'Keepsake album',
        ],
      },
    ],
  },
  {
    id: 'pre-birthday',
    title: 'Pre-birthday photography',
    name: 'Pre-birthday',
    summary: 'The quiet, excited weeks just before the first birthday.',
    story:
      'The weeks before a first birthday have a feeling of their own: the balloons being planned, the excitement building in little eyes. Pre-birthday sessions capture your child at eleven-and-a-half months, standing at the edge of their first year, with soft styling that sits beautifully beside the cake smash photographs.',
    idealFor: 'Babies from 11 to 12 months.',
    photos: ['pink-lace', 'tutu', 'swing'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 850',
        includes: ['1.5-hour studio session', '12 edited photographs', '1 setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,300',
        popular: true,
        includes: ['2-hour studio session', '25 edited photographs', '3 setups', 'Family included'],
      },
      {
        name: 'Complete',
        price: 'AED 1,750',
        includes: [
          '2.5-hour studio session',
          '35 edited photographs',
          'Unlimited setups',
          'Fine-art print',
          'Keepsake album',
        ],
      },
    ],
  },
  {
    id: 'family',
    title: 'Family photography',
    name: 'Family',
    summary: 'Unhurried portraits of the people who make your family yours.',
    story:
      'Some of the most treasured photographs a family owns are the ones taken together. Family sessions are relaxed and unhurried. We guide you gently through a few poses and playful prompts so that everyone, from grandparents to the smallest sibling, feels at ease, and we keep the in-between moments too.',
    idealFor: 'New parents, growing families and multi-generation gatherings.',
    photos: ['family-dog', 'parents', 'father', 'twins', 'sibling-kiss'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 1,000',
        includes: ['1.5-hour session', '15 edited photographs', 'Studio or outdoors', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,500',
        popular: true,
        includes: [
          '2-hour session',
          '30 edited photographs',
          '2 locations',
          'Up to 5 family members',
          'Fine-art retouching',
        ],
      },
      {
        name: 'Complete',
        price: 'AED 2,000',
        includes: [
          '2.5-hour session',
          '45 edited photographs',
          'Unlimited family members',
          'Multiple locations',
          'Fine-art print',
          'Keepsake album',
        ],
      },
    ],
  },
  {
    id: 'maternity',
    title: 'Maternity photography',
    name: 'Maternity',
    summary: 'Soft, private portraits of the weeks before your baby arrives.',
    story:
      'Pregnancy is one of the most fleeting chapters of a woman’s life. Maternity sessions honour it with soft-light portraiture and a curated wardrobe of flowing gowns and draped fabrics. Every session is photographed, edited and printed by our all-women team, with complete discretion.',
    idealFor: 'Mothers-to-be between 28 and 36 weeks.',
    photos: ['parents', 'fingers', 'toes'],
    packages: [
      {
        name: 'Essential',
        price: 'AED 1,100',
        includes: ['1.5-hour studio session', '15 edited photographs', 'Gown and fabric wardrobe', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 'AED 1,600',
        popular: true,
        includes: [
          '2-hour studio session',
          '30 edited photographs',
          'Partner included',
          '3 outfit changes',
          'Fine-art retouching',
        ],
      },
      {
        name: 'Complete',
        price: 'AED 2,200',
        includes: [
          '2.5-hour studio session',
          '45 edited photographs',
          'Unlimited outfit changes',
          'Partner and siblings included',
          'Fine-art print',
          'Keepsake album',
        ],
      },
    ],
  },
];

export const serviceById = (id: string) => services.find((s) => s.id === id);

/** Lowest package price, for "from AED …" labels. */
export const fromPrice = (service: Service) => service.packages[0]?.price ?? '';

export const promises = [
  {
    title: 'Photographed, edited and printed by women',
    body: 'Every part of the process, from the session to the final prints, is handled by our all-women team.',
  },
  {
    title: 'A private studio',
    body: 'One family at a time, behind closed doors, so you can feed, change and rest without an audience.',
  },
  {
    title: 'Newborn safety first',
    body: 'Warm rooms, supported poses, and no pose your baby is not ready for. We never rush a sleeping newborn.',
  },
  {
    title: 'Respect for your family and culture',
    body: 'The whole experience is designed around local culture and the privacy of your family.',
  },
];

export const steps = [
  {
    title: 'Message us on WhatsApp',
    body: 'Tell us your due date, or your baby’s age, and the kind of session you have in mind. We reply the same day.',
  },
  {
    title: 'We plan it together',
    body: 'We agree a date, the setups and colours you love, and what to bring. Newborns photograph best between 5 and 14 days old, so we hold a provisional date around your due date.',
  },
  {
    title: 'Your session, then your gallery',
    body: 'A calm two to four hours in a warm studio, at your baby’s pace. Your edited photographs arrive in a private online gallery, ready for prints and albums.',
  },
];

export const testimonials = [
  {
    quote:
      'They captured our baby’s very first days with such patience and tenderness. Every frame feels like a piece of art we will treasure forever.',
    name: 'Aisha M.',
    detail: 'Newborn session',
    photo: 'pink-lace',
  },
  {
    quote: 'Warm, private, and completely stress-free. Our family photograph brought my parents to tears.',
    name: 'The Khan family',
    detail: 'Family session',
    photo: 'parents',
  },
  {
    quote:
      'From the booking to the final prints, everything felt personal. We booked again for the cake smash before we even left.',
    name: 'Layla and Omar',
    detail: 'Newborn and cake smash sessions',
    photo: 'swing',
  },
];

// TODO: confirm these figures with the studio before launch.
export const stats: { value: number; decimals?: number; suffix?: string; label: string; sub: string }[] = [
  { value: 1500, suffix: '+', label: 'Little moments', sub: 'photographed with love' },
  { value: 10, suffix: '+', label: 'Years of experience', sub: 'in Abu Dhabi' },
  { value: 5, decimals: 1, label: 'Family rating', sub: 'on Google reviews' },
  { value: 100, suffix: '%', label: 'Women-only team', sub: 'in a private studio' },
];

export const faqs = [
  {
    q: 'When should I book a newborn session?',
    a: 'Ideally while you are still pregnant, around the second trimester. We hold a provisional date around your due date and confirm once your baby arrives. The best window for curled-up newborn portraits is 5 to 14 days after birth.',
  },
  {
    q: 'Is the studio really women-only?',
    a: 'Yes. Photography, editing and printing are all done by women, and only your family is in the studio during your session.',
  },
  {
    q: 'How long does a newborn session take?',
    a: 'Two to four hours, depending on the package. Most of that time is spent settling, feeding and soothing. We never rush a sleeping baby.',
  },
  {
    q: 'What should we bring?',
    a: 'Just your baby, milk, and a spare outfit for you. Wraps, bonnets, baskets and props are all provided. If you have something meaningful, such as a family blanket, bring it along.',
  },
  {
    q: 'Can parents and siblings be in the photographs?',
    a: 'Yes. Signature and Complete packages include parents and siblings. We recommend soft, neutral colours so that the baby stays the focus.',
  },
  {
    q: 'How and when do we receive our photographs?',
    a: 'Your edited photographs are delivered in a private online gallery, from which you can download, share with family and order prints and albums.',
  },
];
