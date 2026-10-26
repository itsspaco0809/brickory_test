import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/lib/theme';
import { getGlobalLenis } from '@/lib/lenis';

interface IntroOverlayProps {
  onComplete?: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const wordmark = wordmarkRef.current;
    const line = lineRef.current;
    const mainContent = document.getElementById('main-content');

    if (!overlay || !wordmark || !line || !mainContent) return;

    gsap.set(mainContent, {
      y: window.innerHeight,
      opacity: 1,
      visibility: 'visible',
      force3D: true,
    });

    gsap.set(overlay, {
      yPercent: 0,
      opacity: 1,
      visibility: 'visible',
      display: 'flex',
      force3D: true,
    });

    gsap.set(wordmark, { y: 18, opacity: 0, scale: 0.96 });
    gsap.set(line, { scaleX: 0, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    tl.to(wordmark, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.65,
      ease: 'power3.out',
    })
      .to(
        line,
        {
          scaleX: 1,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '-=0.25'
      )
      .to({}, { duration: 0.25 })
      .add('reveal')
      .to(
        mainContent,
        {
          y: 0,
          duration: 0.95,
          ease: 'power3.inOut',
          force3D: true,
        },
        'reveal'
      )
      .to(
        overlay,
        {
          yPercent: -100,
          duration: 0.95,
          ease: 'power3.inOut',
          force3D: true,
          onComplete: () => {
            gsap.set(mainContent, { clearProps: 'transform,willChange' });
            gsap.set(overlay, { clearProps: 'transform,willChange' });
            overlay.style.display = 'none';

            const lenis = getGlobalLenis();
            if (lenis) {
              lenis.resize();
              lenis.start();
            }

            window.dispatchEvent(new CustomEvent('introComplete'));
            onComplete?.();
          },
        },
        'reveal'
      );

    return () => {
      tl.kill();
      gsap.set(mainContent, { clearProps: 'transform,willChange' });
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[9999] w-full h-[100dvh] min-h-[100svh] flex items-center justify-center overflow-hidden select-none pointer-events-none ${
        theme === 'dark' ? 'bg-[#0d0c0a] text-white' : 'bg-[#f7f4ed] text-neutral-950'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="flex flex-col items-center">
        <div ref={wordmarkRef} className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-1 w-10 h-10 rotate-[-6deg]">
            <span className="rounded-[5px] bg-[#c76b3e]" />
            <span className="rounded-[5px] bg-[#dfc58d]" />
            <span className="rounded-[5px] bg-[#dfc58d]" />
            <span className="rounded-[5px] bg-[#c76b3e]" />
          </div>
          <span className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.055em]">BRICKORY</span>
        </div>
        <div ref={lineRef} className="mt-5 h-1 w-28 sm:w-40 rounded-full bg-[#c76b3e]" />
        <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
          Where bricks become models
        </p>
      </div>
    </div>
  );
}
