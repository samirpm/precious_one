import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer | string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LEN = 64;

/**
 * Hash a password with scrypt (Node built-in — no extra dependency).
 * Format: scrypt$<saltHex>$<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

/** Verify a password against a stored `scrypt$salt$hash` string. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}
