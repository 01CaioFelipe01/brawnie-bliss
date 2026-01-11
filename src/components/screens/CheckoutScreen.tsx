import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';

interface CheckoutScreenProps {
  onBack: () => void;
  onNext: () => void;
}

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

    if (!checkout.paymentMethod) {
      newErrors.paymentMethod = 'Selecione a forma de pagamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  const RadioOption = ({ 
    name, 
    value, 
    label, 
    checked, 
    onChange 
  }: { 
    name: string; 
    value: string; 
    label: string; 
    checked: boolean; 
    onChange: () => void;
  }) => (
    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
      checked 
        ? 'border-gold bg-gold/10' 
        : 'border-border bg-card hover:border-gold/50'
    }`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        checked ? 'border-gold' : 'border-muted-foreground'
      }`}>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-gold"
          />
        )}
      </div>
      <span className="font-medium text-foreground">{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Dados do pedido" 
        subtitle="" 
        showBack 
        onBack={onBack} 
      />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
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
            <RadioOption
              name="delivery"
              value="pickup"
              label="🏪 Retirada"
              checked={checkout.deliveryMethod === 'pickup'}
              onChange={() => updateCheckout({ deliveryMethod: 'pickup' })}
            />
            <RadioOption
              name="delivery"
              value="delivery"
              label="🚚 Entrega"
              checked={checkout.deliveryMethod === 'delivery'}
              onChange={() => updateCheckout({ deliveryMethod: 'delivery' })}
            />
          </div>
          {errors.deliveryMethod && (
            <p className="text-destructive text-sm mt-1">{errors.deliveryMethod}</p>
          )}
        </motion.div>

        {/* Address Fields (only if delivery) */}
        {checkout.deliveryMethod === 'delivery' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
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

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-foreground mb-3">
            Forma de pagamento *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <RadioOption
              name="payment"
              value="pix"
              label="💳 Pix"
              checked={checkout.paymentMethod === 'pix'}
              onChange={() => updateCheckout({ paymentMethod: 'pix' })}
            />
            <RadioOption
              name="payment"
              value="cash"
              label="💵 Dinheiro"
              checked={checkout.paymentMethod === 'cash'}
              onChange={() => updateCheckout({ paymentMethod: 'cash' })}
            />
            <RadioOption
              name="payment"
              value="card"
              label="💳 Cartão"
              checked={checkout.paymentMethod === 'card'}
              onChange={() => updateCheckout({ paymentMethod: 'card' })}
            />
          </div>
          {errors.paymentMethod && (
            <p className="text-destructive text-sm mt-1">{errors.paymentMethod}</p>
          )}
        </motion.div>

        {/* Change for (only if cash) */}
        {checkout.paymentMethod === 'cash' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Troco para quanto? (opcional)
            </label>
            <input
              type="text"
              value={checkout.changeFor || ''}
              onChange={(e) => updateCheckout({ changeFor: e.target.value })}
              placeholder="Ex: R$ 50,00"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground placeholder:text-muted-foreground"
            />
          </motion.div>
        )}

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
