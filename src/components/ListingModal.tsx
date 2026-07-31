'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Listing } from '@/types';
import { X, UserCheck, ShieldCheck, Tag, MessageSquare, MessageCircle, Phone, Calendar } from 'lucide-react';

interface ListingModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const ListingModal: React.FC<ListingModalProps> = ({ listing, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!listing) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white flex items-center justify-center transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 w-full bg-slate-900 shrink-0">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white/50">
              <Tag className="w-16 h-16" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Floating Category & Price overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
              {listing.category}
            </span>
            <div className="text-right">
              <span className="text-xs text-slate-300 font-medium block">Asking Price</span>
              <span className="text-3xl font-extrabold text-white">
                ₹{listing.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">
              {listing.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Posted on {formatDate(listing.created_at)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Item Description
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {listing.description}
            </p>
          </div>

          {/* Seller Profile Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-md shadow-indigo-600/20">
                {listing.seller?.full_name ? listing.seller.full_name[0] : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {listing.seller?.full_name || 'Campus Student'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  Roll No: {listing.seller?.roll_number || '22BCA000'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified BCA Student</span>
            </div>
          </div>

          {/* Contact Action */}
          <div className="pt-2 space-y-3">
            {listing.seller?.mobile_number ? (
              <a
                href={`https://wa.me/91${listing.seller.mobile_number}?text=${encodeURIComponent(
                  `Hi ${listing.seller.full_name || 'there'}! I'm interested in your listing on Smart Campus Marketplace: "${listing.title}" (₹${listing.price.toLocaleString('en-IN')}). Is it still available?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>
            ) : (
              <button
                onClick={() =>
                  alert(
                    `To buy this item, reach out to ${listing.seller?.full_name} (${listing.seller?.roll_number}) on campus.`
                  )
                }
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Seller on Campus</span>
              </button>
            )}

            {listing.seller?.mobile_number && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  +91 {listing.seller.mobile_number.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
