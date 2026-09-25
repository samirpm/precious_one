/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly AUTH_SECRET: string;
  readonly ADMIN_SEED_EMAIL: string;
  readonly ADMIN_SEED_PASSWORD: string;
}

declare namespace App {
  interface Locals {
    admin: { id: string; email: string } | null;
  }
}
