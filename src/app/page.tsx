'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ListingCard } from '@/components/ListingCard';
import { ListingModal } from '@/components/ListingModal';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Category, Listing } from '@/types';
import { SearchX, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeModalListing, setActiveModalListing] = useState<Listing | null>(null);

  // Fetch real listings from Supabase
  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('listings')
        .select(`
          id,
          seller_id,
          title,
          description,
          price,
          category,
          image_url,
          created_at,
          seller:profiles (
            id,
            full_name,
            roll_number,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const formattedListings: Listing[] = data.map((item: any) => {
          const sellerObj = Array.isArray(item.seller) ? item.seller[0] : item.seller;
          return {
            id: item.id,
            seller_id: item.seller_id,
            title: item.title,
            description: item.description || '',
            price: Number(item.price),
            category: item.category as Category,
            image_url: item.image_url,
            created_at: item.created_at,
            seller: sellerObj
              ? {
                  id: sellerObj.id,
                  full_name: sellerObj.full_name || 'Campus Student',
                  roll_number: sellerObj.roll_number || 'BCA',
                  created_at: sellerObj.created_at || item.created_at,
                }
              : undefined,
          };
        });
        setListings(formattedListings);
      }
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err.message || 'Failed to load listings from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on search query and category
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesCategory =
        selectedCategory === 'All' || listing.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.description.toLowerCase().includes(q) ||
        listing.category.toLowerCase().includes(q) ||
        (listing.seller?.full_name && listing.seller.full_name.toLowerCase().includes(q)) ||
        (listing.seller?.roll_number && listing.seller.roll_number.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [listings, searchQuery, selectedCategory]);

  // Compute total counts per category from database listings
  const categoryCounts = useMemo(() => {
    const counts: Record<Category | 'All', number> = {
      All: listings.length,
      Books: 0,
      Electronics: 0,
      'Lab Equipment': 0,
    };

    listings.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [listings]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {/* Campus Hero Banner */}
          <Hero />

          {/* Controls Bar: Category Pills & Result Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 self-end sm:self-auto">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Showing <strong className="text-slate-900">{filteredListings.length}</strong> of{' '}
                  {listings.length} live listings
                </span>
              </div>
              <button
                onClick={fetchListings}
                title="Refresh from Supabase"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={fetchListings}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4 animate-pulse shadow-sm"
                >
                  <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            /* Listings Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(item) => setActiveModalListing(item)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white/80 rounded-3xl border border-slate-200/80 max-w-md mx-auto my-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No listings found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? `We couldn't find anything matching "${searchQuery}" in ${
                      selectedCategory === 'All' ? 'any category' : selectedCategory
                    }.`
                  : `No listings available in ${selectedCategory}.`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors inline-block"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Listing Detail Modal */}
      <ListingModal
        listing={activeModalListing}
        onClose={() => setActiveModalListing(null)}
      />

      {/* Campus Footer */}
      <Footer />
    </div>
  );
}
