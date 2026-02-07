import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CartItem = {
  key: string; // productId + variant
  productId: string;
  name: string;
  imageUrl: string;
  variant: string; // e.g. 500g / 1kg
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: Omit<CartItem, "key">) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((input: Omit<CartItem, "key">) => {
    const key = `${input.productId}::${input.variant}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (!existing) return [...prev, { ...input, key }];
      return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + input.quantity } : i));
    });
  }, []);

  const inc = useCallback((key: string) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i)));
  }, []);

  const dec = useCallback((key: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
        .filter(Boolean),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value: CartContextValue = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      inc,
      dec,
      remove,
      clearCart,
      subtotal,
      count,
    }),
    [items, isOpen, openCart, closeCart, addItem, inc, dec, remove, clearCart, subtotal, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
