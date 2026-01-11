import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';
import { toast } from 'sonner';

interface CheckoutScreenProps {
  onBack: () => void;
  onNext: () => void;
}

const PIX_KEY = '(79) 98823-8865';

const CheckoutScreen = ({ onBack, onNext }: CheckoutScreenProps) => {
  const { checkout, updateCheckout, total } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!checkout.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!checkout.deliveryMethod) {
      newErrors.deliveryMethod = 'Selecione a forma de entrega';
    }

    if (checkout.deliveryMethod === 'delivery') {
      if (!checkout.neighborhood?.trim()) {
        newErrors.neighborhood = 'Bairro é obrigatório para entrega';
      }
      if (!checkout.address?.trim()) {
        newErrors.address = 'Endereço é obrigatório para entrega';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      // Automatically set payment to Pix
      updateCheckout({ paymentMethod: 'pix' });
      onNext();
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText('79988238865');
    toast.success('Chave Pix copiada!');
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <Header 
        title="Dados do pedido" 
        subtitle="" 
        showBack 
        onBack={onBack} 
      />
      
      <main className="max-w-lg mx-auto px-4 py-6 pb-8 space-y-6">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-foreground mb-2">
            Seu nome *
          </label>
          <input
            type="text"
            value={checkout.name}
            onChange={(e) => updateCheckout({ name: e.target.value })}
            placeholder="Digite seu nome"
            className={`w-full px-4 py-3 rounded-lg bg-card border ${
              errors.name ? 'border-destructive' : 'border-border'
            } focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground placeholder:text-muted-foreground`}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name}</p>
          )}
        </motion.div>

        {/* Delivery Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-foreground mb-3">
            Forma de entrega *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateCheckout({ deliveryMethod: 'pickup' })}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                checkout.deliveryMethod === 'pickup' 
                  ? 'border-gold bg-gold/10' 
                  : 'border-border bg-card hover:border-gold/50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                checkout.deliveryMethod === 'pickup' ? 'border-gold' : 'border-muted-foreground'
              }`}>
                {checkout.deliveryMethod === 'pickup' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-gold"
                  />
                )}
              </div>
              <span className="font-medium text-foreground">🏪 Retirada</span>
            </button>
            
            <button
              type="button"
              onClick={() => updateCheckout({ deliveryMethod: 'delivery' })}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                checkout.deliveryMethod === 'delivery' 
                  ? 'border-gold bg-gold/10' 
                  : 'border-border bg-card hover:border-gold/50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                checkout.deliveryMethod === 'delivery' ? 'border-gold' : 'border-muted-foreground'
              }`}>
                {checkout.deliveryMethod === 'delivery' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-gold"
                  />
                )}
              </div>
              <span className="font-medium text-foreground">🚚 Entrega</span>
            </button>
          </div>
          {errors.deliveryMethod && (
            <p className="text-destructive text-sm mt-1">{errors.deliveryMethod}</p>
          )}
        </motion.div>

        {/* Address Fields (only if delivery) */}
        <AnimatePresence>
          {checkout.deliveryMethod === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={checkout.neighborhood || ''}
                  onChange={(e) => updateCheckout({ neighborhood: e.target.value })}
                  placeholder="Digite o bairro"
                  className={`w-full px-4 py-3 rounded-lg bg-card border ${
                    errors.neighborhood ? 'border-destructive' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground placeholder:text-muted-foreground`}
                />
                {errors.neighborhood && (
                  <p className="text-destructive text-sm mt-1">{errors.neighborhood}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rua e número *
                </label>
                <input
                  type="text"
                  value={checkout.address || ''}
                  onChange={(e) => updateCheckout({ address: e.target.value })}
                  placeholder="Ex: Rua das Flores, 123"
                  className={`w-full px-4 py-3 rounded-lg bg-card border ${
                    errors.address ? 'border-destructive' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground placeholder:text-muted-foreground`}
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Referência (opcional)
                </label>
                <input
                  type="text"
                  value={checkout.reference || ''}
                  onChange={(e) => updateCheckout({ reference: e.target.value })}
                  placeholder="Ex: Próximo à padaria"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Method - PIX only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-foreground mb-3">
            Forma de pagamento
          </label>
          <div className="bg-card rounded-xl p-4 border-2 border-gold">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Pix (único)</p>
                <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
              </div>
            </div>
            
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Chave Pix (celular)</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono font-semibold text-foreground">{PIX_KEY}</p>
                <button
                  onClick={copyPixKey}
                  className="px-3 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-md hover:bg-gold/30 transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total do pedido</span>
            <span className="font-display font-bold text-xl text-foreground">
              {formatPrice(total)}
            </span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-lg bg-gradient-chocolate text-primary-foreground font-display font-semibold text-lg shadow-premium hover:opacity-90 transition-opacity"
        >
          Revisar pedido
        </motion.button>
      </main>
    </div>
  );
};

export default CheckoutScreen;
