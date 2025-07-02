import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import "../CSS/category.css";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  //handle form

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/category/create-category",
        {
          name,
        },
        {
          headers: {
            authtoken: localStorage.getItem("auth"),

            // Add other headers if required by your API
          },
        }
      );
      const x = localStorage.getItem("auth");
      console.log(x);
      if (data?.success) {
        toast.success(data.message);
        getAllCategory();
        setName("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in cerating category");
    }
  };

  //handleDelete

  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pid}`
      );
      if (data.success) {
        toast.success(data.message);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //get all categories

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something get wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //handle update function

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("hello");
      console.log(selected);
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success("Category updated");
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error);
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
            <h1>Manage Category</h1>
            <div className="p-3 w-75 Category-text">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
                x="Create"
              />
            </div>
            <div className="w-75 tbl ">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-outline-secondary mx-3"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(c._id)}
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
                x="Update"
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
