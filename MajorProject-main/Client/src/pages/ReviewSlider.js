import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CSS/ReviewSlider.css"; // Import the CSS file

const ReviewSlider = ({ reviews }) => {
  const sliderRef = useRef(null); // Reference to the slider component

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Adjusted to rotate after 5 seconds
  };

  const handleMouseEnter = () => {
    sliderRef.current.slickNext(); // Go to the next slide when mouse enters the slider
  };

  return (
    <div className="review-slider" onMouseEnter={handleMouseEnter}>
      <Slider ref={sliderRef} {...settings}>
        {reviews.map((review, index) => (
          <div key={index}>
            <div className="review-card">
              <div className="review-content">
                <h3>{review.name}</h3>
                <div className="rating">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <span key={i}>&#9733;</span> // Render star for each rating
                  ))}
                </div>
                <p>{review.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReviewSlider;
