import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import OrderItem from "./OrderItem";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("auth");
        const t = JSON.parse(token);
        console.log(t.token);

        const { data } = await axios.get("/api/v1/products/getallorderuser", {
          headers: {
            authtoken: t.token, // Authorization header with the token
            "Content-Type": "application/json", // Content-Type header
            // Add other custom headers if needed
          },
        });
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Layout>
      <Container className="mt-5">
        <h1>Your Orders</h1>

        <Row>
          {orders.map((order) => (
            <Col key={order._id} md={4} className="mb-4">
              <OrderItem order={order} />
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default Orders;
