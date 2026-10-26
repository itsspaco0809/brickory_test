import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  PackageCheck,
  Globe2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase, type Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type HomeSection = 'new-in' | 'top-rated' | 'display';

const categoryMeta = [
  { label: 'Super Cars', query: 'Super Car', kicker: 'FAST & FLAMBOYANT' },
  { label: 'Sports Cars', query: 'Sports Car', kicker: 'BUILT TO MOVE' },
  { label: 'Track Cars', query: 'Track Car', kicker: 'RACE READY' },
  { label: 'Scenes & Display', query: 'Scene', kicker: 'MADE TO SHOW' },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newIn, setNewIn] = useState<Product[]>([]);
  const [scenes, setScenes] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product | null>>({});
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] = useState<HomeSection>('new-in');
  const [mobileScrollIndicator, setMobileScrollIndicator] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const collectionsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);

      const [featuredResult, kitsResult, scenesResult] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .eq('section', 'kits')
          .order('rating', { ascending: false })
          .limit(8),
        supabase
          .from('products')
          .select('*')
          .eq('section', 'kits')
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('products')
          .select('*')
          .eq('section', 'kits')
          .order('rating', { ascending: false })
          .limit(24),
      ]);

      if (!active) return;

      const kits = kitsResult.data || [];
      setFeatured(featuredResult.data || []);
      setNewIn(kits.slice(0, 8));
      const sceneProducts = (scenesResult.data || []).filter((p) => {
        const category = p.category as unknown;
        return Array.isArray(category)
          ? category.includes('Scene')
          : category === 'Scene' || String(category).toLowerCase().includes('scene');
      });
      setScenes(sceneProducts.slice(0, 8));

      const reps: Record<string, Product | null> = {};
      for (const item of categoryMeta) {
        reps[item.query] =
          kits.find((p) => {
            const category = p.category as unknown;
            return Array.isArray(category)
              ? category.includes(item.query)
              : category === item.query;
          }) || null;
      }
      setCategoryProducts(reps);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const products = [...featured, ...newIn, ...scenes];
    if (!products.length) {
      setIsReady(true);
      return;
    }

    let active = true;
    setIsReady(false);

    const images = products.map((product) => {
      if (!product.image_url) return Promise.resolve();
      const image = new Image();
      image.src = product.image_url;
      return image.decode().catch(() => undefined);
    });

    Promise.race([
      Promise.all(images).then(() => new Promise((resolve) => setTimeout(resolve, 220))),
      new Promise((resolve) => setTimeout(resolve, 1600)),
    ]).then(() => {
      if (active) setIsReady(true);
    });

    return () => {
      active = false;
    };
  }, [featured, newIn, scenes]);

  useEffect(() => {
    const handleIntro = () => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    window.addEventListener('introComplete', handleIntro);
    return () => window.removeEventListener('introComplete', handleIntro);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.brickory-hero-item',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.08,
        }
      );

      gsap.fromTo(
        '.brickory-category-card',
        { y: 24, opacity: 0 },
        {
          scrollTrigger: {
            trigger: collectionsRef.current,
            start: 'top 82%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        '.brickory-cta-item',
        { y: 20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 82%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [isReady]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth * 0.78 : el.clientWidth * 0.78,
      behavior: 'smooth',
    });
  };

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const step = Math.max(1, el.clientWidth * 0.5);
    setMobileScrollIndicator(Math.round(el.scrollLeft / step));
  };

  const activeProducts =
    activeSection === 'new-in'
      ? newIn
      : activeSection === 'top-rated'
        ? featured
        : scenes;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#f7f4ed] dark:bg-[#0d0c0a] text-neutral-950 dark:text-white overflow-hidden"
    >
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative pt-28 sm:pt-32 lg:pt-40 pb-14 sm:pb-20"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-[#d98a58]/15 blur-3xl" />
          <div className="absolute top-40 -left-28 w-72 h-72 rounded-full bg-[#e6c36a]/20 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-neutral-900/5 dark:bg-white/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="brickory-hero-item inline-flex items-center gap-2 rounded-full border border-neutral-900/10 dark:border-white/10 bg-white/65 dark:bg-white/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">
                <Sparkles className="w-3.5 h-3.5 text-[#c76b3e]" />
                Curated building sets from Asia
              </div>

              <h1 className="brickory-hero-item mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-[6.3rem] leading-[0.9] tracking-[-0.055em] font-black max-w-4xl">
                From bricks
                <span className="block text-[#c76b3e]">to something.</span>
                <span className="block">worth keeping.</span>
              </h1>

              <p className="brickory-hero-item mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Brickory brings together building sets from independent and established
                brands, selected for the models, mechanisms and details worth your shelf space.
              </p>

              <div className="brickory-hero-item mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/store"
                  className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 dark:bg-white px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white dark:text-neutral-950 transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Shop the collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/store?sort=rating"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-900/15 dark:border-white/15 bg-white/50 dark:bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  Best rated
                </Link>
              </div>

              <div className="brickory-hero-item mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                <span className="inline-flex items-center gap-2">
                  <Globe2 className="w-4 h-4" /> Worldwide shipping
                </span>
                <span className="inline-flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" /> Curated catalogue
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Secure checkout
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[470px] aspect-[4/5]">
                <div className="absolute inset-7 rounded-[2.5rem] rotate-3 bg-[#dfc58d] dark:bg-[#4a3827] shadow-2xl" />
                <div className="absolute inset-2 rounded-[2.5rem] -rotate-3 bg-[#c76b3e] shadow-2xl overflow-hidden">
                  {newIn[0]?.image_url ? (
                    <img
                      src={newIn[0].image_url}
                      alt={newIn[0].name}
                      className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center p-8 text-white">
                      <div className="text-center">
                        <div className="text-6xl font-black tracking-tight">B</div>
                        <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em]">
                          The Brickory Bakehouse
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/65 via-transparent to-white/10" />
                  <div className="absolute left-6 right-6 bottom-6 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-75">
                      Fresh from the catalogue
                    </p>
                    <p className="mt-1 text-xl sm:text-2xl font-black leading-tight">
                      {newIn[0]?.name || 'Your next build'}
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-2 sm:-left-8 rounded-2xl border border-neutral-900/10 dark:border-white/10 bg-[#fffaf1] dark:bg-neutral-900 px-4 py-3 shadow-xl rotate-[-4deg]">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">Brickory</p>
                  <p className="mt-1 text-sm font-black">Baked for builders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section ref={collectionsRef} className="relative py-14 sm:py-20 bg-white/60 dark:bg-white/[0.025] border-y border-neutral-900/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c76b3e]">Browse the counter</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">What are you building?</h2>
            </div>
            <Link to="/store" className="hidden sm:inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:text-[#c76b3e] transition-colors">
              Shop all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categoryMeta.map((category) => {
              const product = categoryProducts[category.query];
              return (
                <Link
                  key={category.query}
                  to={`/store?category=${encodeURIComponent(category.query)}`}
                  className="brickory-category-card group relative aspect-[0.9] rounded-[1.6rem] overflow-hidden bg-neutral-200 dark:bg-neutral-800 opacity-0"
                >
                  {product?.image_url ? (
                    <img
                      src={product.image_url}
                      alt={category.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d9c49a] via-[#b96d45] to-neutral-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/15 to-transparent" />
                  <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 text-white">
                    <p className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] opacity-75">{category.kicker}</p>
                    <h3 className="mt-1 text-lg sm:text-2xl font-black">{category.label}</h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold opacity-80 group-hover:opacity-100">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-6 mb-7">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                ['new-in', 'Fresh out the oven'],
                ['top-rated', 'Builder favourites'],
                ['display', 'Shelf worthy'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveSection(id as HomeSection);
                    setMobileScrollIndicator(0);
                    requestAnimationFrame(() => {
                      carouselRef.current?.scrollTo({ left: 0, behavior: 'auto' });
                    });
                  }}
                  className={`rounded-full px-4 py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider border transition-all ${
                    activeSection === id
                      ? 'bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white'
                      : 'bg-white/60 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border-neutral-900/10 dark:border-white/10 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {activeSection === 'new-in'
                ? 'Fresh builds'
                : activeSection === 'top-rated'
                  ? 'Builder favourites'
                  : 'Made for the shelf'}
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scrollCarousel('left')} aria-label="Previous products" className="w-10 h-10 rounded-full border border-neutral-900/10 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center hover:bg-white dark:hover:bg-white/10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollCarousel('right')} aria-label="Next products" className="w-10 h-10 rounded-full border border-neutral-900/10 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center hover:bg-white dark:hover:bg-white/10">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading || !isReady ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-neutral-200/70 dark:bg-neutral-900 animate-pulse">
                <div className="aspect-square bg-neutral-300/60 dark:bg-neutral-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 rounded bg-neutral-300/60 dark:bg-neutral-800 w-4/5" />
                  <div className="h-4 rounded bg-neutral-300/60 dark:bg-neutral-800 w-1/2" />
                  <div className="h-9 rounded bg-neutral-300/60 dark:bg-neutral-800 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activeProducts.length ? (
          <>
            <div ref={carouselRef} onScroll={handleCarouselScroll} className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {activeProducts.map((product) => (
                <div key={product.id} className="shrink-0 w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] snap-start">
                  <ProductCard product={product} isNew={activeSection === 'new-in'} isReady={isReady} />
                </div>
              ))}
            </div>

            {activeProducts.length > 2 && (
              <div className="md:hidden flex items-center justify-center gap-1.5 mt-3">
                {Array.from({ length: Math.max(1, activeProducts.length - 1) }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      mobileScrollIndicator === i
                        ? 'w-6 bg-neutral-950 dark:bg-white'
                        : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-900/15 dark:border-white/10 p-10 text-center text-sm text-neutral-500">
            Your first batch is still cooling. Add products in the Brickory admin dashboard.
          </div>
        )}
      </section>

      {/* BRAND STORY / CTA */}
      <section ref={ctaRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="rounded-[2rem] bg-neutral-950 dark:bg-[#17130f] text-white overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#c76b3e]/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#dfc58d]/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-14 items-center p-7 sm:p-12 lg:p-16">
            <div className="lg:col-span-7">
              <p className="brickory-cta-item text-xs font-black uppercase tracking-[0.22em] text-[#e0b27d] opacity-0">
                The Brickory idea
              </p>
              <h2 className="brickory-cta-item mt-3 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] opacity-0">
                From a handful of bricks to a model you want to keep.
              </h2>
              <p className="brickory-cta-item mt-6 max-w-2xl text-neutral-300 leading-relaxed opacity-0">
                We curate building sets from brands and makers around Asia, then make the
                good stuff easier to discover. No need to know every manufacturer — just
                find something you want to build.
              </p>
              <div className="brickory-cta-item mt-8 opacity-0">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-950 px-6 py-3.5 text-sm font-black uppercase tracking-wider hover:bg-[#f3e6d2] transition-colors"
                >
                  Start building <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="brickory-cta-item rounded-2xl bg-white/10 border border-white/10 p-5 opacity-0">
                <p className="text-3xl font-black">01</p>
                <p className="mt-8 text-sm font-black uppercase tracking-wider">Discover</p>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">Find brands and builds you might not see everywhere else.</p>
              </div>
              <div className="brickory-cta-item rounded-2xl bg-white/10 border border-white/10 p-5 opacity-0 translate-y-1">
                <p className="text-3xl font-black">02</p>
                <p className="mt-8 text-sm font-black uppercase tracking-wider">Build</p>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">Choose a set, open the box and make it yours.</p>
              </div>
              <div className="brickory-cta-item rounded-2xl bg-white/10 border border-white/10 p-5 opacity-0">
                <p className="text-3xl font-black">03</p>
                <p className="mt-8 text-sm font-black uppercase tracking-wider">Display</p>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">The finished model earns its place on the shelf.</p>
              </div>
              <div className="brickory-cta-item rounded-2xl bg-[#c76b3e] p-5 opacity-0">
                <p className="text-3xl font-black">B</p>
                <p className="mt-8 text-sm font-black uppercase tracking-wider">Brickory</p>
                <p className="mt-2 text-xs text-white/75 leading-relaxed">Baked for builders. Curated for collectors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
