'use client';

import { useState, useEffect } from 'react';
import { Store, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

interface InitialData {
  stores: StoreCard[];
  totalStores: number;
  categories: Category[];
  currentPage: number;
  totalPages: number;
  perPage: number;
}

export default function StoresClient({
  initialData,
  searchParams,
}: {
  initialData: InitialData;
  searchParams: { page?: string; search?: string; category?: string; sort?: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.search || '');
  const [category, setCategory] = useState(searchParams.category || '');
  const [sort, setSort] = useState(searchParams.sort || 'name');
  const [data, setData] = useState<InitialData>(initialData);
  const [loading, setLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = async (
    newSearch?: string,
    newCategory?: string,
    newSort?: string
  ) => {
    const updatedSearch = newSearch ?? search;
    const updatedCategory = newCategory ?? category;
    const updatedSort = newSort ?? sort;

    setSearch(updatedSearch);
    setCategory(updatedCategory);
    setSort(updatedSort);
    setLoading(true);

    // Build query string
    const params = new URLSearchParams();
    if (updatedSearch) params.append('search', updatedSearch);
    if (updatedCategory) params.append('category', updatedCategory);
    if (updatedSort && updatedSort !== 'name') params.append('sort', updatedSort);

    // Push new URL
    router.push(`/stores?${params.toString()}`);
  };

  // Revalidate data every 30 minutes on client side
  useEffect(() => {
    const interval = setInterval(() => {
      setData(initialData);
    }, 1800000); // 30 minutes

    return () => clearInterval(interval);
  }, [initialData]);

  const totalPages = data.totalPages;
  const currentPage = data.currentPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Stores</h1>
          <p className="text-gray-600">
            Browse {data.totalStores} stores and find the best deals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  // Debounce search
                  const timer = setTimeout(() => {
                    handleFilterChange(e.target.value, category, sort);
                  }, 500);
                  return () => clearTimeout(timer);
                }}
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
                value={category}
                onChange={(e) => handleFilterChange(search, e.target.value, sort)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {data.categories.map((cat) => (
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
                value={sort}
                onChange={(e) => handleFilterChange(search, category, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Alphabetically (A-Z)</option>
                <option value="deals">Most Deals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data.stores.length === 0 ? (
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
                <Link
                  href={`/stores?page=${currentPage - 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}`}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </Link>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Link
                  href={`/stores?page=${currentPage + 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}`}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
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