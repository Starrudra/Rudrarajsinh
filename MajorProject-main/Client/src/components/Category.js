import React, { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import "../pages/CSS/ProductCategory.css";
import { Checkbox, Radio } from "antd";
import { prices } from "./Prices";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [mobileView, setMobileView] = useState(false);

  //get product

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //filter by category

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  //get all category

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
    if (!checked.length || !radio.length) getAllProducts();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filtered product

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`/api/v1/products/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  //responsive
  // Check if the viewport width is less than 768 pixels (adjust as needed)
  const checkMobileView = () => {
    setMobileView(window.innerWidth < 768);
  };
  useEffect(() => {
    // Initial check on mount
    checkMobileView();

    // Event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  return (
    <Layout>
      <div className="row mt-3 ">
        <div className="col-md-2">
          <div class="accordion m-2" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Filter By Category
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse show"
              >
                <div class="accordion-body">
                  <div className="d-flex flex-column m-3">
                    {categories?.map((c) => (
                      <Checkbox
                        key={c._id}
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                      >
                        {c.name}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Filter By Price
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                class="accordion-collapse collapse"
              >
                <div class="accordion-body">
                  <div className="d-flex flex-column">
                    <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                      {prices?.map((p) => (
                        <div key={p._id}>
                          <Radio value={p.array}>{p.name}</Radio>;
                        </div>
                      ))}
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column m-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="col-md-10">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap  productcont">
            {products?.map((p) => (
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
                      {/* <p className="card-text">{p.description}</p> */}
                      <p className="card-text">
                        <sup className="text-danger prodPrice">-40%</sup>{" "}
                        <span className="h5 " id="prodPriceOrg">
                          {" "}
                          &#8377;
                          {/* Rs. */}
                          {p.price}
                        </span>{" "}
                        <span>
                          <s className="prodPrice">
                            {" "}
                            &#8377;{Math.round((p.price * 100) / 60)}
                          </s>
                        </span>
                      </p>
                      {/* <center>
                      <button className="prButton">
                        Add to Cart{" "}
                        <i class="fa-sharp fa-solid fa-cart-plus"></i>
                      </button>
                    </center> */}
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

export default Category;
