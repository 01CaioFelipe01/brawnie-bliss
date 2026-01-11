import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';
import { getProductById } from '@/lib/cart';
import { openWhatsApp } from '@/lib/cart';

interface ReviewScreenProps {
  onBack: () => void;
}

const ReviewScreen = ({ onBack }: ReviewScreenProps) => {
  const { cart, checkout, total } = useCart();
  const [isOpening, setIsOpening] = useState(false);

  const cartItems = cart.filter(item => item.quantity > 0);

  const handleFinalize = () => {
    setIsOpening(true);
    setTimeout(() => {
      openWhatsApp(cart, checkout);
      setIsOpening(false);
    }, 1500);
  };

  const paymentLabels = { pix: 'Pix', cash: 'Dinheiro', card: 'Cartão' };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Revisar pedido" 
        subtitle="" 
        showBack 
        onBack={onBack} 
      />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            🧾 Itens do pedido
          </h3>
          <div className="space-y-3">
            {cartItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <div key={item.productId} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product.icon}</span>
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                      {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                    </p>
                    {item.observation && (
                      <p className="text-sm text-gold ml-7 mt-1">
                        📝 {item.observation}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    {formatPrice(product.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* General Observation */}
        {checkout.generalObservation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 border border-border shadow-card"
          >
            <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
              📝 Observações gerais
            </h3>
            <p className="text-muted-foreground">{checkout.generalObservation}</p>
          </motion.div>
        )}

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            🚚 Entrega
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método</span>
              <span className="font-medium text-foreground">
                {checkout.deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}
              </span>
            </div>
            {checkout.deliveryMethod === 'delivery' && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bairro</span>
                  <span className="font-medium text-foreground">{checkout.neighborhood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereço</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">
                    {checkout.address}
                  </span>
                </div>
                {checkout.reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Referência</span>
                    <span className="font-medium text-foreground text-right max-w-[60%]">
                      {checkout.reference}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            💳 Pagamento
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forma</span>
              <span className="font-medium text-foreground">
                {paymentLabels[checkout.paymentMethod as keyof typeof paymentLabels]}
              </span>
            </div>
            {checkout.paymentMethod === 'cash' && checkout.changeFor && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Troco para</span>
                <span className="font-medium text-foreground">{checkout.changeFor}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-chocolate rounded-xl p-4 shadow-premium"
        >
          <div className="flex justify-between items-center">
            <span className="text-primary-foreground font-medium">Total</span>
            <span className="font-display font-bold text-2xl text-primary-foreground">
              {formatPrice(total)}
            </span>
          </div>
        </motion.div>

        {/* Customer Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-4 border border-border shadow-card"
        >
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Cliente</span>
            <span className="font-medium text-foreground">{checkout.name}</span>
          </div>
        </motion.div>

        {/* Finalize Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalize}
          disabled={isOpening}
          className="w-full py-4 px-6 rounded-lg bg-[#25D366] text-white font-display font-semibold text-lg shadow-premium hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {isOpening ? 'Abrindo WhatsApp...' : 'Finalizar no WhatsApp'}
        </motion.button>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-xl p-6 shadow-premium flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center animate-pulse">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="white"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <p className="font-display font-semibold text-foreground">
                Abrindo WhatsApp...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewScreen;
