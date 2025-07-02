import React from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length >= 1
                ? `You Have ${cart?.length} item(s) in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your Cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">Cart Items</div>
          <div className="col-md-3">Payment | Checkout</div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
