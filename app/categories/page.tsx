import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 1800;

export const metadata = {
  title: 'Categories | Coupons & Deals',
  description: 'Browse all deal categories and find the best offers.',
};

export default async function CategoriesPage() {
  const [featuredCategories, allCategories] = await Promise.all([
    prisma.category.findMany({ 
      where: { featured: true },
      include: {
        _count: {
          select: { stores: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { stores: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Browse {allCategories.length} deal categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-white group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{category.icon}</span>
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-blue-100">
                    {category._count.stores}{' '}
                    {category._count.stores === 1 ? 'store' : 'stores'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category._count.stores}{' '}
                  {category._count.stores === 1 ? 'store' : 'stores'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}