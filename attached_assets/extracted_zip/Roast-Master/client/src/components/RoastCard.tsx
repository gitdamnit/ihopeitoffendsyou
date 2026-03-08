import { motion } from 'framer-motion';
import { type Roast } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface RoastCardProps {
  roast: Roast;
  index: number;
}

export function RoastCard({ roast, index }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="
        group relative bg-card p-6 border border-border
        hover:border-primary/50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]
        transition-all duration-300
      "
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors" />
      
      {roast.topic && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-mono font-bold text-primary border border-primary/20 bg-primary/5 rounded-sm uppercase tracking-wider">
            Re: {roast.topic}
          </span>
        </div>
      )}
      
      <p className="text-lg md:text-xl font-display leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors">
        "{roast.content}"
      </p>
      
      <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground font-mono">
        <span>ID: {roast.id.toString().padStart(4, '0')}</span>
        <span>{roast.createdAt ? formatDistanceToNow(new Date(roast.createdAt), { addSuffix: true }) : 'Just now'}</span>
      </div>
    </motion.div>
  );
}
