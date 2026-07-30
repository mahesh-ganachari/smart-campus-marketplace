'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Category } from '@/types';
import {
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  Tag,
  DollarSign,
  FileText,
  User,
  Hash,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: Category[] = ['Books', 'Electronics', 'Lab Equipment'];

export default function SellPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Books');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle File Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be under 5MB.');
        return;
      }
      setErrorMessage(null);
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!title.trim()) {
      setErrorMessage('Please enter a listing title.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage('Please enter a valid price in ₹.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMessage('Please enter your BCA roll number (e.g., 23BCA019).');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl: string | null = null;

      // 1. Handle Image Upload to Supabase Storage if file selected
      if (uploadTab === 'file' && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Storage upload error, using fallback or default:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('listings')
            .getPublicUrl(filePath);

          finalImageUrl = publicUrlData.publicUrl;
        }
      } else if (uploadTab === 'url' && imageUrlInput.trim()) {
        finalImageUrl = imageUrlInput.trim();
      }

      // Default sample image if no image provided
      if (!finalImageUrl) {
        if (category === 'Books') {
          finalImageUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
        } else if (category === 'Electronics') {
          finalImageUrl = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
        } else {
          finalImageUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
        }
      }

      // 2. Insert or Upsert Seller Profile in Supabase
      const profileId = crypto.randomUUID();
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('roll_number', rollNumber.trim())
        .maybeSingle();

      let sellerIdToUse = existingProfile?.id;

      if (!sellerIdToUse) {
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            full_name: fullName.trim(),
            roll_number: rollNumber.trim().toUpperCase(),
          })
          .select('id')
          .single();

        if (profileError) {
          console.warn('Profile insert note:', profileError);
          sellerIdToUse = profileId;
        } else {
          sellerIdToUse = newProfile.id;
        }
      }

      // 3. Insert Listing into Supabase
      const { error: listingError } = await supabase.from('listings').insert({
        seller_id: sellerIdToUse,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category: category,
        image_url: finalImageUrl,
      });

      if (listingError) {
        throw listingError;
      }

      setSuccessMessage('Listing created successfully! Redirecting to home...');
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setErrorMessage(err.message || 'Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <div>
        {/* Navigation Bar Header */}
        <Navbar searchQuery="" onSearchChange={() => {}} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Breadcrumb / Back Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Post Item Free for BCA Students</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                Create New Campus Listing
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                Fill out the item details below to publish your textbook, gadget, or lab gear directly to the student feed.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs sm:text-sm font-bold">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Item Details */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-2">
                  1. Item Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Listing Title <span className="text-indigo-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Database System Concepts (Korth 7th Ed)"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>

                {/* Category & Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Category <span className="text-indigo-600">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            category === cat
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Price (₹ INR) <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 450"
                        className="w-full pl-8 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Item Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about condition, included accessories, edition, or lab modules..."
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 2: Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                    2. Product Image
                  </h3>

                  {/* Upload Source Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUploadTab('file')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        uploadTab === 'file'
                          ? 'bg-white text-indigo-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        uploadTab === 'url'
                          ? 'bg-white text-indigo-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {uploadTab === 'file' ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                    {imagePreviewUrl ? (
                      <div className="space-y-4">
                        <div className="relative h-48 w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200">
                          {/* Preview image */}
                          <img
                            src={imagePreviewUrl}
                            alt="Selected preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreviewUrl(null);
                          }}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Remove & Select another image
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 py-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-indigo-600 hover:underline">
                            Click to upload image file
                          </span>
                          <span className="text-xs text-slate-500"> or drag and drop</span>
                          <p className="text-[11px] text-slate-400 mt-1">
                            PNG, JPG, WEBP up to 5MB (Uploads to Supabase Storage)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Direct Image Web Link
                    </label>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Section 3: Seller Profile */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-2">
                  3. Seller Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      BCA Roll Number <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 23BCA019"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold uppercase tracking-wide"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Post Listing Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
