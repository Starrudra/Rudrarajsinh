import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CSS/ProductDetail.css";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const [value, setValue] = React.useState(4.5);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cart, setCart] = useCart();
  const params = useParams();
  const [p, setP] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      setP(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params.slug]);

  // Get similar products
  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/related-products/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Add to cart API call
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    try {
      const token = localStorage.getItem("auth");
      const t = JSON.parse(token);
      const { data } = await axios.post(
        "/api/v1/cart/addToCart",
        {
          productId: p._id,
        },
        {
          headers: {
            authtoken: t.token,
          },
        }
      );

      if (data.success) {
        toast.success("Product added to cart");
        setCart([...cart, p]); // Update local cart state
        setSelectedSize("");
      } else {
        toast.error(data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product to cart");
    }
  };

  return (
    <Layout>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat&display=swap"
          rel="stylesheet"
        />
      </head>
      <div className="container">
        <div className="row mt-2">
          <div className="col-md-3">
            <center>
              <img src={p.photo} alt="" className="image" />
            </center>
          </div>
          <div className="col-md-9">
            <div className="container">
              <p className="pNameD">{p.name}</p>
              <hr />
              <div className="pPrice">
                <span className="text-danger">-40%</span>{" "}
                <span className="RupSym">
                  <sup>&#8377;</sup>
                  {p.price}
                </span>{" "}
              </div>
              <div className="pMrp">
                <s>M.R.P: &#8377;{(p.price * 100) / 60}</s>
              </div>
              <hr />
              <div className="pRating">
                <span className="pR">Ratings</span>
                <Stack spacing={1}>
                  <Rating
                    name="half-rating-read"
                    defaultValue={value}
                    precision={0.25}
                    readOnly
                  />
                </Stack>
              </div>
              <hr />
              <div className="pSize">
                Size:{" "}
                <select
                  className="form-select mb-3 sizeee"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">--Please Select--</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div className="btns">
                <button
                  className="addToCart btn btn-sm btn-outline-secondary"
                  onClick={handleAddToCart}
                >
                  Add to Cart <i className="fa-sharp fa-solid fa-cart-plus"></i>
                </button>
                <button className="addToCart btn btn-sm btn-outline-secondary mx-3">
                  Buy Now
                </button>
              </div>
              <hr />
              <div className="pDescription">
                <div className="pR">Description</div>
                <div className="pD">{p.description}</div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row container">
          <center>
            <p className="pPrice">Similar Products</p>
          </center>
          <div className="d-flex flex-wrap  ">
            {relatedProducts?.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className="product-link"
              >
                <center>
                  <div className="card m-2 productCard ">
                    <img
                      src={p.photo}
                      className="card-img-top product-image"
                      alt="Product Image"
                    />
                    <div className="card-body">
                      <p className="card-title pName ">{p.name}</p>
                      <p className="card-text">
                        <sup className="text-danger prodPrice">-40%</sup>{" "}
                        <span className="h5 " id="prodPriceOrg">
                          {" "}
                          &#8377;
                          {p.price}
                        </span>{" "}
                        <span>
                          <s className="prodPrice">
                            {" "}
                            &#8377;{Math.round((p.price * 100) / 60)}
                          </s>
                        </span>
                      </p>
                    </div>
                  </div>
                </center>{" "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
