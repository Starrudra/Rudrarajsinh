import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Card,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { FaMoneyBillWave, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMenu from "../../components/layout/AdminMenu";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AdminOrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/v1/products/getallorder");
        const data = await response.json();
        setOrders(data.orders);

        // Filter out cancelled orders
        const filteredOrders = data.orders.filter(
          (order) => order.status !== "Cancelled"
        );

        const revenue = filteredOrders.reduce(
          (acc, order) => (order.payment ? acc + order.price : acc),
          0
        );
        const ordersCount = filteredOrders.length;

        setTotalRevenue(revenue);
        setTotalOrders(ordersCount);

        const monthlyRev = new Array(12).fill(0);
        const monthlyOrdersCount = new Array(12).fill(0);

        filteredOrders.forEach((order) => {
          const month = new Date(order.createdAt).getMonth();
          if (order.payment) {
            monthlyRev[month] += order.price;
          }
          monthlyOrdersCount[month] += 1;
        });

        setMonthlyRevenue(monthlyRev);
        setMonthlyOrders(monthlyOrdersCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [selectedOrder]);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setSelectedStatus("");
  };

  const handleStatusChange = async (e) => {
    await setSelectedStatus(e.target.value);
  };

  const handleSaveChanges = async () => {
    const response = await axios.put(
      `/api/v1/products/${selectedOrder?._id}/update-status`,
      { status: selectedStatus }
    );
    if (response?.data.success) {
      toast.success("Status Updated Successfully");
    } else {
      toast.error("Something went wrong");
    }
    handleCloseModal();
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate average order value
  const averageOrderValue = totalOrders
    ? (totalRevenue / totalOrders).toFixed(2)
    : 0;

  const pieDataRevenue = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const barDataRevenue = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const pieDataOrders = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Orders Placed",
        data: monthlyOrders,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const barDataOrders = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Orders Placed",
        data: monthlyOrders,
        backgroundColor: "#007bff",
      },
    ],
  };

  return (
    <Layout>
      <div className="container-fluid mt-3 pt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="row mb-4">
              <div className="col-md-6">
                <Card
                  className="shadow-sm p-3 mb-5"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRevenueModal(true)}
                >
                  <Card.Body className="d-flex align-items-center">
                    <FaMoneyBillWave
                      style={{
                        fontSize: "2rem",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <Card.Title>Total Revenue</Card.Title>
                      <Card.Text className="h4">₹{totalRevenue}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6">
                <Card
                  className="shadow-sm p-3 mb-5"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowOrdersModal(true)}
                >
                  <Card.Body className="d-flex align-items-center">
                    <FaBoxOpen
                      style={{
                        fontSize: "2rem",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <Card.Title>Total Orders</Card.Title>
                      <Card.Text className="h4">{totalOrders}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Price</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.status}</td>
                    <td>{order.payment ? "Paid" : "Unpaid"}</td>
                    <td>{order.price}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleUpdateStatus(order)}
                        className="btn-sm"
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="mx-3">Page {currentPage}</span>

              <Button
                variant="outline-secondary"
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(orders.length / ordersPerPage)
                }
              >
                Next
              </Button>
            </Pagination>

            {/* Modal for updating order status */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Update Order Status {selectedOrder?._id}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="statusSelect">
                  <Form.Label>Select Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="">Select</option>
                    <option value="Not-Processed">Not Processed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant="outline-secondary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for Monthly Revenue */}
            <Modal
              show={showRevenueModal}
              onHide={() => setShowRevenueModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Monthly Revenue</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ButtonGroup>
                  <ToggleButton
                    id="pie-chart"
                    type="radio"
                    name="chartType"
                    value="pie"
                    checked={chartType === "pie"}
                    onChange={() => setChartType("pie")}
                  >
                    Pie Chart
                  </ToggleButton>
                  <ToggleButton
                    id="bar-chart"
                    type="radio"
                    name="chartType"
                    value="bar"
                    checked={chartType === "bar"}
                    onChange={() => setChartType("bar")}
                  >
                    Bar Chart
                  </ToggleButton>
                </ButtonGroup>
                {chartType === "pie" ? (
                  <Pie data={pieDataRevenue} />
                ) : (
                  <Bar data={barDataRevenue} />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowRevenueModal(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for Monthly Orders Placed */}
            <Modal
              show={showOrdersModal}
              onHide={() => setShowOrdersModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Monthly Orders Placed</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ButtonGroup>
                  <ToggleButton
                    id="pie-chart-orders"
                    type="radio"
                    name="chartTypeOrders"
                    value="pie"
                    checked={chartType === "pie"}
                    onChange={() => setChartType("pie")}
                  >
                    Pie Chart
                  </ToggleButton>
                  <ToggleButton
                    id="bar-chart-orders"
                    type="radio"
                    name="chartTypeOrders"
                    value="bar"
                    checked={chartType === "bar"}
                    onChange={() => setChartType("bar")}
                  >
                    Bar Chart
                  </ToggleButton>
                </ButtonGroup>
                {chartType === "pie" ? (
                  <Pie data={pieDataOrders} />
                ) : (
                  <>
                    <div>
                      <h5>Average Order Value</h5>
                      <p className="h4">₹{averageOrderValue}</p>
                    </div>
                    <Bar data={barDataOrders} />
                  </>
                )}
                {/* Display Average Order Value */}
                <div className="mt-4 d-flex align-items-center"></div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowOrdersModal(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrderPanel;
