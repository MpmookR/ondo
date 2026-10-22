import { notFound } from 'next/navigation';
import { catalogue, itemById } from '@/data/catalogue';
import { ItemPage } from '@/views/ItemPage';

export function generateStaticParams() {
  return catalogue.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Ondo · ${itemById(id)?.name ?? 'Item'}` };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!itemById(id)) notFound();
  return <ItemPage itemId={id} />;
}
