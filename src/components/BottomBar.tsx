import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/products';

interface BottomBarProps {
  total: number;
  itemCount: number;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}

const BottomBar = ({ total, itemCount, buttonText, onClick, disabled = false }: BottomBarProps) => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-premium pb-safe"
    >
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
            <p className="font-display font-bold text-xl text-foreground">
              {formatPrice(total)}
            </p>
          </div>
        </div>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-4 px-6 rounded-lg font-display font-semibold text-lg transition-all duration-200 ${
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-chocolate text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-premium'
          }`}
        >
          {buttonText}
        </button>
        {disabled && itemCount === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Selecione pelo menos 1 item
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BottomBar;
