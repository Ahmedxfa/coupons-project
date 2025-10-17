import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SingleStoreClient from '@/components/pages/SingleStoreClient';

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const stores = await prisma.store.findMany({
      select: { slug: true },
    });
    return stores.map((store) => ({
      slug: store.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
    });

    if (!store) return { title: 'Store Not Found' };

    return {
      title: `${store.name} Coupons & Deals | Save Money Today`,
      description: store.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Store Not Found' };
  }
}

interface Params {
  slug: string;
}

export default async function SingleStorePage({
  params,
}: {
  params: Params;
}) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        deals: {
          orderBy: [
            { isExpired: 'asc' as const },
            { featured: 'desc' as const },
            { createdAt: 'desc' as const },
          ],
        },
      },
    });

    if (!store) {
      notFound();
    }

    // Convert Decimal to string for serialization
    const serializedStore = {
      ...store,
      deals: store.deals.map((deal) => ({
        ...deal,
        discountAmount: deal.discountAmount ? deal.discountAmount.toString() : null,
        expirationDate: deal.expirationDate ? deal.expirationDate.toISOString() : null,
      })),
    };

    return <SingleStoreClient store={serializedStore} />;
  } catch (error) {
    console.error('Error loading store:', error);
    notFound();
  }
}