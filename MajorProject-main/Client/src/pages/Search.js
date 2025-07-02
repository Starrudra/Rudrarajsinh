import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";
import { useSearch } from "../context/Search";

const Search = () => {
  const [values, setValues] = useSearch();

  console.log(values);

  const resultsArray = Array.isArray(values?.results.results)
    ? values.results.results
    : [];

  console.log(values);
  return (
    <Layout>
      <div className="container">
        <div className="">
          <h6 className=" mt-3 text-secondary">
            {values?.results.results.length < 1
              ? "No Products Found"
              : `${values?.results.results.length} Product(s) Found`}
          </h6>
          <div className="d-flex flex-wrap  ">
            {resultsArray.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className="product-link"
              >
                <center key={p._id}>
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
                      {/* <center>
                      <button className="prButton">
                        Add to Cart{" "}
                        <i class="fa-sharp fa-solid fa-cart-plus"></i>
                      </button>
                    </center> */}
                    </div>
                  </div>
                </center>
                //{" "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
