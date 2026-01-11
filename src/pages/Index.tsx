import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from '@/contexts/CartContext';
import MenuScreen from '@/components/screens/MenuScreen';
import CartScreen from '@/components/screens/CartScreen';
import CheckoutScreen from '@/components/screens/CheckoutScreen';
import ReviewScreen from '@/components/screens/ReviewScreen';

type Screen = 'menu' | 'cart' | 'checkout' | 'review';

const IndexContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && (
          <motion.div
            key="menu"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <MenuScreen onNext={() => setCurrentScreen('cart')} />
          </motion.div>
        )}

        {currentScreen === 'cart' && (
          <motion.div
            key="cart"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CartScreen 
              onBack={() => setCurrentScreen('menu')} 
              onNext={() => setCurrentScreen('checkout')} 
            />
          </motion.div>
        )}

        {currentScreen === 'checkout' && (
          <motion.div
            key="checkout"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CheckoutScreen 
              onBack={() => setCurrentScreen('cart')} 
              onNext={() => setCurrentScreen('review')} 
            />
          </motion.div>
        )}

        {currentScreen === 'review' && (
          <motion.div
            key="review"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <ReviewScreen onBack={() => setCurrentScreen('checkout')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  return (
    <CartProvider>
      <IndexContent />
    </CartProvider>
  );
};

export default Index;
