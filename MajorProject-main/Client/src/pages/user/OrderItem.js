import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCode } from "react-qr-code"; // Import QRCode component
import QRious from "qrious"; // Import QRious
import axios from "axios";

import "../CSS/orderUser.css";

const OrderItem = ({ order }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const invoiceRef = useRef(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const handleShowDetailsModal = () => setShowDetailsModal(true);
  const handleCloseDetailsModal = () => setShowDetailsModal(false);
  const handleShowInvoiceModal = () => setShowInvoiceModal(true);
  const handleCloseInvoiceModal = () => setShowInvoiceModal(false);

  useEffect(() => {
    // Fetch company logo and name
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.get("/api/v1/hpsettings/get-logo");
        if (response.data.success) {
          setCompanyLogo(response.data.logo.link);
          setCompanyName(response.data.logo.name);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanyLogo();
  }, []);

  const calculateGrandTotal = () => {
    return (
      order?.products?.reduce((total, product) => total + product.price, 0) || 0
    );
  };

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin; // Vertical position

    // Add Company Logo
    if (companyLogo) {
      try {
        const logoResponse = await axios.get(companyLogo, {
          responseType: "arraybuffer",
        });
        const logoBlob = new Blob([logoResponse.data], { type: "image/png" });
        const logoUrl = URL.createObjectURL(logoBlob);
        pdf.addImage(logoUrl, "PNG", margin, yPosition, 40, 20); // Adjust size as needed
        yPosition += 30; // Adjust position after adding the logo
      } catch (error) {
        console.log("Error fetching the logo:", error);
      }
    }
    // Add Company Name

    // Add Title
    pdf.setFontSize(20);
    pdf.text("Invoice", pdfWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Add Order ID
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order?._id || "Loading..."}`, margin, yPosition);
    yPosition += 10;

    // Add Order Status, Payment, and Date
    pdf.text(`Status: ${order?.status || "Loading..."}`, margin, yPosition);
    yPosition += 7;
    pdf.text(
      `Payment: ${order?.payment ? "Completed" : "Pending"}`,
      margin,
      yPosition
    );
    yPosition += 7;
    pdf.text(
      `Created At: ${
        order?.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : "Loading..."
      }`,
      margin,
      yPosition
    );
    yPosition += 10;

    // Add QR Code for Order ID
    const qr = new QRious({
      value: order?._id || "Loading...",
      size: 100, // Set size of the QR code
    });

    const qrImage = qr.toDataURL(); // Generate QR code as a data URL

    pdf.addImage(qrImage, "PNG", margin, yPosition, 40, 40); // Add QR image
    yPosition += 50; // Move position down

    // Add Product Summary Table Header
    pdf.text("Product Summary", margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.text("Product Name", margin, yPosition);
    pdf.text("Price", pdfWidth - margin - 20, yPosition, { align: "right" });
    yPosition += 7;

    // Add Products
    order?.products?.forEach((product) => {
      if (yPosition > pdfHeight - 40) {
        pdf.addPage();
        yPosition = margin; // Reset position for new page
      }
      pdf.text(product.name, margin, yPosition);
      pdf.text(`Rs. ${product.price}`, pdfWidth - margin - 20, yPosition, {
        align: "right",
      });
      yPosition += 7;
    });

    // Add Grand Total
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(`Total: Rs. ${calculateGrandTotal()}`, margin, yPosition);
    yPosition += 10;

    // Add Terms and Conditions
    pdf.setFontSize(10);
    pdf.text("Terms and Conditions:", margin, yPosition);
    yPosition += 7;
    pdf.setFontSize(8);
    pdf.text("1. All sales are final.", margin, yPosition);
    yPosition += 7;
    pdf.text(
      "2. Products can be returned within 30 days of purchase.",
      margin,
      yPosition
    );
    yPosition += 7;
    pdf.text(
      "3. For any issues, please contact customer support.",
      margin,
      yPosition
    );
    yPosition += 10;

    // Add Digital Signature
    pdf.setFontSize(10);
    pdf.text(
      "Digitally signed by: \nDarshan Bhensdadia (CTO)",
      margin,
      pdfHeight - margin
    );

    // Save the PDF
    pdf.save("invoice.pdf");
  };

  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          Order ID: {order?._id || "Loading..."}
        </Card.Header>
        <Card.Body>
          <Card.Title>Status: {order?.status || "Loading..."}</Card.Title>
          <Card.Text>
            <strong>Payment:</strong> {order?.payment ? "Completed" : "Pending"}
          </Card.Text>
          <Card.Text>
            <strong>Created At:</strong>{" "}
            {order?.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Loading..."}
          </Card.Text>
          <Button variant="outline-secondary" onClick={handleShowDetailsModal}>
            View Details
          </Button>
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={handleShowInvoiceModal}
          >
            Download Invoice
          </Button>
        </Card.Body>
      </Card>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="product-container">
            {order?.products?.map((product) => (
              <div key={product._id} className="product-details">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h5>{product.name}</h5>
                <p>Price: Rs. {product.price}</p>
              </div>
            )) || "No products available"}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={handleCloseInvoiceModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <div
          id="invoice"
          ref={invoiceRef}
          style={{ fontSize: "10px", position: "relative" }}
        >
          <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
            <div>Order ID: {order?._id || "Loading..."}</div>
            <p>
              <strong>Status:</strong> {order?.status || "Loading..."}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {order?.payment ? "Completed" : "Pending"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Loading..."}
            </p>
            <hr />
            <h6>Product Summary</h6>
            <table className="table" style={{ fontSize: "10px" }}>
              <thead>
                <tr>
                  <th>
                    <b>Product Name</b>
                  </th>
                  <th>
                    <b>Price</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>Rs. {product.price}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="2">No products available</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th>Rs. {calculateGrandTotal()}</th>
                </tr>
              </tfoot>
            </table>

            {/* QR Code for Order ID */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <p>Scan to view order details:</p>
              <QRCode value={order?._id || ""} size={100} />
            </div>

            <hr />
            <p>
              <strong className="text-secondary">Terms and Conditions:</strong>
            </p>
            <ul>
              <li className="text-secondary">All sales are final.</li>
              <li className="text-secondary">
                Products can be returned within 30 days of purchase.
              </li>
              <li className="text-secondary">
                For any issues, please contact customer support.
              </li>
            </ul>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={handleDownloadPdf}
            className="ms-2"
          >
            Download Invoice
          </Button>
          <Button variant="secondary" onClick={handleCloseInvoiceModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderItem;
