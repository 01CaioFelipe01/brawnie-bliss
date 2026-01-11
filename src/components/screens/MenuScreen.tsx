import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import BottomBar from '@/components/BottomBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { products } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

interface MenuScreenProps {
  onNext: () => void;
}

const MenuScreen = ({ onNext }: MenuScreenProps) => {
  const { total, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background pb-36">
      <Header />
      
      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      <WhatsAppButton />
      
      <BottomBar
        total={total}
        itemCount={itemCount}
        buttonText="Ver carrinho"
        onClick={onNext}
        disabled={itemCount === 0}
      />
    </div>
  );
};

export default MenuScreen;
