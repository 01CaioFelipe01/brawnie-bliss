import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import BottomBar from '@/components/BottomBar';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';
import { getProductById } from '@/lib/cart';

interface CartScreenProps {
  onBack: () => void;
  onNext: () => void;
}

const CartScreen = ({ onBack, onNext }: CartScreenProps) => {
  const { cart, checkout, updateCheckout, updateQuantity, updateObservation, total, itemCount } = useCart();

  const cartItems = cart.filter(item => item.quantity > 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Carrinho" 
          subtitle="" 
          showBack 
          onBack={onBack} 
        />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-display font-semibold text-xl text-foreground mb-2">
            Carrinho vazio
          </h2>
          <p className="text-muted-foreground text-center">
            Volte ao cardápio e adicione seus brownies favoritos!
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-gradient-chocolate text-primary-foreground font-semibold rounded-lg"
          >
            Ver cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      <Header 
        title="Carrinho" 
        subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
        showBack 
        onBack={onBack} 
      />
      
      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                      {product.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm">
                        {product.name}
                      </h3>
                      <p className="text-gold font-semibold text-sm">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                      
                      <span className="w-6 text-center font-display font-bold text-foreground">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 rounded-full bg-gradient-chocolate flex items-center justify-center text-primary-foreground"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                          <path d="M12 5v14"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {item.observation && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        📝 {item.observation}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* General Observation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-4 shadow-card border border-border"
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Observações gerais do pedido
            </label>
            <textarea
              value={checkout.generalObservation || ''}
              onChange={(e) => updateCheckout({ generalObservation: e.target.value })}
              placeholder="Alguma observação sobre o pedido?"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted-foreground text-foreground resize-none"
            />
          </motion.div>
        </motion.div>
      </main>
      
      <BottomBar
        total={total}
        itemCount={itemCount}
        buttonText="Continuar"
        onClick={onNext}
      />
    </div>
  );
};

export default CartScreen;
