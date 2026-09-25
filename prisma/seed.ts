/*
 * Idempotent seed — running `npx prisma db seed` repeatedly must not create
 * duplicates. Records are identified by natural keys (Admin.email,
 * Package unique [serviceId, slug]) or fixed UUIDs.
 */
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

/* ─── Admin ─── */

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@preciousonephotography.com';
  const password = process.env.ADMIN_SEED_PASSWORD ?? "Precious-One-7!";
  const passwordHash = await hashPassword(password);

  await prisma.admin.upsert({
    where: { email },
    update: {}, // keep existing password if admin already exists
    create: { email, name: 'Studio Admin', passwordHash },
  });
  console.log(`✓ admin ${email}`);
}

/* ─── Banners (hero carousel, 3) ─── */

const BANNERS = [
  {
    id: randomUUID(),
    title: 'Timeless Memories, Beautifully Preserved',
    subtitle: 'Newborn · Baby · Family — Abu Dhabi',
    imageUrl: '/images/portfolio/photo-5.jpeg',
    buttonText: 'Book a Session',
    buttonUrl: '#contact',
    displayOrder: 1,
  },
  {
    id: randomUUID(),
    title: 'The First Days, Captured Forever',
    subtitle: 'Gentle newborn sessions in a warm private studio',
    imageUrl: '/images/portfolio/photo-1.jpeg',
    buttonText: 'Book a Session',
    buttonUrl: '#contact',
    displayOrder: 2,
  },
  {
    id: randomUUID(),
    title: 'Every Milestone Deserves a Portrait',
    subtitle: 'From first smiles to first steps — and everything between',
    imageUrl: '/images/portfolio/photo-3.jpeg',
    buttonText: 'Book a Session',
    buttonUrl: '#contact',
    displayOrder: 3,
  },
];

async function seedBanners() {
  const existing = await prisma.banner.count();
  if (existing > 0) {
    console.log(`• banners skipped (${existing} already present)`);
    return;
  }
  await prisma.banner.createMany({ data: BANNERS });
  console.log(`✓ ${BANNERS.length} banners`);
}

/* ─── Portfolio (30 images mirroring the live Supabase data) ─── */

const PORTFOLIO: Array<[string, string, string, string, number, boolean]> = [
  ['Tiny Details', 'newborn', '/images/portfolio/photo-1.jpeg', 'Beautiful newborn photography capturing tiny details', 1, true],
  ['Peaceful Dreams', 'newborn', '/images/portfolio/photo-2.jpeg', 'Serene newborn portrait with delicate headband', 2, true],
  ['Sweet Slumber', 'newborn', '/images/portfolio/photo-3.jpeg', 'Peaceful sleeping newborn on soft pink backdrop', 3, true],
  ['Little Explorer', 'newborn', '/images/portfolio/photo-4.jpeg', 'Adorable newborn on swing with teddy bear', 4, true],
  ['Wrapped in Love', 'newborn', '/images/portfolio/photo-5.jpeg', 'Swaddled newborn in warm embrace', 5, false],
  ['First Moments', 'newborn', '/images/portfolio/photo-6.jpeg', 'Capturing the very first moments of life', 6, false],
  ['Gentle Touch', 'newborn', '/images/portfolio/photo-7.jpeg', 'Delicate newborn details captured beautifully', 7, false],
  ['Angel Baby', 'newborn', '/images/portfolio/photo-8.jpeg', 'Angelic newborn portrait with soft lighting', 8, false],
  ['Tiny Treasures', 'newborn', '/images/portfolio/photo-9.jpeg', 'Cherishing the tiny treasures of newborn days', 9, false],
  ['Pure Love', 'newborn', '/images/portfolio/photo-10.jpeg', 'Pure love captured in a single frame', 10, false],
  ['Dreamy Eyes', 'newborn', '/images/portfolio/photo-11.jpeg', 'Newborn with dreamy peaceful expression', 11, false],
  ['Soft Embrace', 'newborn', '/images/portfolio/photo-12.jpeg', 'Newborn wrapped in soft comforting embrace', 12, false],
  ['Little Star', 'newborn', '/images/portfolio/photo-13.jpeg', 'Our little star shining bright', 13, false],
  ['Precious Smile', 'newborn', '/images/portfolio/photo-14.jpeg', 'A precious smile that melts hearts', 14, false],
  ['Sweet Dreams', 'newborn', '/images/portfolio/photo-15.jpeg', 'Dreaming of a beautiful future', 15, false],
  ['Little Hands', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.10 PM.jpeg', 'Tiny newborn hands cradled with love', 16, true],
  ['Basket Dreams', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.10 PM (1).jpeg', 'Newborn sleeping peacefully in a woven basket', 17, true],
  ['Tiny Toes', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.10 PM (2).jpeg', 'Close-up of adorable tiny toes', 18, false],
  ['Wrapped in Blooms', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM.jpeg', 'Newborn nestled among delicate florals', 19, true],
  ["Father's Embrace", 'family', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (1).jpeg', 'A father tenderly holding his newborn', 20, true],
  ["Parent's Love", 'family', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (2).jpeg', 'Parents gazing at their newborn with adoration', 21, false],
  ['Lace Dreams', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (3).jpeg', 'Newborn portrait with delicate lace details', 22, false],
  ['Teddy Bear', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.12 PM.jpeg', 'Newborn cuddled with a soft teddy bear', 23, true],
  ['Complete Family', 'family', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.12 PM (1).jpeg', 'The whole family together in one beautiful frame', 24, true],
  ["Big Brother's Love", 'family', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.12 PM (2).jpeg', 'Big brother meeting his new sibling', 25, false],
  ['Swinging Dreams', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM.jpeg', 'Newborn in denim overalls on a rustic swing', 26, true],
  ['Floral Embrace', 'family', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM (1).jpeg', 'Family portrait against a lush floral backdrop', 27, false],
  ['Purple Dreams', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM (2).jpeg', 'Newborn in a ruffled purple tutu with flower headband', 28, true],
  ['Bear Cuddle', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.14 PM.jpeg', 'Sleeping newborn in a fuzzy bear hood', 29, false],
  ['Snuggle Friends', 'newborn', '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.14 PM (1).jpeg', 'Newborn surrounded by soft teddy friends', 30, true],
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function seedPortfolio() {
  const existing = await prisma.portfolioImage.count();
  if (existing > 0) {
    console.log(`• portfolio skipped (${existing} already present)`);
    return;
  }
  await prisma.portfolioImage.createMany({
    data: PORTFOLIO.map(([title, category, imageUrl, description, displayOrder, featured]) => ({
      id: randomUUID(),
      title,
      category,
      imageUrl,
      description,
      displayOrder,
      featured,
      isActive: true,
    })),
  });
  console.log(`✓ ${PORTFOLIO.length} portfolio images`);
}

/* ─── Testimonials (6, mirroring live data) ─── */

const TESTIMONIALS = [
  {
    quote: "They captured our baby's very first days with such patience and tenderness. Every frame feels like a piece of art we will treasure forever.",
    name: 'Aisha M.',
    role: 'First-time mum · Al Reem Island',
    imageUrl: '/images/portfolio/photo-8.jpeg',
    altText: 'A peaceful newborn portrait in soft studio light',
    displayOrder: 1,
    rating: 5,
  },
  {
    quote: 'Warm, private, and completely stress-free. Our family photograph brought my parents to tears.',
    name: 'The Khan Family',
    role: 'Saadiyat Island',
    imageUrl: '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM (1).jpeg',
    altText: 'A family portrait against a floral backdrop',
    displayOrder: 2,
    rating: 5,
  },
  {
    quote: 'From the booking to the final prints, everything felt personal. We booked again for the cake smash before we even left.',
    name: 'Layla & Omar',
    role: 'Yas Island',
    imageUrl: '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (3).jpeg',
    altText: 'A delicate newborn portrait in lace',
    displayOrder: 3,
    rating: 5,
  },
  {
    quote: 'We left the session feeling like family. Every image we received felt effortless, candid, and full of light.',
    name: 'Fatima & Khaled',
    role: 'Parents · Baniyas',
    imageUrl: '/images/portfolio/photo-2.jpeg',
    altText: 'A serene newborn portrait with a delicate headband',
    displayOrder: 4,
    rating: 5,
  },
  {
    quote: 'The kind of care you cannot put a price on. She waited, she whispered, she caught the exact moment our daughter smiled.',
    name: 'Noor E.',
    role: 'New mum · Al Raha Beach',
    imageUrl: '/images/portfolio/photo-5.jpeg',
    altText: 'A swaddled newborn held in a warm embrace',
    displayOrder: 5,
    rating: 5,
  },
  {
    quote: 'We framed three prints for the nursery and one for the hall. Guests keep mistaking them for painted art.',
    name: 'Asma & Rakan',
    role: 'Parents · Corniche',
    imageUrl: '/images/portfolio/photo-11.jpeg',
    altText: 'A newborn with a dreamy, peaceful expression',
    displayOrder: 6,
    rating: 5,
  },
];

async function seedTestimonials() {
  const existing = await prisma.testimonial.count();
  if (existing > 0) {
    console.log(`• testimonials skipped (${existing} already present)`);
    return;
  }
  await prisma.testimonial.createMany({ data: TESTIMONIALS.map((t) => ({ ...t, isActive: true })) });
  console.log(`✓ ${TESTIMONIALS.length} testimonials`);
}

/* ─── Services + Packages + PackageDetails (mirroring live data) ─── */

type Pkg = {
  name: string;
  price: number;
  note?: string;
  popular?: boolean;
  features: string[];
};

type Svc = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  imageUrl: string;
  gallery: string[];
  longDescription: string;
  idealFor: string;
  sortOrder: number;
  packages: Pkg[];
};

const SERVICES: Svc[] = [
  {
    slug: 'newborn',
    title: 'Newborn Photography',
    shortTitle: 'Newborn',
    description:
      "Capturing the delicate details and fleeting moments of your baby's first days with timeless artistry.",
    category: 'newborn',
    imageUrl: '/images/portfolio/photo-2.jpeg',
    gallery: [
      '/images/portfolio/photo-2.jpeg',
      '/images/portfolio/photo-5.jpeg',
      '/images/portfolio/photo-1.jpeg',
      '/images/portfolio/photo-3.jpeg',
    ],
    longDescription:
      "The first few weeks of your baby's life are fleeting — a window of tiny fingers, soft curls, and peaceful slumber that closes all too quickly. Our newborn sessions are thoughtfully paced around your baby's needs, with gentle handling, warm studio conditions, and plenty of time for feeding and settling. We use soft, natural light and hand-picked props to create heirloom portraits that capture the wonder of those very first days — timeless images you will treasure for a lifetime.",
    idealFor: 'Babies between 5–14 days old, in the comfort of our warm Abu Dhabi studio.',
    sortOrder: 1,
    packages: [
      {
        name: 'Essential',
        price: 1200,
        features: ['2-hour studio session', '15 edited digital images', '1 outfit & prop setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1800,
        note: 'Most popular',
        popular: true,
        features: ['3-hour studio session', '30 edited digital images', '3 outfit & prop setups', 'Family inclusion', 'Fine-art retouching'],
      },
      {
        name: 'Complete',
        price: 2500,
        features: ['4-hour studio session', '45 edited digital images', 'Unlimited setups & props', 'Family & sibling shots', '10×8 fine-art print', 'Leather keepsake album'],
      },
    ],
  },
  {
    slug: 'baby-milestone',
    title: 'Baby Milestone Photography',
    shortTitle: 'Milestone',
    description:
      'Celebrating every precious milestone from first smiles to first steps.',
    category: 'baby-milestone',
    imageUrl: '/images/portfolio/photo-4.jpeg',
    gallery: ['/images/portfolio/photo-4.jpeg', '/images/portfolio/photo-7.jpeg', '/images/portfolio/photo-11.jpeg'],
    longDescription:
      "From the first gummy smile to sitting, crawling, and those wobbly first steps — each milestone is a chapter worth preserving. Our milestone sessions are relaxed and playful, letting your little one's personality shine through. We build a session around their current stage, using natural prompts and soft styling to create joyful portraits that grow with your family. Whether it's a 6-month, 9-month, or first-birthday session, we'll make it effortless and fun.",
    idealFor: 'Babies aged 4–12 months, celebrating each new stage of development.',
    sortOrder: 2,
    packages: [
      {
        name: 'Essential',
        price: 900,
        features: ['1.5-hour studio session', '12 edited digital images', '1 outfit setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1400,
        note: 'Most popular',
        popular: true,
        features: ['2.5-hour studio session', '25 edited digital images', '3 outfit setups', 'Family inclusion', 'Fine-art retouching'],
      },
      {
        name: 'Complete',
        price: 1900,
        features: ['3-hour studio session', '35 edited digital images', 'Unlimited setups & props', 'Family & sibling shots', 'Fine-art print', 'Keepsake album'],
      },
    ],
  },
  {
    slug: 'cake-smash',
    title: 'Cake Smash Photography',
    shortTitle: 'Cake Smash',
    description:
      "Joyful and playful sessions celebrating your little one's first birthday.",
    category: 'cake-smash',
    imageUrl: '/images/portfolio/photo-10.jpeg',
    gallery: ['/images/portfolio/photo-10.jpeg', '/images/portfolio/photo-8.jpeg', '/images/portfolio/photo-14.jpeg'],
    longDescription:
      'One year, one very excited little one, and one glorious, icing-covered celebration. Our cake smash sessions are all about letting go of the "perfect" and embracing the joyful mess. We design a whimsical set around your child\'s favourite colours and characters, provide a smash cake, and capture every giggle, squish, and frosting-covered moment. A bubble bath or mini clean-up set is included to finish the story with adorable after-shots.',
    idealFor: "First-birthday babies ready to make a delicious, adorable mess.",
    sortOrder: 3,
    packages: [
      {
        name: 'Essential',
        price: 1100,
        features: ['2-hour studio session', '15 edited digital images', '1 themed set & smash cake', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1600,
        note: 'Most popular',
        popular: true,
        features: ['2.5-hour studio session', '30 edited digital images', '2 themed sets', 'Smash cake + bubble bath', 'Family inclusion'],
      },
      {
        name: 'Complete',
        price: 2100,
        features: ['3-hour studio session', '45 edited digital images', 'Unlimited set changes', 'Smash + bath + cake shots', 'Fine-art print', 'Keepsake album'],
      },
    ],
  },
  {
    slug: 'pre-birthday',
    title: 'Pre-Birthday Photography',
    shortTitle: 'Pre-Birthday',
    description: 'Anticipation and excitement captured before the big celebration.',
    category: 'pre-birthday',
    imageUrl: '/images/portfolio/photo-8.jpeg',
    gallery: ['/images/portfolio/photo-8.jpeg', '/images/portfolio/photo-12.jpeg', '/images/portfolio/photo-15.jpeg'],
    longDescription:
      'The days leading up to a first birthday are filled with anticipation — the party preparations, the balloons, the excitement building in little eyes. Our pre-birthday sessions capture that beautiful in-between moment: your child at eleven-and-a-half months, standing at the edge of their first year. We use soft styling and gentle prompts to create heartfelt portraits that sit beautifully alongside your cake smash and celebration images.',
    idealFor: 'Babies aged 11–12 months, in the sweet anticipation before their first birthday.',
    sortOrder: 4,
    packages: [
      {
        name: 'Essential',
        price: 850,
        features: ['1.5-hour studio session', '12 edited digital images', '1 outfit setup', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1300,
        note: 'Most popular',
        popular: true,
        features: ['2-hour studio session', '25 edited digital images', '3 outfit setups', 'Family inclusion'],
      },
      {
        name: 'Complete',
        price: 1750,
        features: ['2.5-hour studio session', '35 edited digital images', 'Unlimited setups', 'Fine-art print', 'Keepsake album'],
      },
    ],
  },
  {
    slug: 'family',
    title: 'Family Sessions',
    shortTitle: 'Family',
    description: 'Beautiful portraits that celebrate the love shared between family members.',
    category: 'family',
    imageUrl: '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.12 PM (1).jpeg',
    gallery: [
      '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.12 PM (1).jpeg',
      '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (1).jpeg',
      '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM (1).jpeg',
    ],
    longDescription:
      'Some of the most precious photographs a family will ever own are the ones taken together. Our family sessions are relaxed and unhurried, capturing genuine connection, laughter, and the quiet in-between moments that make your family yours. We guide you naturally through poses and playful prompts so everyone — from grandparents to the littlest ones — feels at ease. The result is a collection of warm, candid portraits you\'ll want on every wall.',
    idealFor: 'Growing families, from new parents to multi-generational gatherings.',
    sortOrder: 5,
    packages: [
      {
        name: 'Essential',
        price: 1000,
        features: ['1.5-hour session', '15 edited digital images', 'Outdoor or studio', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1500,
        note: 'Most popular',
        popular: true,
        features: ['2-hour session', '30 edited digital images', '2 locations', 'Up to 5 family members', 'Fine-art retouching'],
      },
      {
        name: 'Complete',
        price: 2000,
        features: ['2.5-hour session', '45 edited digital images', 'Unlimited family members', 'Multiple locations', 'Fine-art print', 'Keepsake album'],
      },
    ],
  },
  {
    slug: 'maternity',
    title: 'Maternity Photography',
    shortTitle: 'Maternity',
    description: 'Elegantly documenting the beautiful journey of motherhood.',
    category: 'maternity',
    imageUrl: '/images/portfolio/photo-6.jpeg',
    gallery: ['/images/portfolio/photo-6.jpeg', '/images/portfolio/photo-9.jpeg', '/images/portfolio/photo-13.jpeg'],
    longDescription:
      'Pregnancy is one of the most fleeting and beautiful chapters of a woman\'s life. Our maternity sessions honour this journey with elegant, soft-light portraiture that celebrates your changing body and the life growing within. We offer a curated wardrobe of flowing gowns and draping fabrics, and every session is handled with complete discretion and care by our all-women team. The result is a timeless collection that captures the quiet anticipation of the life about to begin.',
    idealFor: 'Mothers-to-be between 28–36 weeks, at the height of their glow.',
    sortOrder: 6,
    packages: [
      {
        name: 'Essential',
        price: 1100,
        features: ['1.5-hour studio session', '15 edited digital images', 'Gown & fabric wardrobe', 'Online gallery'],
      },
      {
        name: 'Signature',
        price: 1600,
        note: 'Most popular',
        popular: true,
        features: ['2-hour studio session', '30 edited digital images', 'Partner inclusion', '3 outfit changes', 'Fine-art retouching'],
      },
      {
        name: 'Complete',
        price: 2200,
        features: ['2.5-hour studio session', '45 edited digital images', 'Unlimited outfit changes', 'Partner & sibling shots', 'Fine-art print', 'Keepsake album'],
      },
    ],
  },
];

async function seedServices() {
  for (const svc of SERVICES) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        slug: svc.slug,
        title: svc.title,
        shortTitle: svc.shortTitle,
        description: svc.description,
        category: svc.category,
        imageUrl: svc.imageUrl,
        gallery: svc.gallery,
        longDescription: svc.longDescription,
        idealFor: svc.idealFor,
        sortOrder: svc.sortOrder,
        published: true,
        packages: {
          create: svc.packages.map((pkg, i) => ({
            slug: slugify(pkg.name),
            name: pkg.name,
            price: pkg.price,
            currency: 'AED',
            note: pkg.note ?? null,
            popular: pkg.popular ?? false,
            displayOrder: i + 1,
            isActive: true,
            details: {
              create: pkg.features.map((feature, j) => ({
                title: feature,
                displayOrder: j + 1,
              })),
            },
          })),
        },
      },
    });
  }
  console.log(`✓ ${SERVICES.length} services + packages + details`);
}

/* ─── Studio info (single row) ─── */

const STUDIO = {
  name: 'Precious One Photography',
  tagline: 'Timeless Memories of Your Most Precious Moments',
  description:
    'Welcome to Precious One Photography, an Abu Dhabi-based photography studio specialising in baby and family photography.',
  speciality:
    "We have a special love for newborn photography. Those first few days are incredibly precious and pass by so quickly. We focus on capturing your baby's tiny details, beautiful expressions, and those once-in-a-lifetime moments in a timeless and artistic way. Every session is thoughtfully planned with care, patience, and attention to detail to ensure a comfortable experience for both baby and family.",
  privacy:
    "Your comfort, privacy, and security are extremely important to us. To provide a comfortable experience that respects local culture and family privacy, the entire process at Precious One Photography—including photography, editing, and printing—is handled exclusively by women. We are committed to creating a welcoming and private environment where families can feel completely comfortable throughout their photography experience.",
  phone: '+971 50 123 4567',
  whatsapp: '+971 50 123 4567',
  email: 'hello@preciousonephotography.com',
  address: 'Abu Dhabi, United Arab Emirates',
  openingHours: 'Sunday - Saturday: 9:00 AM - 6:00 PM',
  instagram: 'https://www.instagram.com/preciousonephotography',
  bookingMethod: 'whatsapp' as const,
};

async function seedStudio() {
  await prisma.studioInfo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...STUDIO },
  });
  console.log('✓ studio info');
}

async function main() {
  console.log('Seeding…');
  await seedAdmin();
  await seedBanners();
  await seedPortfolio();
  await seedTestimonials();
  await seedServices();
  await seedStudio();
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
