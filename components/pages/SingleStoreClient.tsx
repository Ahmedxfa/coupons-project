'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Heart, Tag, Clock, TrendingUp } from 'lucide-react';
import { formatDiscount, getDaysUntilExpiration } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';

interface Deal {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: string;
  discountPercentage: number | null;
  discountAmount: string | number | null;
  expirationDate: string | null;
  isExpired: boolean;
  featured: boolean;
  usageCount: number;
  storeId: string;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  featured: boolean;
  deals: Deal[];
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
}

export default function SingleStoreClient({ store }: { store: StoreData }) {
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const activeDeals = store.deals.filter((deal) => !deal.isExpired);
  const expiredDeals = store.deals.filter((deal) => deal.isExpired);

  const toggleCodeReveal = (dealId: string) => {
    setExpandedCodes((prev) => ({
      ...prev,
      [dealId]: !prev[dealId],
    }));
  };

  const copyCode = async (code: string, dealId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');

      // Increment usage count
      await fetch(`/api/deals/${dealId}/increment`, {
        method: 'POST',
      });
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const toggleFavorite = (dealId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [dealId]: !prev[dealId],
    }));
    toast.success(
      favorites[dealId] ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Store Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start gap-6 flex-col sm:flex-row">
              {/* Store Logo */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
                  <Image
                    src={store.logoUrl}
                    alt={store.name}
                    width={120}
                    height={120}
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Store Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4 flex-col sm:flex-row">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {store.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {store.category.icon} {store.category.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {activeDeals.length} active{' '}
                        {activeDeals.length === 1 ? 'deal' : 'deals'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 max-w-2xl">
                  {store.description}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Visit Store
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Heart className="h-4 w-4" />
                    Save Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Deals */}
          {activeDeals.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active Deals ({activeDeals.length})
              </h2>
              <div className="space-y-4">
                {activeDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    store={store}
                    onToggleCode={() => toggleCodeReveal(deal.id)}
                    onCopyCode={() => copyCode(deal.code!, deal.id)}
                    onToggleFavorite={() => toggleFavorite(deal.id)}
                    isExpanded={expandedCodes[deal.id]}
                    isFavorited={favorites[deal.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Expired Deals */}
          {expiredDeals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-500 mb-6">
                Expired Deals ({expiredDeals.length})
              </h2>
              <div className="space-y-4 opacity-60">
                {expiredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    store={store}
                    isExpired
                    onToggleCode={() => {}}
                    onCopyCode={() => {}}
                    onToggleFavorite={() => {}}
                    isExpanded={false}
                    isFavorited={false}
                  />
                ))}
              </div>
            </div>
          )}

          {activeDeals.length === 0 && expiredDeals.length === 0 && (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No deals available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new deals from {store.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Deal Card Component
function DealCard({
  deal,
  store,
  isExpired = false,
  onToggleCode,
  onCopyCode,
  onToggleFavorite,
  isExpanded,
  isFavorited,
}: {
  deal: Deal;
  store: StoreData;
  isExpired?: boolean;
  onToggleCode: () => void;
  onCopyCode: () => void;
  onToggleFavorite: () => void;
  isExpanded: boolean;
  isFavorited: boolean;
}) {
  const daysLeft = deal.expirationDate
    ? getDaysUntilExpiration(new Date(deal.expirationDate))
    : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${
        isExpired ? 'opacity-60' : 'hover:shadow-md transition-shadow'
      }`}
    >
      <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
        {/* Deal Info */}
        <div className="flex-1">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                isExpired
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {formatDiscount(
                deal.type,
                deal.discountPercentage ?? undefined,
                deal.discountAmount ?? undefined
              )}
            </span>
            {deal.featured && !isExpired && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <TrendingUp className="h-3 w-3" />
                Featured
              </span>
            )}
            {isExpiringSoon && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <Clock className="h-3 w-3" />
                Expiring Soon
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3
            className={`text-xl font-semibold mb-2 ${
              isExpired ? 'text-gray-600 line-through' : 'text-gray-900'
            }`}
          >
            {deal.title}
          </h3>
          <p className="text-gray-600 mb-4">{deal.description}</p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            {deal.expirationDate && (
              <span>
                {isExpired ? 'Expired' : 'Expires'}{' '}
                {new Date(deal.expirationDate).toLocaleDateString()}
              </span>
            )}
            {deal.usageCount > 0 && (
              <span>Used {deal.usageCount} times today</span>
            )}
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {deal.code ? (
            <>
              {isExpanded ? (
                <div className="text-center">
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-6 py-3 mb-2">
                    <code className="text-lg font-mono font-bold text-blue-900">
                      {deal.code}
                    </code>
                  </div>
                  <button
                    onClick={onCopyCode}
                    disabled={isExpired}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isExpired
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Copy Code
                  </button>
                </div>
              ) : (
                <button
                  onClick={onToggleCode}
                  disabled={isExpired}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    isExpired
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Reveal Code
                </button>
              )}
            </>
          ) : (
            <a
              href={store.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isExpired
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get Deal
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onToggleFavorite}
            disabled={isExpired}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFavorited
                ? 'bg-red-100 text-red-600 border border-red-300'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
            />
            {isFavorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}