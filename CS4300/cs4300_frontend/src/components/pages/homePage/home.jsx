import React, { useState, useEffect } from "react";
import "./home.css";
import foodImage from "../../../assets/foodImage.jpg"; // Ensure the image exists in the path

function Home() {
  const [imageOpacity, setImageOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const fadeStart = 0; // start fading at 0px
      const fadeEnd = 700; // fully faded at 300px
      let opacity = 1;
      if (scrollTop <= fadeStart) {
        opacity = 1;
      } else if (scrollTop >= fadeEnd) {
        opacity = 0;
      } else {
        opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
      }
      setImageOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header-content">
          <h1>Food Scanner</h1>
          <p>Get better information about the things you eat.</p>
        </div>
      </header>
      <main className="home-main">
        <img
          src={foodImage}
          alt="Healthy food"
          className="home-image"
          style={{
            opacity: imageOpacity,
            position: "fixed",
            top: 175,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: -1
          }}
        />
        <section className="home-description">
          <h2>Welcome to Food Scanner</h2>
          <p>
            Our app helps you understand what is in the food you are looking to purchase.
            Scan barcodes to get a breakdown of ingredients, health scores, and potential allergens.
          </p>
        </section>
        <section className="home-overview">
          <h2>Overview</h2>
          <p>
            Food Scanner provides a comprehensive look at the foods you consume by scanning barcodes and analyzing ingredients,
            nutritional information, and potential allergens. It’s your go-to app for informed food choices.
          </p>
        </section>
        <section className="home-features">
          <h2>Features</h2>
          <div className="feature">
            <h3>Barcode Scanning</h3>
            <p>Quickly scan barcodes to retrieve detailed nutritional information.</p>
          </div>
          <div className="feature">
            <h3>Ingredient Analysis</h3>
            <p>Break down ingredient lists to highlight allergens and additives.</p>
          </div>
          <div className="feature">
            <h3>Health Scores</h3>
            <p>Evaluate the nutritional quality of products with easy-to-read health scores from 1 to 10.</p>
          </div>
          <div className="feature">
            <h3>Comparison</h3>
            <p>Compare different products to find the best food for your goals and allergens.</p>
          </div>
          <div className="feature">
            <h3>Allergy Alerts</h3>
            <p>Customize your allergens to have alerts when a food contains a protential allergen.</p>
          </div>
          <div className="feature">
            <h3>Personalization</h3>
            <p>Sign up for a free account to personalize your nutritional goals and save scanned items.</p>
          </div>
          <div className="feature">
            <h3>Understanding</h3>
            <p>Want to know why a food is flagged as unhealthy? With our AI-Powered food analysis, you can understand why a food is flagged.</p>
          </div>
          <div className="feature">
            <h3>Questions?</h3>
            <p>Simply ask our integrated AI about any questions you have.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
