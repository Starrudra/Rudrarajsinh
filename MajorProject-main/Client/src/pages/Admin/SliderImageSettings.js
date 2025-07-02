import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";

const SliderImageSettings = () => {
  const [images, setImages] = useState([]); // Current slider images from the server
  const [imageInputs, setImageInputs] = useState([{ url: "" }]); // Dynamic image input fields

  // Fetch the current slider images
  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/v1/slider-images/get-images");
      if (data.success) {
        const existingImages = data.images || [];
        setImages(existingImages);
        setImageInputs(existingImages.map((img) => ({ url: img })));
      }
    } catch (error) {
      toast.error("Failed to fetch slider images.");
    }
  };

  // Handle change in dynamic image input fields
  const handleImageInputChange = (index, value) => {
    const newImageInputs = [...imageInputs];
    newImageInputs[index].url = value;
    setImageInputs(newImageInputs);
  };

  // Add new image input field
  const addImageInput = () => {
    setImageInputs([...imageInputs, { url: "" }]);
  };

  // Remove an image input field
  const removeImageInput = (index) => {
    const newImageInputs = [...imageInputs];
    newImageInputs.splice(index, 1);
    setImageInputs(newImageInputs);
  };

  // Upload new slider images
  const handleUploadImages = async (e) => {
    e.preventDefault();
    const imagesArray = imageInputs
      .map((img) => img.url.trim())
      .filter((img) => img !== "");
    try {
      const { data } = await axios.post("/api/v1/slider-images/upload-images", {
        images: imagesArray,
      });
      if (data.success) {
        toast.success(data.message);
        fetchImages(); // Re-fetch images to show the uploaded ones
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload slider images.");
    }
  };

  // Update existing slider images
  const handleUpdateImages = async (e) => {
    e.preventDefault();
    const imagesArray = imageInputs
      .map((img) => img.url.trim())
      .filter((img) => img !== "");
    try {
      const { data } = await axios.put("/api/v1/slider-images/update-images", {
        images: imagesArray,
      });
      if (data.success) {
        toast.success(data.message);
        fetchImages(); // Re-fetch images to show the updated ones
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update slider images.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Layout>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="bg-white rounded p-4">
              <h1 className="text-center mb-4">Slider Image Settings</h1>

              {images.length > 0 ? (
                <div className="text-center mb-4">
                  <h3 className="mb-3">Current Slider Images:</h3>
                  <div
                    className="slider-images d-flex flex-wrap justify-content-center"
                    style={{ gap: "10px" }}
                  >
                    {images.map((img, index) => (
                      <div key={index} className="text-center">
                        <img
                          src={img}
                          alt={`Slider ${index + 1}`}
                          className="img-fluid"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                        <p>{`Image ${index + 1}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted mb-4">
                  No slider images found. Upload new images below.
                </p>
              )}

              <form>
                {imageInputs.map((input, index) => (
                  <div key={index} className="form-group mb-3">
                    <div className="d-flex">
                      <input
                        type="text"
                        placeholder={`Image URL ${index + 1}`}
                        value={input.url}
                        onChange={(e) =>
                          handleImageInputChange(index, e.target.value)
                        }
                        className="form-control"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-danger ms-2"
                          onClick={() => removeImageInput(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={addImageInput}
                  >
                    Add Another Image
                  </button>
                </div>

                <div className="text-center">
                  <button
                    className="btn btn-outline-secondary mx-2"
                    onClick={handleUploadImages}
                  >
                    Upload Images
                  </button>
                  <button
                    className="btn btn-outline-secondary mx-2"
                    onClick={handleUpdateImages}
                  >
                    Update Images
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

export default SliderImageSettings;
