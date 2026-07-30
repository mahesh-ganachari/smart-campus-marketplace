import React from 'react';
import Image from 'next/image';
import { Listing } from '@/types';
import { Tag, User, Calendar, ExternalLink } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Books':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Electronics':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Lab Equipment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-400">
            <Tag className="w-10 h-10" />
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getCategoryColor(
              listing.category
            )}`}
          >
            {listing.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white font-extrabold text-sm shadow-md backdrop-blur-md">
            ₹{listing.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {listing.title}
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
              {listing.seller?.roll_number ? listing.seller.roll_number.slice(0, 2) : 'BC'}
            </div>
            <span className="font-medium text-slate-700">
              {listing.seller?.roll_number || 'Campus Seller'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(listing.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
