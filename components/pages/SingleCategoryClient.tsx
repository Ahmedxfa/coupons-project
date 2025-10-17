'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ExternalLink, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface StoreCard {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  featured: boolean;
  category: Category;
  _count: {
    deals: number;
  };
}

interface CategoryData {
  category: Category;
  stores: StoreCard[];
  totalStores: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}

export default function SingleCategoryClient({
  data,
  searchParams,
}: {
  data: CategoryData;
  searchParams: { page?: string; search?: string; sort?: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.search || '');
  const [sort, setSort] = useState(searchParams.sort || 'name');

  const handleFilterChange = (newSearch?: string, newSort?: string) => {
    const updatedSearch = newSearch ?? search;
    const updatedSort = newSort ?? sort;

    setSearch(updatedSearch);
    setSort(updatedSort);

    const params = new URLSearchParams();
    if (updatedSearch) params.append('search', updatedSearch);
    if (updatedSort && updatedSort !== 'name') params.append('sort', updatedSort);

    router.push(`/categories/${data.category.slug}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{data.category.icon}</span>
            <h1 className="text-4xl font-bold">{data.category.name}</h1>
          </div>
          <p className="text-blue-100">
            Browse {data.totalStores}{' '}
            {data.totalStores === 1 ? 'store' : 'stores'} in this category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  const timer = setTimeout(() => {
                    handleFilterChange(e.target.value, sort);
                  }, 500);
                  return () => clearTimeout(timer);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                value={sort}
                onChange={(e) => handleFilterChange(search, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Alphabetically (A-Z)</option>
                <option value="deals">Most Deals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {data.stores.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.stores.map((store) => (
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
                      priority={false}
                    />
                  </div>

                  {/* Store Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {store.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {store.description}
                  </p>

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
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Link
                  href={`/categories/${data.category.slug}?page=${data.currentPage - 1}${search ? `&search=${search}` : ''}`}
                  className={`px-4 py-2 rounded-lg border ${
                    data.currentPage === 1
                      ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </Link>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {data.currentPage} of {data.totalPages}
                </span>

                <Link
                  href={`/categories/${data.category.slug}?page=${data.currentPage + 1}${search ? `&search=${search}` : ''}`}
                  className={`px-4 py-2 rounded-lg border ${
                    data.currentPage === data.totalPages
                      ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}