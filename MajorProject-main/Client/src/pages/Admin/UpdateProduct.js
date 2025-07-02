import React, { useState, useEffect } from "react";
import axios, { toFormData } from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");

  //get single product

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      setName(data.product.name);
      setPhoto(data.product.photo);
      setId(data.product._id);
      setCategory(data.product.category._id);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setDescription(data.product.description);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);

  //delete product function

  //Update product function

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("shipping", shipping);
      productData.append("category", category);
      console.log(productData);
      console.log("FormData content:", Object.fromEntries(productData));
      console.log(productData.name);
      const { data } = await axios.put(
        `/api/v1/products/update-product/${id}`,
        Object.fromEntries(productData)
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
  return (
    <Layout>
      <div className="container-fluid mt-3 pt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Products</h1>
            <div className="m-1 w-75">
              <form encType="multipart/form-data">
                <label htmlFor="">Select Category</label>
                <Select
                  bordered={false}
                  placeholder="Select category"
                  size="large"
                  className="form-select mb-3"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  value={category}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
                <div className="mb-3 ">
                  <label htmlFor="">Photo URL:</label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="form-control"
                    placeholder="Photo URL"
                    onChange={(e) => setPhoto(e.target.value)}
                    value={photo}
                  />
                </div>
                <div className="mb-3">
                  <div className="text-center">
                    <img src={photo} alt="" height="200px" />
                  </div>
                </div>
                <div className="mb-3 ">
                  <label htmlFor="">Name:</label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="mb-3 ">
                  <label htmlFor="">Price:</label>
                  <input
                    type="number"
                    name=""
                    id=""
                    className="form-control"
                    placeholder="Enter Price"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                </div>
                <div className="mb-3 ">
                  <label htmlFor="">Quantity:</label>
                  <input
                    type="number"
                    name=""
                    id=""
                    className="form-control"
                    placeholder="Enter Quantity"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="">Description</label>
                  <textarea
                    name=""
                    id=""
                    rows="3"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>
                <div className="mb-3 ">
                  <label htmlFor="">Shipping:</label>
                  <Select
                    type="text"
                    name=""
                    bordered={false}
                    id=""
                    className="form-select"
                    placeholder="Enter Shipping"
                    onChange={(value) => setShipping(value)}
                    value={shipping ? "Yes" : "No"}
                  >
                    <Option value="Yes"> Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-outline-success"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
