import React, { useState, useEffect } from "react";
import { getWebStories } from "../lib/db";
import { WebStory } from "../types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface WebStoryViewProps {
  storySlug: string;
  onClose: () => void;
}

export default function WebStoryView({ storySlug, onClose }: WebStoryViewProps) {
  const [story, setStory] = useState<WebStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    async function loadStory() {
      const stories = await getWebStories();
      const st = stories.find(s => s.slug === storySlug);
      if (st) {
        setStory(st);
        document.title = st.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", st.description);
        }
      }
      setLoading(false);
    }
    loadStory();
  }, [storySlug]);

  const goToNextPage = () => {
    if (story && currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      onClose(); // End of story, going back
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    // Autoplay timer
    if (loading || !story) return;
    const timer = setTimeout(() => {
      goToNextPage();
    }, 5000); // 5 seconds per page
    return () => clearTimeout(timer);
  }, [loading, story, currentPageIndex]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!story || story.pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white flex-col">
        <h1 className="text-2xl font-bold mb-4">WebStory não encontrado</h1>
        <button onClick={onClose} className="px-6 py-2 bg-slate-800 rounded">Voltar</button>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex];

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center sm:p-4 WebStoryContainer">
      
      {/* Mobile-like frame constraints */}
      <div className="relative w-full h-full sm:w-[400px] sm:h-[700px] bg-black sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col group">
        
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <style>{`
            .animate-zoom-out-override {
              animation: zoom-out-story 5s linear forwards;
            }
            @keyframes zoom-out-story {
              0% { transform: scale(1.2); }
              100% { transform: scale(1.0); }
            }
            .animate-zoom-in-override {
               animation: zoom-in-story 5s linear forwards;
            }
            @keyframes zoom-in-story {
               0% { transform: scale(1.0); }
               100% { transform: scale(1.2); }
            }
            .animate-pan-up-override {
               animation: pan-up-story 5s linear forwards;
            }
            @keyframes pan-up-story {
               0% { transform: scale(1.1) translateY(0%); }
               100% { transform: scale(1.1) translateY(-5%); }
            }
            .animate-pan-down-override {
               animation: pan-down-story 5s linear forwards;
            }
            @keyframes pan-down-story {
               0% { transform: scale(1.1) translateY(-5%); }
               100% { transform: scale(1.1) translateY(0%); }
            }
          `}</style>
          
          <img 
            src={currentPage.imageUrl} 
            alt={currentPage.imageAlt || currentPage.title} 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover absolute inset-0 z-0
              ${currentPage.animation === 'zoom-in' ? 'animate-zoom-in-override' : ''}
              ${currentPage.animation === 'zoom-out' ? 'animate-zoom-out-override' : ''}
              ${currentPage.animation === 'pan-up' ? 'animate-pan-up-override' : ''}
              ${currentPage.animation === 'pan-down' ? 'animate-pan-down-override' : ''}
            `}
            key={`img-${currentPageIndex}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 z-10"></div>
        </div>

        {/* Top Progress Bars */}
        <div className="absolute top-0 left-0 w-full z-20 flex gap-1 p-3">
          {story.pages.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-linear`}
                style={{ 
                  width: idx < currentPageIndex ? '100%' : idx === currentPageIndex ? '100%' : '0%',
                  transitionDuration: idx === currentPageIndex ? '5000ms' : '0ms'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header content */}
        <header className="absolute top-6 left-0 w-full z-20 flex justify-between items-center p-4 pt-2">
          <h1 className="text-white/80 font-bold text-shadow drop-shadow-md text-xs sm:text-sm uppercase tracking-widest truncate pr-4">{story.title}</h1>
          <button onClick={onClose} className="bg-black/40 p-2 rounded-full text-white hover:bg-black/70 transition shrink-0">
             <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </header>

        {/* Content Area */}
        <article className="relative z-10 flex-1 flex items-end p-6 pb-14">
          <div className="w-full">
            {currentPage.title && (
              <h2 className="text-3xl sm:text-4xl font-black text-white text-shadow-lg leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {currentPage.title}
              </h2>
            )}
            {!currentPage.title && (
              <h2 className="text-3xl font-black text-white text-shadow-lg leading-tight mb-2">
                {story.title}
              </h2>
            )}
            
            {(currentPage.text || currentPage.imageAlt) && (
               <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border-l-4 border-[#cc0000]">
                  <p className="text-white/95 text-base sm:text-lg font-medium drop-shadow-md leading-relaxed">
                    {currentPage.text || currentPage.imageAlt}
                  </p>
               </div>
            )}
          </div>
        </article>

        {/* Side Click Areas for Navigation */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-pointer" onClick={goToPrevPage}></div>
        <div className="absolute inset-y-0 right-0 w-2/3 z-30 cursor-pointer" onClick={goToNextPage}></div>

        {/* Optional nav buttons strictly visible on desktop hover */}
        <button onClick={goToPrevPage} className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 p-2 rounded-full hidden sm:group-hover:block transition opacity-0 group-hover:opacity-100">
           <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={goToNextPage} className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 p-2 rounded-full hidden sm:group-hover:block transition opacity-0 group-hover:opacity-100">
           <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
      
    </div>
  );
}
