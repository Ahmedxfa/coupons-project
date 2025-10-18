import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ExternalLink, Store } from 'lucide-react';

export const revalidate = 2000;

export const metadata = {
  title: 'All Stores | Coupons & Deals',
  description: 'Browse all stores and find the best deals and coupons.',
};
export tsetr etst setset setet set
interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function StoresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || '';
  const categoryFilter = params?.category || '';
  const sort = params?.sort || 'name';
  const perPage = 20;

  const where = {
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
    ...(categoryFilter && {
      category: {
        slug: categoryFilter,
      },
    }),
  };

  const [stores, totalStores, categories] = await Promise.all([
    prisma.store.findMany({
      where,
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
      orderBy: sort === 'deals' ? { deals: { _count: 'desc' } } : { name: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.store.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const totalPages = Math.ceil(totalStores / perPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Stores</h1>
          <p className="text-gray-600">
            Browse {totalStores} stores and find the best deals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Stores
              </label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by name..."
                defaultValue={search}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={categoryFilter}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Alphabetically (A-Z)</option>
                <option value="deals">Most Deals</option>
              </select>
            </div>

            <button
              type="submit"
              className="col-span-full md:col-span-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No stores found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stores.map((store) => (
                <Link
                  key={store.id}
                  href={`/stores/${store.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group relative"
                >
                  {/* Favorite Button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors z-10"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>

                  {/* Store Logo */}
                  <div className="relative w-full h-24 mb-4 flex items-center justify-center">
                    <Image
                      src={store.logoUrl}
                      alt={store.name}
                      width={120}
                      height={60}
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Store Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {store.name}
                  </h3>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {store.category.icon} {store.category.name}
                    </span>
                  </div>

                  {/* Deal Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {store._count.deals} active{' '}
                      {store._count.deals === 1 ? 'deal' : 'deals'}
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {page > 1 && (
                  <Link
                    href={`/stores?page=${page - 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                  <Link
                    href={`/stores?page=${page + 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}