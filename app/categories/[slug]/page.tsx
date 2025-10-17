import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SingleCategoryClient from '@/components/pages/SingleCategoryClient';

export const revalidate = 1800; // ISR: Revalidate every 30 minutes

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Stores & Deals | Coupons & Deals`,
    description: `Browse all stores in ${category.name} category and find the best deals.`,
  };
}

async function getCategoryData(slug: string, page: number = 1) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  const perPage = 12;

  const [stores, totalStores] = await Promise.all([
    prisma.store.findMany({
      where: { categoryId: category.id },
      include: {
        category: true,
        _count: {
          select: {
            deals: {
              where: { isExpired: false },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.store.count({
      where: { categoryId: category.id },
    }),
  ]);

  return {
    category,
    stores,
    totalStores,
    currentPage: page,
    totalPages: Math.ceil(totalStores / perPage),
    perPage,
  };
}

export default async function SingleCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  
  const page = Number(search.page) || 1;
  const searchQuery = search.search || '';
  const sort = search.sort || 'name';

  const data = await getCategoryData(slug, page);

  if (!data) {
    notFound();
  }

  return (
    <SingleCategoryClient
      data={data}
      searchParams={search}
    />
  );
}