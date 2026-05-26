import { useState, useEffect } from 'react';
// @ts-ignore
import MirageApp from './MirageApp';

export default function App() {
  const [activeApp, setActiveApp] = useState<'securify' | 'mirage'>('securify');
  
  // Form states
  const [coexistence, setCoexistence] = useState<'toggle' | 'standalone'>('toggle');
  const [tailwindVer, setTailwindVer] = useState<'v4' | 'v3'>('v4');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamically manage body classes based on active sub-app to prevent style leakages
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (activeApp === 'securify') {
      htmlEl.classList.add('securify-active');
      bodyEl.classList.add('securify-active');
    } else {
      htmlEl.classList.remove('securify-active');
      bodyEl.classList.remove('securify-active');
    }

    return () => {
      htmlEl.classList.remove('securify-active');
      bodyEl.classList.remove('securify-active');
    };
  }, [activeApp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
    // If user selected standalone, remove toggle option
    if (coexistence === 'standalone') {
      setActiveApp('securify');
    }
  };

  if (activeApp === 'mirage') {
    return (
      <div className="w-full min-h-screen bg-white text-black relative font-sans">
        <MirageApp />
        
        {/* Toggle back to Securify */}
        <button
          onClick={() => setActiveApp('securify')}
          className="fixed bottom-4 left-4 z-[9999] px-4 py-2 bg-black text-white text-xs font-mono rounded-full border border-neutral-800 hover:bg-neutral-900 transition-colors shadow-lg cursor-pointer"
        >
          [sys.dock // view securify landing]
        </button>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* Navbar / Header */}
      <header className="absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0">
        <nav className="flex items-center justify-between gap-4">
          
          {/* Left brand pill: Dolby VP Logo + Dot (No Text) */}
          <div className="flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur rounded-full px-4 py-3">
            <svg
              viewBox="0 0 256 256"
              className="h-5 w-5 fill-white"
            >
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-sm font-extrabold font-sans leading-none">.</span>
          </div>

          {/* Center pill (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
            <a href="#platform" className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full font-sans">
              platform
            </a>
            <a href="#solutions" className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full font-sans">
              solutions
            </a>
            <a href="#company" className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full font-sans">
              company
            </a>
            <a href="#support" className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full font-sans">
              support
            </a>
          </div>

          {/* Right button */}
          <button className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors cursor-pointer font-sans">
            get started
          </button>
        </nav>
      </header>

      {/* Foreground Content Wrapper */}
      <div className="relative h-full w-full z-10 pointer-events-none">
        
        {/* Three giant staggered headline words */}
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%] lowercase select-none">
          protect
        </h1>
        
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%] lowercase select-none">
          your
        </h1>
        
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%] lowercase select-none">
          data
        </h1>

        {/* Description paragraph */}
        <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90 font-sans pointer-events-auto lowercase">
          we can guarding your data with utmost care, empowering you with privacy everywhere
        </p>

        {/* Stat block - top-right */}
        <div className="absolute right-6 md:right-24 top-[14%] flex flex-col items-end">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-sans">+65k</span>
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 text-right font-sans lowercase">
            startups use
          </span>
        </div>

        {/* Stat block - bottom-left */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24 flex flex-col items-start">
          <div className="flex items-center gap-3 justify-start">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-sans">+1.5b</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 font-sans lowercase">
            gb data was protected
          </span>
        </div>

        {/* Stat block - bottom-right */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20 flex flex-col items-end">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-sans">+300k</span>
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 text-right font-sans lowercase">
            downloads
          </span>
        </div>

        {/* Interactive White-Font Integration Form (Right Side) */}
        <div className="absolute right-6 md:right-16 top-[24%] md:top-[26%] w-[calc(100%-3rem)] md:w-[420px] bg-neutral-950/85 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 text-white font-sans flex flex-col pointer-events-auto shadow-2xl z-30">
          <div className="mb-4">
            <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">system config panel</h2>
            <p className="text-xs text-neutral-500 mt-0.5 lowercase font-mono">sync live workspace preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Mirage Coexistence Question */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                mirage coexistence
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="coexistence"
                    checked={coexistence === 'toggle'}
                    onChange={() => setCoexistence('toggle')}
                    className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                  />
                  <span className="text-sm text-white/95 group-hover:text-white transition-colors lowercase">
                    keep both portals (floating dock)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="coexistence"
                    checked={coexistence === 'standalone'}
                    onChange={() => setCoexistence('standalone')}
                    className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                  />
                  <span className="text-sm text-white/95 group-hover:text-white transition-colors lowercase">
                    standalone landing page
                  </span>
                </label>
              </div>
            </div>

            {/* Tailwind CSS Version Question */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                tailwind version target
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="tailwindVer"
                    checked={tailwindVer === 'v4'}
                    onChange={() => setTailwindVer('v4')}
                    className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                  />
                  <span className="text-sm text-white/95 group-hover:text-white transition-colors lowercase">
                    tailwind css v4 (modern build)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="tailwindVer"
                    checked={tailwindVer === 'v3'}
                    onChange={() => setTailwindVer('v3')}
                    className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                  />
                  <span className="text-sm text-white/95 group-hover:text-white transition-colors lowercase">
                    tailwind css v3 (legacy engine)
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-full text-sm font-semibold tracking-wider hover:bg-neutral-200 transition-colors uppercase cursor-pointer"
            >
              initialize preference sync
            </button>

          </form>
        </div>

      </div>

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black z-10" />

      {/* Conditional floating toggle (Only shown if coexistence is 'toggle') */}
      {coexistence === 'toggle' && (
        <button
          onClick={() => setActiveApp('mirage')}
          className="fixed bottom-4 left-4 z-[999] px-4 py-2 bg-neutral-900/90 text-neutral-300 text-xs font-mono rounded-full border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-colors shadow-lg cursor-pointer"
        >
          [sys.dock // view mirage core]
        </button>
      )}

      {/* Live Sync Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full text-white font-sans text-center shadow-2xl">
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 256 256" className="h-10 w-10 fill-white">
                <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
              </svg>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">sync status</h3>
            <h4 className="text-lg font-medium mt-1 mb-2 lowercase text-white">mainframe synchronized</h4>
            <p className="text-sm text-neutral-400 mb-6 lowercase leading-relaxed">
              preferences recorded. mirage coexistence set to: <strong className="text-white">{coexistence}</strong>. compilation compiler set to: <strong className="text-white">{tailwindVer}</strong>.
            </p>
            
            <button
              onClick={handleCloseModal}
              className="w-full bg-white text-black py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              close mainframe link
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
