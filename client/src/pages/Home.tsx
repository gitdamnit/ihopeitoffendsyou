import { useState, useEffect, useRef, useCallback } from 'react';
import { useRoasts, useCreateRoast } from '@/hooks/use-roasts';
import { GlitchButton } from '@/components/GlitchButton';
import { RoastCard } from '@/components/RoastCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowDown, Skull, ShieldAlert, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const [canAccept, setCanAccept] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setCanAccept(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center items-center bg-black/95 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ maxHeight: '100dvh' }}
        className="relative max-w-xl w-full border-2 border-t-2 border-red-600 bg-zinc-950 flex flex-col sm:rounded-none rounded-t-xl"
      >
        <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        <div className="overflow-y-auto flex-1 p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <ShieldAlert className="w-7 h-7 text-red-500 shrink-0" />
            <h2 className="text-xl font-black font-mono uppercase tracking-widest text-red-500">
              WARNING
            </h2>
          </div>

          <div className="space-y-3 text-sm font-mono text-zinc-300 leading-relaxed">
            <p className="text-base text-zinc-100 font-bold">
              This application contains extremely offensive, vulgar, and hateful content.
            </p>
            <p>
              By proceeding, you acknowledge that you will be exposed to:
            </p>
            <ul className="list-none space-y-1.5 pl-2 border-l-2 border-red-900">
              <li className="flex gap-2"><span className="text-red-500">▸</span> Heavy profanity and obscene language</li>
              <li className="flex gap-2"><span className="text-red-500">▸</span> Deeply personal and targeted insults</li>
              <li className="flex gap-2"><span className="text-red-500">▸</span> Content designed to be genuinely hurtful</li>
              <li className="flex gap-2"><span className="text-red-500">▸</span> Material that may cause emotional distress</li>
            </ul>
            <p className="text-zinc-400">
              This is satire for people with thick skin. If you are sensitive to harsh language, hate speech, or personal attacks — <span className="text-red-400 font-bold">leave now.</span>
            </p>
            <p className="text-red-400 font-bold text-xs border border-red-900 bg-red-950/30 p-3">
              ⚠ SPIRITUAL WARNING: This application actively and deliberately denies the Holy Ghost. Failure to heed this warning and proceeding beyond this point may result in your eternal damnation. Your soul has been advised.
            </p>
            <p className="text-zinc-500 text-xs">
              You must be 18+ to enter. By clicking below you confirm you are an adult who consents to viewing extremely offensive content for entertainment purposes only, and that you accept full responsibility for any and all consequences — spiritual or otherwise.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5 sm:p-8 pt-0 shrink-0 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            data-testid="button-accept-disclaimer"
            onClick={onAccept}
            disabled={!canAccept}
            className={`w-full py-4 font-black font-mono uppercase tracking-widest text-sm transition-all duration-300 ${
              canAccept
                ? 'bg-red-600 text-white cursor-pointer border-2 border-red-500'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-2 border-zinc-700'
            }`}
          >
            {canAccept
              ? 'I UNDERSTAND. DESTROY ME.'
              : `I UNDERSTAND. DESTROY ME. (${countdown})`}
          </button>
          <a
            href="https://google.com"
            className="w-full py-3 text-center font-mono text-xs text-zinc-600 border border-zinc-800 hover:text-zinc-400 transition-colors uppercase tracking-widest"
          >
            Get me out of here
          </a>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      </motion.div>
    </div>
  );
}

const IDLE_SECONDS = 20;

const IDLE_TOPICS = [
  "being too scared to even type anything, you cowardly little shit",
  "sitting there doing absolutely nothing like the useless waste of space you are",
  "staring at a screen and contributing nothing to society, as usual",
  "being so boring that even an AI has been watching you do nothing for a full minute",
  "your complete inability to commit to literally anything — you can't even type a topic",
];

export default function Home() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return sessionStorage.getItem('disclaimer-accepted') === 'true';
  });
  const [topic, setTopic] = useState('');
  const [idleCountdown, setIdleCountdown] = useState(IDLE_SECONDS);
  const [idleWarning, setIdleWarning] = useState(false);
  const { data: roasts, isLoading: roastsLoading } = useRoasts();
  const { mutate: createRoast, isPending, data: newRoast } = useCreateRoast();
  const { toast } = useToast();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fireIdleRoast = useCallback(() => {
    setIdleWarning(false);
    const randomTopic = IDLE_TOPICS[Math.floor(Math.random() * IDLE_TOPICS.length)];
    createRoast({ topic: randomTopic }, {
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }, [createRoast]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setIdleWarning(false);
    setIdleCountdown(IDLE_SECONDS);

    const warningAt = IDLE_SECONDS - 10;
    idleTimerRef.current = setTimeout(() => {
      setIdleWarning(true);
      setIdleCountdown(10);
      countdownRef.current = setInterval(() => {
        setIdleCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownRef.current!);
            fireIdleRoast();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, warningAt * 1000);
  }, [fireIdleRoast]);

  useEffect(() => {
    if (!disclaimerAccepted) return;
    resetIdleTimer();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handler = () => {
      if (!isPending) resetIdleTimer();
    };
    events.forEach((e) => window.addEventListener(e, handler));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [disclaimerAccepted, resetIdleTimer, isPending]);

  const handleAccept = () => {
    sessionStorage.setItem('disclaimer-accepted', 'true');
    setDisclaimerAccepted(true);
  };

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    resetIdleTimer();
    createRoast({ topic: topic || undefined }, {
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
      onSuccess: () => {
        setTopic('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <>
      <AnimatePresence>
        {!disclaimerAccepted && (
          <DisclaimerModal onAccept={handleAccept} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {idleWarning && (
          <motion.div
            data-testid="banner-idle-warning"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-700 border-b-2 border-red-500 px-4 py-3 flex items-center justify-center gap-3 text-white font-mono text-sm"
          >
            <Eye className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              We see you doing absolutely nothing, you lazy piece of shit. Getting roasted automatically in{' '}
              <span className="font-black text-yellow-300 text-base">{idleCountdown}</span>s...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 max-w-5xl">

          <section className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 relative"
            >
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
              <p className="text-6xl md:text-8xl font-black font-display uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 drop-shadow-2xl relative z-10 mb-4">
                I Hope It Offends You
              </p>
              <Flame className="w-20 h-20 text-primary relative z-10 mx-auto mb-6 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-black font-display uppercase leading-tight tracking-tighter drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">Lowering Your</span><br />
                <span className="text-primary text-shadow-glow">Self-Esteem</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">With Every Click</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground font-mono mb-12 max-w-2xl"
            >
              Your ego is writing checks your personality can't cash. Tell us what you're insecure about, and we'll confirm every goddamn fear you've ever had.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-xl space-y-8"
            >
              <AnimatePresence mode="wait">
                {newRoast && (
                  <motion.div
                    key={newRoast.id}
                    initial={{ opacity: 0, scale: 0.9, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    className="bg-primary/10 border-2 border-primary p-8 md:p-12 mb-12 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                      <Skull className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">
                      Damage Report: Lethal
                    </h3>
                    <p className="text-2xl md:text-4xl font-display font-bold text-primary-foreground bg-primary px-2 inline leading-relaxed decoration-clone box-decoration-clone">
                      {newRoast.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleRoast} className="flex flex-col gap-4">
                <div className="relative group">
                  <input
                    data-testid="input-roast-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What hurts you? (e.g., my coding skills, my hairline)"
                    className="w-full bg-background/50 border-2 border-border p-6 text-lg font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                    disabled={isPending}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all duration-500" />
                </div>

                <GlitchButton
                  data-testid="button-submit-roast"
                  type="submit"
                  isLoading={isPending}
                  className="w-full"
                >
                  {isPending ? "Sharpening the blade..." : "Destroy My Self-Esteem"}
                </GlitchButton>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 animate-bounce hidden md:block"
            >
              <ArrowDown className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          </section>

          <section className="space-y-12 border-t border-border pt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                  Hall of Shame
                </h2>
                <p className="font-mono text-muted-foreground">
                  Witness the carnage of those who came before you.
                </p>
              </div>
              <div className="h-px bg-border flex-grow mx-8 hidden md:block" />
              <div className="font-mono text-xs text-primary border border-primary/30 px-3 py-1 bg-primary/5 uppercase">
                Live Feed
              </div>
            </div>

            {roastsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-card/50 animate-pulse border border-border/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roasts?.map((roast, i) => (
                  <RoastCard key={roast.id} roast={roast} index={i} />
                ))}
                {(!roasts || roasts.length === 0) && (
                  <div className="col-span-full py-20 text-center border border-dashed border-border text-muted-foreground font-mono">
                    No victims yet. Be the first to suffer.
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-border py-8 mt-24 bg-black">
          <div className="container mx-auto px-4 font-mono text-sm text-muted-foreground/50 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>BUILT FOR PAIN © {new Date().getFullYear()} — You have been warned.</p>
            <p className="uppercase tracking-widest text-right">Dedicated to Angie — the meanest fucking bitch ever</p>
          </div>
        </footer>
      </div>
    </>
  );
}
