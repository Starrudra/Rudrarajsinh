import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ImageSlider from "./ImageSlider";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CSS/homepage.css";

const HomePage = () => {
  const [homePageBoxes, setHomePageBoxes] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-products");
      if (data.success) {
        setAllProducts(data.products); // Store all products
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products");
    }
  };

  // Fetch homepage boxes
  const getHomePageBoxes = async () => {
    try {
      const { data } = await axios.get("/api/v1/homePageBox/getHomePageBoxes");
      if (data.success) {
        setHomePageBoxes(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching homepage boxes");
    }
  };

  // Fetch slider images
  const getSliderImages = async () => {
    try {
      const { data } = await axios.get("/api/v1/slider-images/get-images");
      if (data.success) {
        setSliderImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch slider images.");
    }
  };

  // Effect to fetch data
  useEffect(() => {
    getAllProducts(); // Fetch all products first
    getHomePageBoxes(); // Then fetch homepage boxes
    getSliderImages();
  }, []);

  // Function to get product by ID
  const getProductById = (id) => {
    return allProducts.find((product) => product._id === id);
  };

  return (
    <Layout>
      <div className="mx-3 my-3">
        <ImageSlider images={sliderImages} />
      </div>

      <div className="homepage-boxes">
        {" "}
        {/* Added a wrapper for boxes */}
        {homePageBoxes.map((box) => (
          <div key={box._id} className="box-container mx-3 my-3">
            {" "}
            {/* Separate container for each box */}
            <h2 className="box-title">{box.title}</h2>
            {box.boxes.map((subBox) => (
              <div key={subBox._id} className="container">
                <p className="TT">{subBox.title}</p>
                {subBox.subtitles.map((subtitle) => (
                  <div key={subtitle._id} className="womenKurti">
                    <p className="T my-3">{subtitle.subtitle}</p>
                    <div className="d-flex pC">
                      {subtitle.products.map((productId) => {
                        const product = getProductById(productId);
                        return (
                          <Link
                            key={productId}
                            to={`/product/${product?.slug}`} // Redirect based on product slug
                            className="product-link"
                          >
                            <center>
                              <div className="card m-2 productCard Tcard">
                                <img
                                  src={product?.photo || ""} // Get product image
                                  className="card-img-top product-image"
                                  alt="Product Image"
                                />
                                <div className="card-body">
                                  <p className="text-danger newArrival">
                                    New Arrival
                                  </p>
                                </div>
                              </div>
                            </center>
                          </Link>
                        );
                      })}
                      {subBox.showMore && (
                        <div className="B mx-3">
                          <Link
                            className="showMore"
                            to={`/category/${subBox.title
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                          >
                            Show More
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default HomePage;
