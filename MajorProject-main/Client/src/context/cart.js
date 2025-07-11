import { useState, useContext, useEffect, createContext } from "react";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCart = localStorage.getItem("cart");
    if (existingCart) setCart(JSON.parse(existingCart));
  }, []);
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

//custom hook

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
