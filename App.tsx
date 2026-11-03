/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ProductItem, CreatedPost } from './types.ts';
import { INITIAL_PRODUCTS, STANDARD_SIZES, formatPKR } from './initialData.ts';
import { BrandLogo } from './components/BrandLogo.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { CreatePostModal } from './components/CreatePostModal.tsx';
import { PostCard } from './components/PostCard.tsx';
import { PriceManagerBar } from './components/PriceManagerBar.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { CustomerReviewsSection } from './components/CustomerReviewsSection.tsx';
import {
  Plus,
  SlidersHorizontal,
  Sparkles,
  Grid3X3,
  Image as ImageIcon,
  MessageCircle,
  Instagram,
  Mail,
  Truck,
  Globe,
  Scissors,
  Crown,
} from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'fashion_venue_products_v4';
const STORAGE_KEY_POSTS = 'fashion_venue_posts_v4';

const OFFICIAL_BANNER = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_12.04.48_AM__1__be515f86.jpeg';
const OFFICIAL_LOGO = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_12.04.48_AM_8f0a84b8.jpeg';

export default function App() {
  // 12 Products state
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 12) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Created posts state
  const [posts, setPosts] = useState<CreatedPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'post-fv-1',
        title: 'Blush Velvet Embroidered Sharara',
        price: 35000,
        sizes: ['S', 'M', 'L'],
        image: '/assets/aistudio/WhatsApp_Image_2026-11-01_at_5.39.42_PM_af662b2f.jpeg',
        createdAt: '2026-11-02',
        aiRating: '4.9/5',
        productId: 1,
      },
      {
        id: 'post-fv-2',
        title: 'Sky Blue & Coral Festive Gharara',
        price: 28700,
        sizes: ['M', 'L', 'Free Size'],
        image: '/assets/aistudio/WhatsApp_Image_2026-11-01_at_5.39.43_PM_35fa40c0.jpeg',
        createdAt: '2026-11-02',
        aiRating: '4.8/5',
        productId: 2,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'posts'>('catalog');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isPriceManagerOpen, setIsPriceManagerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<ProductItem | null>(null);
  const [preselectedProductForPost, setPreselectedProductForPost] = useState<ProductItem | null>(null);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [products]);

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [posts]);

  // Update price of product 1..12
  const handleUpdatePrice = (id: number, newPrice: number) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
    if (selectedProductForQuickView && selectedProductForQuickView.id === id) {
      setSelectedProductForQuickView((prev) => (prev ? { ...prev, price: newPrice } : null));
    }
  };

  // Update selected size for a product
  const handleSelectSize = (id: number, size: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedSize: size } : item))
    );
  };

  // Reset to default prices
  const handleResetPrices = () => {
    if (confirm('Reset all 12 Fashion Venue product prices to original PKR values?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    }
  };

  // Create Post
  const handleCreatePost = (newPostData: Omit<CreatedPost, 'id' | 'createdAt'>) => {
    const newPost: CreatedPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      aiRating: newPostData.aiRating || '4.9/5',
    };
    setPosts([newPost, ...posts]);
    setActiveTab('posts');
  };

  // Delete Post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Open Quick View
  const handleViewProduct = (product: ProductItem) => {
    setSelectedProductForQuickView(product);
  };

  // Open Create Post modal from a product
  const handleOpenCreateForProduct = (product: ProductItem) => {
    setPreselectedProductForPost(product);
    setIsCreateModalOpen(true);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return products;
    if (categoryFilter === 'Velvet') {
      return products.filter((p) => p.category.toLowerCase().includes('velvet'));
    }
    if (categoryFilter === 'Festive') {
      return products.filter((p) => p.category.toLowerCase().includes('festive') || p.category.toLowerCase().includes('bridal'));
    }
    if (categoryFilter === 'Kaftan') {
      return products.filter((p) => p.category.toLowerCase().includes('kaftan') || p.category.toLowerCase().includes('maxi'));
    }
    return products;
  }, [products, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Luxury Announcement Strip with Contact & Instagram */}
      <div className="bg-[#181413] text-[#f2ece2] text-[11px] font-medium tracking-wider py-2 px-4 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase font-semibold tracking-[0.16em]">
              FASHION VENUE • YOUR STYLE • OUR PASSION • ALL PRICES IN PKR
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://wa.me/923271885283"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>+92 327 1885283</span>
            </a>
            <span className="text-stone-600">|</span>
            <a
              href="https://www.instagram.com/fashionvenue43/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span>@fashionvenue43</span>
            </a>
          </div>
        </div>
      </div>

      {/* Boutique Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Fashion Venue Brand Logo & Mark */}
          <BrandLogo size="md" theme="dark" showTagline={true} />

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/923271885283"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
              title="Chat on WhatsApp +92 327 1885283"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Us</span>
            </a>

            {/* Quick Price Manager Trigger */}
            <button
              type="button"
              onClick={() => setIsPriceManagerOpen(!isPriceManagerOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isPriceManagerOpen
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-200/40'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="Edit all 12 Fashion Venue prices"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">12 Prices</span>
              <span className="text-[10px] font-bold text-rose-800 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                PKR
              </span>
            </button>

            {/* Clear + Create Post Button */}
            <button
              type="button"
              onClick={() => {
                setPreselectedProductForPost(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#181413] hover:bg-black active:scale-[0.98] text-amber-200 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition cursor-pointer border border-amber-900/40"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Create Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Official Fashion Venue Brand Banner */}
        <section className="relative rounded-3xl overflow-hidden shadow-lg border border-amber-900/20 mb-8 bg-[#fdfaf5]">
          <div className="relative aspect-[21/9] sm:aspect-[24/8] md:aspect-[3/1] max-h-[360px] w-full overflow-hidden">
            <img
              src={OFFICIAL_BANNER}
              alt="Fashion Venue - Your Style • Our Passion"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Features Bar beneath banner */}
          <div className="bg-[#1b1716] text-[#e8dfd2] px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-amber-500/20">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Custom Dresses</p>
                <p className="text-[10px] text-stone-400">Tailored to perfection</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Boutique Collection</p>
                <p className="text-[10px] text-stone-400">12 Signature Silhouettes</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Worldwide Shipping</p>
                <p className="text-[10px] text-stone-400">TCS & International Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">+92 327 1885283</p>
                <p className="text-[10px] text-stone-400">Instant WhatsApp Orders</p>
              </div>
            </div>
          </div>
        </section>

        {/* 12 Editable Product Prices Accordion / Bar */}
        <PriceManagerBar
          products={products}
          onUpdatePrice={handleUpdatePrice}
          onResetPrices={handleResetPrices}
          isOpen={isPriceManagerOpen}
          onToggle={() => setIsPriceManagerOpen(!isPriceManagerOpen)}
        />

        {/* Navigation & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/90 mb-6">
          {/* Tab Selector: Catalog vs Created Posts */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Fashion Venue Catalog ({products.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Created Posts ({posts.length})</span>
            </button>
          </div>

          {/* Category Filter Pills (when viewing catalog) */}
          {activeTab === 'catalog' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              {['All', 'Velvet', 'Festive', 'Kaftan'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-stone-900 text-amber-200 shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {cat === 'All' ? 'All Dresses (12)' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content: 12 Product Cards Grid */}
        {activeTab === 'catalog' ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Fashion Venue Signature Collection
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select your size directly on any dress or click <span className="font-bold text-stone-700">Select / View</span>. Order anytime via WhatsApp (+92 327 1885283).
                </p>
              </div>
              <span className="text-xs font-bold text-amber-950 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
                Fashion Venue • All PKR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdatePrice={handleUpdatePrice}
                  onSelectSize={handleSelectSize}
                  onViewProduct={handleViewProduct}
                  onCreatePostForProduct={handleOpenCreateForProduct}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Created Posts Feed */
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Fashion Venue Feed Posts
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Posts created using the simple Create Post flow with picture, size, PKR price, and optional title.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreselectedProductForPost(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-amber-200 rounded-lg text-xs font-bold hover:bg-black transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ New Post</span>
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  No Posts Created Yet
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Click the "+ Create Post" button above to upload a picture, set price in PKR, select sizes, and publish to Fashion Venue.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-5 px-5 py-2.5 bg-stone-900 text-amber-200 rounded-xl text-xs font-bold hover:bg-black transition cursor-pointer shadow-sm"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1. About Fashion Aura Section */}
        <AboutSection />

        {/* 2. Customer Reviews Section */}
        <CustomerReviewsSection />
      </main>

      {/* Fashion Venue Luxury Footer */}
      <footer className="mt-16 bg-[#181413] text-[#f2ece2] border-t border-amber-900/40 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <BrandLogo size="md" theme="light" showTagline={true} />

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
            <a
              href="https://wa.me/923271885283"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>+92 327 1885283</span>
            </a>

            <a
              href="https://www.instagram.com/fashionvenue43/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <Instagram className="w-4 h-4 text-rose-400" />
              <span>@fashionvenue43</span>
            </a>

            <a
              href="mailto:Fashionvenue5@gmail.com"
              className="flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Fashionvenue5@gmail.com</span>
            </a>
          </div>

          <div className="text-center md:text-right text-xs text-stone-400">
            <p className="font-medium text-stone-300">
              Fashion Venue • Custom Dresses & Boutique Collection
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Worldwide Shipping • TCS & International • All Prices in <span className="text-amber-300 font-semibold">PKR</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProductForQuickView}
        onClose={() => setSelectedProductForQuickView(null)}
        onUpdatePrice={handleUpdatePrice}
        onCreatePost={handleOpenCreateForProduct}
        onSelectSize={handleSelectSize}
      />

      {/* Simple Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        products={products}
        onCreatePost={handleCreatePost}
        initialProduct={preselectedProductForPost}
      />
    </div>
  );
}
