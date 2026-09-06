import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { services } from '@/lib/content';
import ServiceDetail from '@/components/sections/ServiceDetail';

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) return {};

  return {
    title: `${service.title} | Precious One Photography`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Precious One Photography`,
      description: service.description,
      type: 'website',
      images: [{ url: service.imageUrl }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}