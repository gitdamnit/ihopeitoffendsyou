import { useState } from 'react';
import { useRoasts, useCreateRoast } from '@/hooks/use-roasts';
import { GlitchButton } from '@/components/GlitchButton';
import { RoastCard } from '@/components/RoastCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, AlertTriangle, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [topic, setTopic] = useState('');
  const { data: roasts, isLoading: roastsLoading } = useRoasts();
  const { mutate: createRoast, isPending, data: newRoast } = useCreateRoast();
  const { toast } = useToast();

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
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
        // Scroll to result slightly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Background Noise/Grid Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 max-w-5xl">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
            <Flame className="w-20 h-20 text-primary relative z-10 mx-auto mb-6 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-black font-display uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 drop-shadow-2xl">
              Talk Sh*t<br /><span className="text-primary text-shadow-glow">Get Hit</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-mono mb-12 max-w-2xl"
          >
            Your ego is writing checks your personality can't cash.
            Tell us what you're insecure about, and we'll confirm it.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xl space-y-8"
          >
            {/* LATEST ROAST DISPLAY */}
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
                    <AlertTriangle className="w-12 h-12 text-primary" />
                   </div>
                   <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">
                     Incoming Damage Report
                   </h3>
                   <p className="text-2xl md:text-4xl font-display font-bold text-primary-foreground bg-primary px-2 inline leading-relaxed decoration-clone box-decoration-clone">
                     {newRoast.content}
                   </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT FORM */}
            <form onSubmit={handleRoast} className="flex flex-col gap-4">
              <div className="relative group">
                <input
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
                type="submit" 
                isLoading={isPending}
                className="w-full"
              >
                {isPending ? "Generating Insult..." : "Destroy My Self-Esteem"}
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

        {/* HALL OF SHAME */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
        <div className="container mx-auto px-4 text-center font-mono text-sm text-muted-foreground/50">
          <p>BUILT FOR PAIN © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
