import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import brownieImage from '@/assets/brownie.jpg';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { cart, addToCart, removeFromCart, updateObservation } = useCart();
  const [showObs, setShowObs] = useState(false);
  
  const cartItem = cart.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  const observation = cartItem?.observation || '';

  const handleAdd = () => {
    addToCart(product.id);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      removeFromCart(product.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-4 shadow-card border border-border"
    >
      <div className="flex items-start gap-4">
        {/* Brownie Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={brownieImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-base">
            {product.name}
          </h3>
          <p className="text-gold font-semibold text-sm mt-1">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {quantity > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleRemove}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors active:scale-95"
                aria-label="Remover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {quantity > 0 && (
              <motion.span
                key={quantity}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-8 text-center font-display font-bold text-lg text-foreground"
              >
                {quantity}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="w-10 h-10 rounded-full bg-gradient-chocolate flex items-center justify-center text-primary-foreground shadow-card hover:opacity-90 transition-opacity"
            aria-label="Adicionar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Observation Section */}
      <AnimatePresence>
        {quantity > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border">
              {!showObs && !observation ? (
                <button
                  onClick={() => setShowObs(true)}
                  className="text-sm text-gold hover:underline"
                >
                  + Adicionar observação
                </button>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Observação deste sabor
                  </label>
                  <input
                    type="text"
                    value={observation}
                    onChange={(e) => updateObservation(product.id, e.target.value)}
                    placeholder="Ex: caprichar no ninho"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted-foreground text-foreground"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
