import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState();
  const [length, setLength] = useState();
  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/getProduct/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.cat);

      setLength(data?.total_products);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  useEffect(() => {
    if (params?.slug) getProducts();
  }, [params?.slug]);
  return (
    <Layout>
      <div className="container">
        <h2>
          <center className="mt-2">{category?.name}</center>
        </h2>
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
    </Layout>
  );
};

export default CategoryProduct;
