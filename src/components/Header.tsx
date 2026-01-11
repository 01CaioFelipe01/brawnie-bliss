import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header = ({ 
  title = "Brawnie do Rafa", 
  subtitle = "Escolha seus sabores e finalize pelo WhatsApp 🍫",
  showBack = false,
  onBack
}: HeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4"
    >
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Voltar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-foreground"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
