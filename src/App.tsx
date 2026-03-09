/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Play,
  Printer,
  QrCode,
  Store,
  Users,
  X
} from 'lucide-react';

type TeamTabId = 'training' | 'poster' | 'leaderboard';

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

interface TrainingCard {
  title: string;
  body: string;
  action?: string;
}

interface StoreSignup {
  store: string;
  total: number;
  today: number;
  goal: number;
}

const SCRIPT_SCENES: Scene[] = [
  {
    title: 'Why do our guests choose Cascadia\ninstead of another liquor store?',
    subtitle: 'What is Loyalty?',
    noUppercase: true
  },
  {
    title: "It's about more than\npoints and tiers\n- It's about...",
    subtitle: 'The Automatic Choice'
  },
  {
    title: 'Why do not I just go to Cascadia?',
    subtitle: 'Creating moments where someone standing in another store thinks:',
    noUppercase: true
  },
  {
    title: 'The Den',
    list: [
      'Tracks Purchases',
      'Rewards Guests with points',
      'Unlocks tier-based benefits',
      'Delivers personalized offers'
    ]
  },
  {
    title: 'How Guests Earn Points',
    list: [
      'For Every Dollar Spent they Will Earn 10 points',
      'Bonus Promotions Through the Year',
      'Enrollment bonus: Early Sign Up Bonuses'
    ],
    footer: 'Points are earned automatically when:\n- Phone/email is entered\n- Guest is enrolled'
  },
  {
    title: 'How Guests Redeem Points',
    content:
      '1000 Points = $1.00 OFF\n\nRedeem Instantly at checkout for any dollar amount. No complex tiers, no blackout dates.'
  },
  {
    title: 'Three Tiers of Loyalty',
    tiers: [
      {
        name: 'Cub',
        icon: 'Cub',
        details: ['ENTRY LEVEL', '10 pts / $1 spent', '0-9,999 PTS (ANNUAL RESET)', 'Birthday Rewards', 'Member Sales']
      },
      {
        name: 'Black Bear',
        icon: 'Bear',
        details: [
          'MID TIER',
          '10 pts / $1 spent',
          '10,000-49,999 PTS (ANNUAL RESET)',
          'Earned after ~$1,000 spend',
          'Birthday Rewards',
          'Member Sales'
        ]
      },
      {
        name: 'Grizzly',
        icon: 'VIP',
        details: [
          'VIP STATUS',
          '10 pts / $1 spent',
          '50,000+ PTS (ANNUAL RESET)',
          'Earned after ~$3,000 spend',
          'Birthday Rewards',
          'Member Sales'
        ]
      }
    ]
  },
  {
    title: 'What Staff Need to Know',
    subtitle: 'Frontline staff do NOT need to memorize everything.',
    list: ['It is free', 'Guests earn points on purchases', 'Points convert into rewards', 'Higher spend unlocks tiers'],
    footer: 'If guests want more detail, managers can support.'
  },
  {
    title: 'The Core Behaviour',
    subtitle: 'We are building one habit: Invite every guest.',
    grid: [
      {
        title: 'Staff do not control:',
        items: ['Whether guests say yes', 'Whether they like loyalty programs']
      },
      {
        title: 'Staff control:',
        items: ['Whether they ask', 'How they ask']
      }
    ]
  },
  {
    title:
      'Are you a member of our new loyalty program?\nYou qualify for 5000 bonus points right now.\nCan I set that up and add them to your account?',
    subtitle: 'The Invitation',
    noUppercase: true,
    listTitle: 'Key Coaching Points',
    list: ['Calm tone', 'No over-explaining', 'Natural delivery', 'Short and clear']
  },
  {
    title: 'If They Say Yes',
    listTitle: 'Staff should:',
    list: ['Move smoothly into enrollment', 'Confirm guest information', 'Keep transaction flowing'],
    footer: 'Confidence builds trust.'
  },
  {
    title: 'Enrolling a Guest',
    video: '/pos_main%202026-03-04%2015-51-27.mp4'
  },
  {
    title: '"That\'s Okay. If you decide to later, there is a QR code you can use."',
    subtitle: 'If They Say No',
    noUppercase: true,
    listTitle: 'Important:',
    list: ['Move on', 'No second attempt', 'No pressure', 'No awkward pause']
  },
  {
    title: 'Behavioural Coaching',
    subtitle: 'Focus on consistency, not conversion.',
    content: 'The goal is to ensure every guest receives an invitation, regardless of the outcome.',
    listTitle: 'What to Observe:',
    list: [
      'Confidence in the delivery',
      'Clarity of the invitation',
      'Smoothness of the exit',
      'Maintaining transaction speed'
    ]
  },
  {
    title: 'Common Coaching Issues',
    listTitle: 'Watch for:',
    list: ['Staff skipping the ask', 'Over-explaining', 'Apologetic tone', 'Persuasion attempts'],
    footer: 'Correction example: Keep the script shorter - let us try it again.'
  },
  {
    title:
      "Are you a loyalty member?\nIf not: You qualify for bonus points today. If you would like, you can scan the QR code to join now, or next time you're in the store.",
    subtitle: 'Busy Line Protocol',
    noUppercase: true,
    footer: 'We never slow down service. Use this when there are 4 people in line and there is no back up.'
  },
  {
    title: 'Launch Timeline',
    list: ['Roadshow', 'Team Training', 'Launch Week']
  },
  {
    title: 'Manager Expectations',
    listTitle: 'Managers must:',
    list: [
      'Train their teams',
      'Role-play the script',
      'Observe transactions',
      'Reinforce behavior daily',
      'Review loyalty dashboard metrics'
    ],
    footer: 'Managers set the tone for adoption.'
  },
  {
    title: 'Why do not I just go to Cascadia?',
    content:
      'Loyalty programs do not succeed because of points. They succeed because of consistent behavior. If every guest receives a confident invitation, loyalty will grow naturally. And eventually, someone standing in another store will think: Why do not I just go to Cascadia? That is what we are building.',
    noUppercase: true
  }
];

const TRAINING_CARDS: TrainingCard[] = [
  {
    title: 'Opening Script',
    body:
      'Ask every guest: "Are you a member of our loyalty program? You qualify for bonus points today." Keep it short and confident.',
    action: 'Use before payment every transaction.'
  },
  {
    title: 'If Guest Says Yes',
    body: 'Confirm phone or email, enroll in POS, and remind them points are automatic on future purchases.',
    action: 'Thank them and keep checkout moving.'
  },
  {
    title: 'If Guest Says No',
    body: 'Say: "No problem. You can scan the QR code and join any time." Do not pressure or repeat the pitch.',
    action: 'Move to next checkout step.'
  },
  {
    title: 'Busy Line Protocol',
    body: 'When the line reaches 4+ guests, use the short version and point to the QR poster near the till.',
    action: 'Service speed stays priority.'
  }
];

const STORE_SIGNUPS: StoreSignup[] = [
  { store: 'Downtown', total: 182, today: 26, goal: 200 },
  { store: 'Northgate', total: 149, today: 19, goal: 180 },
  { store: 'Riverside', total: 124, today: 17, goal: 150 },
  { store: 'Cedar Hills', total: 111, today: 14, goal: 140 },
  { store: 'West End', total: 97, today: 11, goal: 120 }
];
const TRAINER_ACCESS_CODE = (import.meta.env.VITE_TRAINER_ACCESS_CODE || '').trim();

function printSection(className: string) {
  const el = document.querySelector(className) as HTMLElement | null;
  if (!el) return;
  const body = document.body;
  body.classList.add('print-mode');
  document.querySelectorAll<HTMLElement>('.printable').forEach((node) => {
    node.dataset.prevDisplay = node.style.display;
    node.style.display = 'none';
  });
  el.style.display = 'block';
  window.print();
  document.querySelectorAll<HTMLElement>('.printable').forEach((node) => {
    node.style.display = node.dataset.prevDisplay || '';
  });
  body.classList.remove('print-mode');
}

function TrainerDeck() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSlideThree = currentScene === 2;

  const handlePrev = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
      setIsVideoModalOpen(false);
    }
  }, [currentScene]);

  const handleNext = useCallback(() => {
    if (currentScene < SCRIPT_SCENES.length - 1) {
      setCurrentScene((prev) => prev + 1);
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
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-18 pb-4 px-6 md:px-12 lg:px-16 text-center overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentScene}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-7xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="block font-mono text-[10px] uppercase tracking-[0.4em] mb-4 font-bold text-brand-red"
            >
              Slide {currentScene + 1} / {SCRIPT_SCENES.length}
            </motion.span>

            {currentScene === 3 ? (
              <>
                <img
                  src="/The-Den_logo-brown.png?v=20260305"
                  alt="The Den"
                  className="w-[300px] md:w-[420px] lg:w-[520px] mx-auto mb-8"
                />
                {scene.subtitle && (
                  <h2
                    className={`text-xl md:text-3xl mb-4 leading-relaxed ${
                      isSlideThree ? 'font-sans not-italic font-semibold text-brand-dark' : 'font-serif italic text-brand-brown/90'
                    }`}
                  >
                    {scene.subtitle}
                  </h2>
                )}
              </>
            ) : (
              <>
                {scene.subtitle && (
                  <h2
                    className={`text-xl md:text-3xl mb-4 leading-relaxed ${
                      isSlideThree ? 'font-sans not-italic font-semibold text-brand-dark' : 'font-serif italic text-brand-brown/90'
                    }`}
                  >
                    {scene.subtitle}
                  </h2>
                )}
                <h1
                  className={`font-display font-bold tracking-tight mb-8 leading-[1.06] text-brand-brown whitespace-pre-wrap ${
                    scene.noUppercase ? '' : 'uppercase'
                  } ${
                    scene.title.length > 50
                      ? 'text-3xl md:text-5xl lg:text-6xl'
                      : scene.title.length > 20
                      ? 'text-4xl md:text-6xl lg:text-7xl'
                      : 'text-5xl md:text-7xl lg:text-8xl'
                  }`}
                >
                  {scene.title}
                </h1>
              </>
            )}

            <div className="h-[2px] w-12 mx-auto mb-8 bg-brand-red" />

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
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-xs font-bold shadow-inner">
                        {tier.icon}
                      </div>
                      <h3 className="font-display text-xl font-bold text-brand-brown tracking-tight">{tier.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {tier.details.map((detail, j) => (
                        <li
                          key={j}
                          className="text-sm md:text-base font-mono uppercase tracking-[0.08em] text-black border-b border-brand-brown/10 pb-1 last:border-0"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            )}

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

            {scene.content && (
              <p className="text-lg md:text-2xl font-normal leading-relaxed text-brand-dark/80 max-w-5xl mx-auto whitespace-pre-wrap mb-6">
                {scene.content}
              </p>
            )}

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

            {scene.footer && (
              <div className="mt-4 pt-4 border-t border-brand-brown/10 text-xs md:text-sm font-mono text-brand-brown/80 uppercase tracking-widest whitespace-pre-wrap">
                {scene.footer}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-3 flex flex-col items-center gap-2">
        <div className="w-64 h-[2px] bg-brand-brown/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-red"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScene + 1) / SCRIPT_SCENES.length) * 100}%` }}
          />
        </div>

        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-brown/40 font-bold">Use Arrows to Navigate</div>
      </div>

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

function TrainingView() {
  return (
    <section className="space-y-4 printable">
      <header className="panel">
        <p className="eyebrow">Team Training</p>
        <h1>Serve Fast. Invite Every Guest. Build Loyalty.</h1>
        <p className="lede">
          This mobile training is for front-line team members. Focus on one behavior: make the invitation every time.
        </p>
      </header>

      <div className="grid-cards">
        {TRAINING_CARDS.map((card) => (
          <article key={card.title} className="panel card">
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            {card.action && (
              <div className="hint">
                <CheckCircle2 size={16} />
                <span>{card.action}</span>
              </div>
            )}
          </article>
        ))}
      </div>

      <article className="panel">
        <h2>Daily Checkout Checklist</h2>
        <ul className="checklist">
          <li>
            <CheckCircle2 size={16} /> Ask every guest about loyalty.
          </li>
          <li>
            <CheckCircle2 size={16} /> Mention bonus points clearly.
          </li>
          <li>
            <CheckCircle2 size={16} /> Use QR fallback when guest declines.
          </li>
          <li>
            <CheckCircle2 size={16} /> Keep line speed and tone positive.
          </li>
        </ul>
      </article>
    </section>
  );
}

function PosterView() {
  return (
    <section className="poster printable poster-print-only" data-print-title="Loyalty Training Poster">
      <div className="poster-head">
        <p>LOYALTY TRAINING POSTER</p>
        <h1>Invite Every Guest. Every Transaction.</h1>
      </div>

      <div className="poster-grid">
        <div className="poster-block">
          <h2>What To Say</h2>
          <p>
            "Are you a member of our loyalty program? You qualify for bonus points right now. Can I add that to your account?"
          </p>
        </div>
        <div className="poster-block">
          <h2>If They Say Yes</h2>
          <p>Enroll in POS, confirm details, and keep checkout moving.</p>
        </div>
        <div className="poster-block">
          <h2>If They Say No</h2>
          <p>"No problem. You can scan the QR code and join anytime." Move on.</p>
        </div>
        <div className="poster-block accent">
          <h2>Team Goal</h2>
          <p>100% invitation consistency. We coach behavior, not pressure.</p>
        </div>
      </div>

      <div className="poster-footer">
        <div>
          <QrCode size={28} />
          <span>Guest Sign-Up QR</span>
        </div>
        <div>
          <Users size={28} />
          <span>Daily Team Huddle: 3 min script practice</span>
        </div>
      </div>
    </section>
  );
}

function LeaderboardView() {
  const totals = useMemo(() => {
    const totalSignups = STORE_SIGNUPS.reduce((sum, row) => sum + row.total, 0);
    const todaySignups = STORE_SIGNUPS.reduce((sum, row) => sum + row.today, 0);
    return { totalSignups, todaySignups };
  }, []);

  return (
    <section className="printable leaderboard-print-only" data-print-title="Store Leaderboard">
      <div className="panel leaderboard-header">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h1>Loyalty Sign-Ups</h1>
          <p className="lede">Track total enrollments and store-by-store progress.</p>
        </div>
        <div className="stats-row">
          <div className="stat-box">
            <ClipboardList size={18} />
            <span>Total Sign-Ups</span>
            <strong>{totals.totalSignups}</strong>
          </div>
          <div className="stat-box">
            <Award size={18} />
            <span>Today</span>
            <strong>{totals.todaySignups}</strong>
          </div>
        </div>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Total Sign-Ups</th>
              <th>Today</th>
              <th>Goal</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {STORE_SIGNUPS.map((row) => {
              const percent = Math.min(100, Math.round((row.total / row.goal) * 100));
              return (
                <tr key={row.store}>
                  <td>
                    <span className="store-cell">
                      <Store size={14} /> {row.store}
                    </span>
                  </td>
                  <td>{row.total}</td>
                  <td>{row.today}</td>
                  <td>{row.goal}</td>
                  <td>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <small>{percent}%</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TeamToolkit() {
  const [tab, setTab] = useState<TeamTabId>('training');

  return (
    <main className="app-shell team-shell">
      <header className="top-bar printable">
        <div>
          <p className="eyebrow">Cascadia Loyalty Launch</p>
          <h1 className="top-title">Team Member Toolkit</h1>
        </div>
      </header>

      <nav className="tab-bar printable" aria-label="Content sections">
        <button className={tab === 'training' ? 'active' : ''} onClick={() => setTab('training')}>
          <Users size={16} /> Training
        </button>
        <button className={tab === 'poster' ? 'active' : ''} onClick={() => setTab('poster')}>
          <QrCode size={16} /> Poster
        </button>
        <button className={tab === 'leaderboard' ? 'active' : ''} onClick={() => setTab('leaderboard')}>
          <Award size={16} /> Leaderboard
        </button>
      </nav>

      <section className="actions printable">
        {tab === 'poster' && (
          <button className="print-btn" onClick={() => printSection('.poster-print-only')}>
            <Printer size={16} /> Print Poster
          </button>
        )}
        {tab === 'leaderboard' && (
          <button className="print-btn" onClick={() => printSection('.leaderboard-print-only')}>
            <Printer size={16} /> Print Leaderboard
          </button>
        )}
      </section>

      <section className="content-wrap">
        {tab === 'training' && <TrainingView />}
        {tab === 'poster' && <PosterView />}
        {tab === 'leaderboard' && <LeaderboardView />}
      </section>
    </main>
  );
}

function TrainerAccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!TRAINER_ACCESS_CODE) {
      setError('Trainer access is not configured.');
      return;
    }
    if (code === TRAINER_ACCESS_CODE) {
      onUnlock();
      return;
    }
    setError('Invalid access code.');
  };

  return (
    <div className="team-mode min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="panel w-full max-w-sm">
        <p className="eyebrow">Manager Access</p>
        <h1 className="top-title">Train-the-Trainer</h1>
        <p className="lede">Enter access code to continue.</p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-4 w-full rounded-lg border border-[var(--color-line)] px-3 py-2"
          placeholder="Access code"
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <button type="submit" className="print-btn mt-4">
          Open Trainer App
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname;
  const isTrainerRoute = pathname.startsWith('/trainer');
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isTrainerRoute) {
    return (
      <div className="team-mode">
        <TeamToolkit />
      </div>
    );
  }

  if (!isUnlocked) {
    return <TrainerAccessGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return <TrainerDeck />;
}
