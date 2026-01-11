import { products, Product, formatPrice } from './products';

export interface CartItem {
  productId: string;
  quantity: number;
  observation?: string;
}

export interface CheckoutData {
  name: string;
  deliveryMethod: 'pickup' | 'delivery' | '';
  neighborhood?: string;
  address?: string;
  reference?: string;
  paymentMethod: 'pix' | '';
  generalObservation?: string;
}

const CART_STORAGE_KEY = 'brawnie-cart';
const CHECKOUT_STORAGE_KEY = 'brawnie-checkout';

export const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const loadCheckout = (): CheckoutData => {
  try {
    const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : getEmptyCheckout();
  } catch {
    return getEmptyCheckout();
  }
};

export const saveCheckout = (data: CheckoutData): void => {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
};

export const getEmptyCheckout = (): CheckoutData => ({
  name: '',
  deliveryMethod: '',
  neighborhood: '',
  address: '',
  reference: '',
  paymentMethod: '',
  generalObservation: '',
});

export const clearStorage = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
};

export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const generateWhatsAppMessage = (cart: CartItem[], checkout: CheckoutData): string => {
  const itemsText = cart
    .filter(item => item.quantity > 0)
    .map(item => {
      const product = getProductById(item.productId);
      if (!product) return '';
      let line = `• ${product.name} — ${item.quantity} un`;
      if (item.observation) {
        line += ` (${item.observation})`;
      }
      return line;
    })
    .filter(Boolean)
    .join('\n');

  const total = getCartTotal(cart);
  
  let message = `Olá! Quero fazer um pedido no Brawnie do Rafa 🍫\n\n`;
  message += `👤 *Nome:* ${checkout.name}\n\n`;
  message += `🧾 *Pedido:*\n${itemsText}\n\n`;
  
  if (checkout.generalObservation) {
    message += `📝 *Observações gerais:* ${checkout.generalObservation}\n\n`;
  }
  
  message += `🚚 *Entrega:* ${checkout.deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}\n`;
  
  if (checkout.deliveryMethod === 'delivery') {
    let addressParts = [checkout.neighborhood, checkout.address].filter(Boolean);
    if (checkout.reference) {
      addressParts.push(`Ref: ${checkout.reference}`);
    }
    message += `📍 *Endereço:* ${addressParts.join(', ')}\n\n`;
  } else {
    message += '\n';
  }
  
  message += `💳 *Pagamento:* Pix\n`;
  message += `🔑 *Chave Pix (celular):* (79) 98823-8865\n`;
  message += `✅ *Vou enviar o comprovante aqui assim que pagar.*\n\n`;
  message += `💰 *Total:* ${formatPrice(total)}`;
  
  return message;
};

export const openWhatsApp = (cart: CartItem[], checkout: CheckoutData): void => {
  const message = generateWhatsAppMessage(cart, checkout);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/5579988238865?text=${encodedMessage}`;
  window.open(url, '_blank');
};

export const openWhatsAppGeneral = (): void => {
  const url = `https://wa.me/5579988238865`;
  window.open(url, '_blank');
};
