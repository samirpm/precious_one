import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Handles uploading an image file to the local public directory.
 * @param file The File object from request.formData()
 * @param category The category folder to store the image in (e.g., 'portfolio', 'banners')
 * @returns The relative public URL of the uploaded file.
 * @throws Error if validation fails.
 */
export async function uploadFile(file: File, category: string): Promise<string> {
  if (!file || !(file instanceof File)) {
    throw new Error('No valid file provided');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 5MB limit');
  }

  // Generate a unique filename
  const extension = path.extname(file.name) || '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;

  // Define paths
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
  const filePath = path.join(uploadDir, filename);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Convert File to Buffer and write to disk
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  // Return the public URL
  return `/uploads/${category}/${filename}`;
}
