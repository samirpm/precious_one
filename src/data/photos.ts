import type { ImageMetadata } from 'astro';
import p01 from '../assets/photos/photo-01.jpeg';
import p02 from '../assets/photos/photo-02.jpeg';
import p03 from '../assets/photos/photo-03.jpeg';
import p04 from '../assets/photos/photo-04.jpeg';
import p05 from '../assets/photos/photo-05.jpeg';
import p06 from '../assets/photos/photo-06.jpeg';
import p07 from '../assets/photos/photo-07.jpeg';
import p08 from '../assets/photos/photo-08.jpeg';
import p09 from '../assets/photos/photo-09.jpeg';
import p10 from '../assets/photos/photo-10.jpeg';
import p11 from '../assets/photos/photo-11.jpeg';
import p12 from '../assets/photos/photo-12.jpeg';
import p13 from '../assets/photos/photo-13.jpeg';
import p14 from '../assets/photos/photo-14.jpeg';
import p15 from '../assets/photos/photo-15.jpeg';

export type PhotoCategory = 'newborn' | 'family' | 'details';

export interface Photo {
  id: string;
  src: ImageMetadata;
  /** Short caption shown in the lightbox and under strip cards. */
  caption: string;
  alt: string;
  category: PhotoCategory;
  /** Where to anchor the crop when the photo is shown in a tall frame. */
  position?: string;
}

/**
 * The studio's photographs. There are 15 unique images; the previous site
 * shipped each of them twice under different names.
 */
export const photos: Photo[] = [
  {
    id: 'father',
    src: p01,
    caption: 'A father and his newborn, nose to nose',
    alt: 'A bearded father holds his sleeping newborn up to his face, silhouetted against soft white light',
    category: 'family',
    position: '50% 35%',
  },
  {
    id: 'fingers',
    src: p02,
    caption: 'Tiny fingers, wrapped in cream',
    alt: 'Close-up of a newborn’s hands resting on a cream knitted wrap',
    category: 'details',
  },
  {
    id: 'toes',
    src: p03,
    caption: 'Ten tiny toes',
    alt: 'A newborn’s feet peeking out from a soft cream blanket',
    category: 'details',
  },
  {
    id: 'basket',
    src: p04,
    caption: 'Asleep in a woven basket, surrounded by flowers',
    alt: 'A newborn wearing a cream bow sleeps in a woven basket against a pastel floral backdrop',
    category: 'newborn',
  },
  {
    id: 'sibling-kiss',
    src: p05,
    caption: 'A big sibling’s first kiss',
    alt: 'An older child in a white shirt gently kisses a newborn’s forehead, lit from behind',
    category: 'family',
    position: '50% 30%',
  },
  {
    id: 'twins',
    src: p06,
    caption: 'Big brother and his twin newborns',
    alt: 'A smiling boy in a white shirt lies between two swaddled newborn twins on a white blanket',
    category: 'family',
  },
  {
    id: 'pearls',
    src: p07,
    caption: 'A sleepy smile in a pearl headband',
    alt: 'A swaddled newborn smiles in her sleep, wearing a pearl and flower headband',
    category: 'newborn',
  },
  {
    id: 'fox',
    src: p08,
    caption: 'Bear bonnet and a knitted fox',
    alt: 'A newborn in a brown knitted bear bonnet cuddles a small knitted fox on a grey blanket',
    category: 'newborn',
  },
  {
    id: 'family-dog',
    src: p09,
    caption: 'The whole family, dog included',
    alt: 'Parents hold their newborn beside their small dog in front of a floral wall with the baby’s name',
    category: 'family',
  },
  {
    id: 'pink-lace',
    src: p10,
    caption: 'Lace and a bow, on soft pink',
    alt: 'A newborn girl sleeps on a pink blanket wearing a lace bow and lace trousers',
    category: 'newborn',
  },
  {
    id: 'parents',
    src: p11,
    caption: 'Mum, Dad and their newest arrival',
    alt: 'A mother and father in white cradle their newborn in front of a blush floral backdrop',
    category: 'family',
  },
  {
    id: 'tutu',
    src: p12,
    caption: 'A tutu the colour of plums',
    alt: 'A newborn sleeps on a plum backdrop wearing a ruffled tutu and a floral crown',
    category: 'newborn',
  },
  {
    id: 'swing',
    src: p13,
    caption: 'Denim overalls on a little wooden swing',
    alt: 'A baby in denim overalls sits on a small wooden swing next to a teddy bear',
    category: 'newborn',
  },
  {
    id: 'knitted-friends',
    src: p14,
    caption: 'Surrounded by knitted friends',
    alt: 'A newborn in a bear bonnet sleeps on a fur blanket among small knitted bears and bunnies',
    category: 'newborn',
  },
  {
    id: 'powder-blue',
    src: p15,
    caption: 'Fluffy ears, on powder blue',
    alt: 'A newborn in a fluffy bear bonnet sleeps curled up on a powder blue blanket',
    category: 'newborn',
  },
];

export const photoById = (id: string): Photo => {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Unknown photo id: ${id}`);
  return photo;
};

/** Hero slides: photos that still read well when cropped tall on a phone. */
export const heroPhotoIds = ['sibling-kiss', 'pearls', 'knitted-friends', 'basket'];

/** The curated strip on the home page. The lightbox shows all photographs. */
export const stripPhotoIds = [
  'father',
  'basket',
  'twins',
  'fox',
  'family-dog',
  'tutu',
  'swing',
  'powder-blue',
  'toes',
];
