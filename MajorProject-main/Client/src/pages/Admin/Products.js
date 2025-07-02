import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/AdminProduct.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  //Get all Products

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //handle delete
  const handleDelete = async (id) => {
    try {
      let text = "Are You Sure you want to delete product?";
      if (!window.confirm(text)) return;
      const { data } = await axios.delete(
        `/api/v1/products/delete-product/${id}`
      );

      toast.success(data.message);
      getAllProducts();
    } catch (error) {
      console.log(error);
      toast.message(error.message);
    }
  };

  //Lifecycle  method

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout>
      <div className="container-fluid mt-3 pt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">Product List</h1>
            <div className="d-flex productcont">
              {products?.map((p) => (
                <div className="card m-2 productCard">
                  <img
                    src={p.photo}
                    className="card-img-top product-image"
                    alt="Product Image"
                  />
                  <div className="card-body">
                    <p className="card-title pName ">{p.name}</p>
                    {/* <p className="card-text">{p.description}</p> */}
                    <p className="card-text">
                      <sup className="text-danger prodPrice">-80%</sup>{" "}
                      <span className="h5 " id="prodPriceOrg">
                        {" "}
                        &#8377;
                        {/* Rs. */}
                        {p.price}
                      </span>{" "}
                      <span>
                        <s className="prodPrice">
                          {" "}
                          &#8377;{Math.round((p.price * 100) / 20)}
                        </s>
                      </span>
                    </p>
                    <Link
                      key={p._id}
                      to={`/dashboard/admin/product/${p.slug}`}
                      className="product-link"
                    >
                      <button className="btn btn-outline-success btn-sm">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                    </Link>

                    <button
                      className="btn btn-outline-danger btn-sm m-2"
                      onClick={() => handleDelete(p._id)}
                    >
                      <i class="fa-sharp fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
