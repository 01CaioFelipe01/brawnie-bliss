export interface Product {
  id: string;
  name: string;
  price: number;
  icon: string;
}

// Preço padrão - pode ser alterado facilmente
export const UNIT_PRICE = 12.00;

// Produtos com preços individuais (estruturado para fácil edição)
export const products: Product[] = [
  { id: "ninho-chocolate", name: "Ninho com Chocolate", price: UNIT_PRICE, icon: "🍫" },
  { id: "doce-leite", name: "Doce de Leite", price: UNIT_PRICE, icon: "🥛" },
  { id: "chocolate-50", name: "Chocolate 50%", price: UNIT_PRICE, icon: "🍫" },
  { id: "ninho-doce-leite", name: "Ninho com Doce de Leite", price: UNIT_PRICE, icon: "✨" },
  { id: "beijinho", name: "Beijinho", price: UNIT_PRICE, icon: "🥥" },
  { id: "pacoca", name: "Paçoca", price: UNIT_PRICE, icon: "🥜" },
];

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
