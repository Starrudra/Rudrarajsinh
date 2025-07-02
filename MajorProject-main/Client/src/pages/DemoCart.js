import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import "./CSS/DemoCart.css";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-toastify";

const DemoCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [length, setLength] = useState();

  // Fetch client token for payment
  const getToken = async () => {
    try {
      const response = await axios.get("/api/v1/products/braintree-token");
      setClientToken(response?.data?.response?.clientToken);
    } catch (error) {
      console.error("Error fetching client token:", error);
    }
  };

  // Fetch cart from the database
  const fetchCart = async () => {
    const token = localStorage.getItem("auth");
    const t = JSON.parse(token);
    try {
      const { data } = await axios.get("/api/v1/cart/fetchCart", {
        headers: {
          authtoken: t.token,
        },
      });

      if (data.success) {
        // Set the quantity to 1 for all cart items initially
        const itemsWithQuantity = data.products.map((item) => ({
          ...item,
          quantity: 1, // Initialize quantity to 1
        }));
        setCartItems(itemsWithQuantity);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    getToken();
    if (auth?.token) {
      fetchCart(); // Fetch cart from the database
    }
  }, [auth?.token]);

  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Handle remove item from cart
  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem("auth");
      const t = JSON.parse(token);
      toast.success("Item Deleted Successfully");
      // Call the API to remove the product from the cart
      await axios.delete(`/api/v1/cart/remove/${id}`, {
        headers: {
          authtoken: t.token,
          "Content-Type": "application/json",
        },
      });

      // Update the local state after the product is successfully removed from the cart
      const updatedCart = cartItems.filter((item) => item._id !== id);
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Handle payment
  const handlePayment = async () => {
    if (!instance) return;

    try {
      const token = localStorage.getItem("auth");
      const t = JSON.parse(token);
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const total = getTotalPrice();
      console.log(total);

      const response = await axios.post(
        "/api/v1/products/braintree-payment",
        {
          nonce,
          cart: cartItems,
          total,
        },
        {
          headers: {
            authtoken: t.token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment response:", response.data);
      // setCart(null);
      setLoading(false);

      await axios.post(
        "/api/v1/cart/clear", // Make sure this endpoint matches your route
        {},
        {
          headers: {
            authtoken: t.token,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/dashboard/user/orders");
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  if (!auth?.token) {
    navigate("/login");
    return "Redirecting to login...";
  }

  const getLength = async () => {
    const token = localStorage.getItem("auth");
    const t = JSON.parse(token);

    const { data } = await axios.get("/api/v1/cart/getItems", {
      headers: {
        authtoken: t.token,
      },
    });

    setLength(data.length);
  };
  return (
    <Layout>
      <h1>{length}H</h1>
      <div className="container">
        <h1 className="my-4">Shopping Cart</h1>

        <Row>
          <Col md={9}>
            <Row>
              {cartItems.map((item) => (
                <Col md={4} key={item._id}>
                  <Card className="mb-4 cart-card">
                    <Card.Img variant="top" src={item.photo} />

                    <Card.Body>
                      <Card.Title className="cardTitle">{item.name}</Card.Title>
                      <Card.Text className="cardTitle">
                        Price: &#8377; {item.price}
                        <br />
                        Subtotal: &#8377; {item.price * item.quantity}
                      </Card.Text>

                      <div className="quantity-buttons">
                        <Button
                          variant="outline-danger"
                          className="m-2 btn-sm text-center"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={3}>
            <div className="border p-3">
              <h3>Order Summary</h3>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: &#8377; {getTotalPrice()}</p>
              <Button
                variant="outline-success"
                className="mt-3"
                block
                onClick={() => setShowModal(true)}
                disabled={!clientToken || loading}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Complete Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {clientToken && (
              <DropIn
                options={{ authorization: clientToken }}
                onInstance={(instance) => setInstance(instance)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handlePayment}
              disabled={loading || !instance}
            >
              {loading ? "Processing..." : `Pay Now (₹${getTotalPrice()})`}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default DemoCart;
