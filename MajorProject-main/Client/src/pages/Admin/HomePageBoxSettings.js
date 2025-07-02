import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateHomePageBoxes = () => {
  const navigate = useNavigate();
  const [boxes, setBoxes] = useState([
    {
      title: "",
      subtitles: [{ subtitle: "", products: [] }],
      showMore: false,
    },
  ]);
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-products");
      if (data?.success) {
        const sortedProducts = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllProducts(sortedProducts);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products");
    }
  };

  const fetchExistingBoxes = async () => {
    try {
      const { data } = await axios.get("/api/v1/homePageBox/getHomePageBoxes");
      if (data?.success && Array.isArray(data.data)) {
        const fetchedBoxes = data.data[0]?.boxes || [];

        const formattedBoxes = fetchedBoxes.map((box) => ({
          title: box.title || "",
          subtitles: box.subtitles.map((sub) => ({
            subtitle: sub.subtitle || "",
            products: sub.products || [],
          })) || [{ subtitle: "", products: [] }],
          showMore: box.showMore || false,
        }));

        setBoxes(
          formattedBoxes.length > 0
            ? formattedBoxes
            : [
                {
                  title: "",
                  subtitles: [{ subtitle: "", products: [] }],
                  showMore: false,
                },
              ]
        );
      } else {
        toast.error("Failed to load existing boxes.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching existing boxes.");
    }
  };

  useEffect(() => {
    getAllProducts();
    fetchExistingBoxes();
  }, []);

  const handleBoxChange = (index, field, value) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index][field] = value;
    setBoxes(updatedBoxes);
  };

  const handleSubtitleChange = (boxIndex, subtitleIndex, field, value) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[boxIndex].subtitles[subtitleIndex][field] = value;
    setBoxes(updatedBoxes);
  };

  const handleProductChange = (
    boxIndex,
    subtitleIndex,
    productIndex,
    value
  ) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[boxIndex].subtitles[subtitleIndex].products[productIndex] =
      value;
    setBoxes(updatedBoxes);
  };

  const addBox = () => {
    setBoxes([
      ...boxes,
      {
        title: "",
        subtitles: [{ subtitle: "", products: [] }],
        showMore: false,
      },
    ]);
  };

  const addSubtitle = (boxIndex) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[boxIndex].subtitles.push({ subtitle: "", products: [] });
    setBoxes(updatedBoxes);
  };

  const addProduct = (boxIndex, subtitleIndex) => {
    const updatedBoxes = [...boxes];
    const productsInSubtitle =
      updatedBoxes[boxIndex].subtitles[subtitleIndex].products;

    if (productsInSubtitle.includes("")) {
      toast.error("Please select a product to add.");
      return;
    }

    updatedBoxes[boxIndex].subtitles[subtitleIndex].products.push("");
    setBoxes(updatedBoxes);
  };

  // To filter out already selected products in a subtitle
  const getAvailableProducts = (boxIndex, subtitleIndex) => {
    const selectedProducts = boxes[boxIndex].subtitles[subtitleIndex].products;
    return allProducts.filter(
      (product) => !selectedProducts.includes(product._id)
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/homePageBox/setHomePageBoxes",
        { boxes }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in setting homepage boxes");
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
            <h1>Create Home Page Boxes</h1>
            <div className="m-1 w-75">
              <form>
                {boxes &&
                  boxes.length > 0 &&
                  boxes.map((box, boxIndex) => (
                    <div key={boxIndex}>
                      <div className="mb-3">
                        <label htmlFor="title">Box Title:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Box Title"
                          value={box.title}
                          onChange={(e) =>
                            handleBoxChange(boxIndex, "title", e.target.value)
                          }
                        />
                      </div>

                      {box.subtitles &&
                        box.subtitles.length > 0 &&
                        box.subtitles.map((sub, subtitleIndex) => (
                          <div key={subtitleIndex}>
                            <div className="mb-3">
                              <label htmlFor="subtitle">Subtitle:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Subtitle"
                                value={sub.subtitle}
                                onChange={(e) =>
                                  handleSubtitleChange(
                                    boxIndex,
                                    subtitleIndex,
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {sub.products &&
                              sub.products.length > 0 &&
                              sub.products.map((product, productIndex) => (
                                <div className="mb-3" key={productIndex}>
                                  <label htmlFor="productId">Product ID:</label>
                                  <Select
                                    showSearch
                                    placeholder="Select a Product"
                                    className="form-control"
                                    value={sub.products[productIndex]}
                                    onChange={(value) =>
                                      handleProductChange(
                                        boxIndex,
                                        subtitleIndex,
                                        productIndex,
                                        value
                                      )
                                    }
                                  >
                                    {getAvailableProducts(
                                      boxIndex,
                                      subtitleIndex
                                    ).map((product) => (
                                      <Option
                                        key={product._id}
                                        value={product._id}
                                      >
                                        {product.name}
                                      </Option>
                                    ))}
                                  </Select>
                                </div>
                              ))}

                            <button
                              className="btn btn-outline-primary mb-3"
                              type="button"
                              onClick={() =>
                                addProduct(boxIndex, subtitleIndex)
                              }
                            >
                              Add Another Product ID
                            </button>
                          </div>
                        ))}

                      <button
                        className="btn btn-outline-secondary mb-3"
                        type="button"
                        onClick={() => addSubtitle(boxIndex)}
                      >
                        Add Another Subtitle
                      </button>

                      <div className="mb-3">
                        <label htmlFor="showMore">Show More Button:</label>
                        <Select
                          className="form-select"
                          value={box.showMore}
                          onChange={(value) =>
                            handleBoxChange(boxIndex, "showMore", value)
                          }
                        >
                          <Option value={true}>Yes</Option>
                          <Option value={false}>No</Option>
                        </Select>
                      </div>
                    </div>
                  ))}

                <button
                  className="btn btn-outline-secondary mb-3"
                  type="button"
                  onClick={addBox}
                >
                  Add Another Box
                </button>

                <div className="mb-3">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleCreate}
                  >
                    Create Home Page Boxes
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

export default CreateHomePageBoxes;
