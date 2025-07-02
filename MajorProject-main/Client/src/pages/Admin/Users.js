import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMenu from "../../components/layout/AdminMenu";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/auth/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [selectedUser]);

  const handleUpdateRole = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleChange = async (e) => {
    const role = e.target.value === "User" ? 0 : 1;
    await setSelectedRole(role);
  };

  const handleSaveChanges = async () => {
    const response = await axios.put(
      `/api/v1/auth/${selectedUser?._id}/update-role`,
      { role: selectedRole }
    );
    if (response?.data.success) {
      toast.success("Role Updated Successfully");
    } else {
      toast.error("Something went wrong");
    }
    handleCloseModal();
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Layout>
      <div className="container-fluid mt-3 pt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role === 1 ? "Admin" : "User"}</td>
                    <td>{user.address}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleUpdateRole(user)}
                        className="btn-sm"
                      >
                        Update Role
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
                  currentPage === Math.ceil(users.length / usersPerPage)
                }
              >
                Next
              </Button>
            </Pagination>

            {/* Modal for updating user role */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Update User Role {selectedUser?._id}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="roleSelect">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">User</option>
                    <option value="1">Admin</option>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
