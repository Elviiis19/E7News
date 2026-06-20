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
        <div className="absolute inset-0 z-0">
          <img 
            src={currentPage.imageUrl} 
            alt={currentPage.imageAlt} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
        </div>

        {/* Top Progress Bars */}
        <div className="absolute top-0 left-0 w-full z-20 flex gap-1 p-3">
          {story.pages.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded overflow-hidden">
              <div 
                className={`h-full bg-white transition-all durationLinear`}
                style={{ 
                  width: idx < currentPageIndex ? '100%' : idx === currentPageIndex ? '100%' : '0%',
                  transitionDuration: idx === currentPageIndex ? '5000ms' : '0ms'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header content */}
        <div className="absolute top-6 left-0 w-full z-20 flex justify-between items-center p-4">
          <span className="text-white font-bold text-shadow drop-shadow-md text-sm">{story.title}</span>
          <button onClick={onClose} className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition">
             <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 flex items-end p-6 pb-12">
          <div>
            <h2 className="text-3xl font-black text-white text-shadow-lg leading-tight mb-2">
              {story.title}
            </h2>
            <p className="text-white/90 text-sm font-medium drop-shadow-md">
              {currentPage.imageAlt}
            </p>
          </div>
        </div>

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
