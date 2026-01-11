import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CartItem, 
  CheckoutData, 
  loadCart, 
  saveCart, 
  loadCheckout, 
  saveCheckout,
  getEmptyCheckout,
  clearStorage,
  getCartTotal,
  getCartItemCount
} from '@/lib/cart';

interface CartContextType {
  cart: CartItem[];
  checkout: CheckoutData;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateObservation: (productId: string, observation: string) => void;
  updateCheckout: (data: Partial<CheckoutData>) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState<CheckoutData>(getEmptyCheckout());

  useEffect(() => {
    setCart(loadCart());
    setCheckout(loadCheckout());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveCheckout(checkout);
  }, [checkout]);

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
      setCart(prev => {
        const existing = prev.find(item => item.productId === productId);
        if (existing) {
          return prev.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
        }
        return [...prev, { productId, quantity }];
      });
    }
  };

  const updateObservation = (productId: string, observation: string) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, observation } : item
      )
    );
  };

  const updateCheckout = (data: Partial<CheckoutData>) => {
    setCheckout(prev => ({ ...prev, ...data }));
  };

  const clearCart = () => {
    setCart([]);
    setCheckout(getEmptyCheckout());
    clearStorage();
  };

  const total = getCartTotal(cart);
  const itemCount = getCartItemCount(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        checkout,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateObservation,
        updateCheckout,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
