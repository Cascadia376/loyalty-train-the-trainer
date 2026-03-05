/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, X } from 'lucide-react';

// --- Constants & Types ---

interface Tier {
  name: string;
  icon: string;
  details: string[];
}

interface Scene {
  title: string;
  subtitle?: string;
  content?: string;
  list?: string[];
  listTitle?: string;
  footer?: string;
  tiers?: Tier[];
  grid?: { title: string; items: string[] }[];
  noUppercase?: boolean;
  video?: string;
}

const SCRIPT_SCENES: Scene[] = [
  {
    title: "Why do our guests choose Cascadia\ninstead of another liquor store?",
    subtitle: "What is Loyalty?",
    noUppercase: true
  },
  {
    title: "It's about more than\npoints and tiers\n– It's about…",
    subtitle: "The Automatic Choice"
  },
  {
    title: "Why don’t I just go to Cascadia?",
    subtitle: "Creating moments where someone standing in another store thinks:",
    noUppercase: true
  },
  {
    title: "The Den",
    list: [
      "Tracks Purchases",
      "Rewards Guests with points",
      "Unlocks tier-based benefits",
      "Delivers personalized offers"
    ]
  },
  {
    title: "How Guests Earn Points",
    list: [
      "For Every Dollar Spent they Will Earn 10 points",
      "Bonus Promotions Through the Year",
      "Enrollment bonus: Early Sign Up Bonuses"
    ],
    footer: "Points are earned automatically when:\n• Phone/email is entered\n• Guest is enrolled"
  },
  {
    title: "How Guests Redeem Points",
    content: "1000 Points = $1.00 OFF\n\nRedeem Instantly at checkout for any dollar amount. No complex tiers, no blackout dates."
  },
  {
    title: "Three Tiers of Loyalty",
    tiers: [
      {
        name: "Cub",
        icon: "🐻",
        details: ["ENTRY LEVEL", "10 pts / $1 spent", "0–9,999 PTS (ANNUAL RESET)", "Birthday Rewards", "Member Sales"]
      },
      {
        name: "Black Bear",
        icon: "🐻",
        details: ["MID TIER", "10 pts / $1 spent", "10,000–49,999 PTS (ANNUAL RESET)", "Earned after ~$1,000 spend", "Birthday Rewards", "Member Sales"]
      },
      {
        name: "Grizzly",
        icon: "👑",
        details: ["VIP STATUS", "10 pts / $1 spent", "50,000+ PTS (ANNUAL RESET)", "Earned after ~$3,000 spend", "Birthday Rewards", "Member Sales"]
      }
    ]
  },
  {
    title: "What Staff Need to Know",
    subtitle: "Frontline staff do NOT need to memorize everything.",
    list: [
      "It’s free",
      "Guests earn points on purchases",
      "Points convert into rewards",
      "Higher spend unlocks tiers"
    ],
    footer: "If guests want more detail, managers can support."
  },
  {
    title: "The Core Behavior",
    subtitle: "We are building one habit: Invite every guest.",
    grid: [
      {
        title: "Staff do not control:",
        items: ["Whether guests say yes", "Whether they like loyalty programs"]
      },
      {
        title: "Staff control:",
        items: ["Whether they ask", "How they ask"]
      }
    ]
  },
  {
    title: "Are you a member of our loyalty program?\nYou qualify for 5000 bonus points right now.\nCan I set that up and add them to your account?",
    subtitle: "The Invitation",
    noUppercase: true,
    listTitle: "Key Coaching Points",
    list: [
      "Calm tone",
      "No over-explaining",
      "Natural delivery",
      "Short and clear"
    ]
  },
  {
    title: "If They Say Yes",
    listTitle: "Staff should:",
    list: [
      "Move smoothly into enrollment",
      "Confirm guest information",
      "Keep transaction flowing"
    ],
    footer: "Confidence builds trust."
  },
  {
    title: "Enrolling a Guest",
    video: "/pos_main%202026-03-04%2015-51-27.mp4"
  },
  {
    title: "“No problem. If you decide to later, there’s a QR code you can use.”",
    subtitle: "If They Say No",
    noUppercase: true,
    listTitle: "Important:",
    list: [
      "Move on",
      "No second attempt",
      "No pressure",
      "No awkward pause"
    ]
  },
  {
    title: "Behavioral Coaching",
    subtitle: "Focus on consistency, not conversion.",
    content: "The goal of coaching is to ensure every guest receives a confident invitation, regardless of the outcome.",
    listTitle: "What to Observe:",
    list: [
      "Confidence in the delivery",
      "Clarity of the invitation",
      "Smoothness of the exit",
      "Maintaining transaction speed"
    ]
  },
  {
    title: "Common Coaching Issues",
    listTitle: "Watch for:",
    list: [
      "Staff skipping the ask",
      "Over-explaining",
      "Apologetic tone",
      "Persuasion attempts"
    ],
    footer: "Correction example: “Keep the script shorter — let’s try it again.”"
  },
  {
    title: "“You qualify for bonus points — there’s a QR code if you'd like to sign up later.”",
    subtitle: "Busy Line Protocol",
    noUppercase: true,
    footer: "We never slow down service."
  },
  {
    title: "Launch Timeline",
    list: [
      "Roadshow",
      "Team Training",
      "Launch Week"
    ]
  },
  {
    title: "Manager Responsibilities",
    listTitle: "Managers must:",
    list: [
      "Train their teams",
      "Role-play the script",
      "Observe transactions",
      "Reinforce behavior daily",
      "Review loyalty dashboard metrics"
    ],
    footer: "Managers set the tone for adoption."
  },
  {
    title: "“Why don’t I just go to Cascadia?”",
    content: "Loyalty programs don’t succeed because of points.\n\nThey succeed because of consistent behavior.\n\nIf every guest receives a confident invitation, loyalty will grow naturally.\n\nAnd eventually, someone standing in another store will think:\n\n“Why don’t I just go to Cascadia?”\n\nThat’s what we’re building.",
    noUppercase: true
  }
];

// --- Components ---

export default function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSlideThree = currentScene === 2;

  const handlePrev = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setIsVideoModalOpen(false);
    }
  }, [currentScene]);

  const handleNext = useCallback(() => {
    if (currentScene < SCRIPT_SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setIsVideoModalOpen(false);
    }
  }, [currentScene]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const scene = SCRIPT_SCENES[currentScene];

  return (
    <div className="relative w-full h-screen bg-brand-cream overflow-hidden font-sans text-brand-dark flex flex-col">
      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-18 pb-4 px-6 md:px-12 lg:px-16 text-center overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentScene}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-7xl"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="block font-mono text-[10px] uppercase tracking-[0.4em] mb-4 font-bold text-brand-red"
            >
              Slide {currentScene + 1} / {SCRIPT_SCENES.length}
            </motion.span>
            
            {/* Conditional Layout for Slide 4 vs Others */}
            {currentScene === 3 ? (
              <>
                <img
                  src="/The-Den_logo-brown.png?v=20260305"
                  alt="The Den"
                  className="w-[300px] md:w-[420px] lg:w-[520px] mx-auto mb-3"
                />
                {scene.subtitle && (
                  <h2 className={`text-xl md:text-3xl mb-4 leading-relaxed ${isSlideThree ? 'font-sans not-italic font-semibold text-brand-dark' : 'font-serif italic text-brand-brown/90'}`}>
                    {scene.subtitle}
                  </h2>
                )}
              </>
            ) : (
              <>
                {scene.subtitle && (
                  <h2 className={`text-xl md:text-3xl mb-4 leading-relaxed ${isSlideThree ? 'font-sans not-italic font-semibold text-brand-dark' : 'font-serif italic text-brand-brown/90'}`}>
                    {scene.subtitle}
                  </h2>
                )}
                <h1 className={`font-display font-bold tracking-tight mb-4 leading-[1.06] text-brand-brown whitespace-pre-wrap ${scene.noUppercase ? '' : 'uppercase'} ${scene.title.length > 50 ? 'text-3xl md:text-5xl lg:text-6xl' : scene.title.length > 20 ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-5xl md:text-7xl lg:text-8xl'}`}>
                  {scene.title}
                </h1>
              </>
            )}

            <div className="h-[2px] w-12 mx-auto mb-6 bg-brand-red" />

            {/* List Rendering */}
            {scene.list && (
              <div className="max-w-4xl mx-auto mb-6">
                {scene.listTitle && (
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider mb-4 text-center pb-2 max-w-xs mx-auto text-brand-red border-b border-brand-red/10">
                    {scene.listTitle}
                  </h3>
                )}
                <div className={`${scene.list.length >= 3 ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2' : 'space-y-2'}`}>
                  {scene.list.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-left text-lg md:text-2xl text-brand-dark/80"
                    >
                      <ChevronRight className="mt-1 flex-shrink-0 text-brand-red" size={18} />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tiers Rendering */}
            {scene.tiers && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {scene.tiers.map((tier, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-brand-brown/10 text-left shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-xl shadow-inner">
                        {tier.icon}
                      </div>
                      <h3 className="font-display text-xl font-bold text-brand-brown tracking-tight">{tier.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {tier.details.map((detail, j) => (
                        <li key={j} className="text-sm md:text-base font-mono uppercase tracking-[0.08em] text-black border-b border-brand-brown/10 pb-1 last:border-0">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Grid Rendering */}
            {scene.grid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-6">
                {scene.grid.map((col, i) => (
                  <div key={i} className="text-left">
                    <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider mb-4 pb-2 text-brand-red border-b border-brand-red/20">
                      {col.title}
                    </h3>
                    <div className="space-y-2">
                      {col.items.map((item, j) => (
                        <motion.div 
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (i * 2 + j) * 0.1 }}
                          className="flex items-start gap-3 text-lg md:text-xl text-brand-dark/80"
                        >
                          <ChevronRight className="mt-1 flex-shrink-0 text-brand-red" size={16} />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content Text Rendering */}
            {scene.content && (
              <p className="text-lg md:text-2xl font-normal leading-relaxed text-brand-dark/80 max-w-5xl mx-auto whitespace-pre-wrap mb-6">
                {scene.content}
              </p>
            )}

            {/* Video Rendering */}
            {scene.video && (
              <div className="max-w-lg mx-auto mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative group w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-brand-brown/10 bg-brand-brown/5 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-brand-brown/10 group-hover:bg-brand-brown/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-colors bg-brand-red group-hover:bg-brand-red/90">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-brand-brown/60 font-bold">
                    Click to Play Demo
                  </div>
                </motion.button>
              </div>
            )}

            {/* Footer Text Rendering */}
            {scene.footer && (
              <div className="mt-4 pt-4 border-t border-brand-brown/10 text-xs md:text-sm font-mono text-brand-brown/80 uppercase tracking-widest whitespace-pre-wrap">
                {scene.footer}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      <div className="pb-3 flex flex-col items-center gap-2">
        {/* Progress Bar */}
        <div className="w-64 h-[2px] bg-brand-brown/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-red"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScene + 1) / SCRIPT_SCENES.length) * 100}%` }}
          />
        </div>
        
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-brown/40 font-bold">
          Use Arrows to Navigate
        </div>
      </div>

      {/* Branding */}
      {currentScene === 0 && (
        <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 z-20">
          <img src="/logo.png" alt="Cascadia" className="w-[80px] md:w-[110px] h-auto" />
        </div>
      )}

      {currentScene > 0 && (
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <img src="/logo.png" alt="Cascadia" className="w-[52px] md:w-[72px] h-auto opacity-90" />
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && scene.video && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-brand-dark/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>
              
              <video
                ref={videoRef}
                src={scene.video}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = 1.75;
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

