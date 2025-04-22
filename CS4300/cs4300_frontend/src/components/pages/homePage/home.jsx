import React from "react";
import "./home.css";
import foodImage from "../../../assets/foodImage.jpg";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Food Scanner</h1>
          <p>Healthier choices, one scan at a time.</p>
        </div>
        <img src={foodImage} alt="Healthy food" className="hero-image" />
      </section>

      <main className="page-container home-main">
        <section className="home-description">
          <h2>Welcome to Food Scanner</h2>
          <p>
            Our app helps you understand what's in the food you're about to buy.
            Scan barcodes to view ingredients, health scores, and allergen info.
          </p>
        </section>

        <section className="home-overview">
          <h2>Overview</h2>
          <p>
            Food Scanner gives you instant insights by scanning barcodes and
            showing you nutritional data, ingredients, and allergy risks —
            helping you make smarter food choices.
          </p>
        </section>

        <section className="home-features">
          <h2>Features</h2>
          <div className="feature">
            <h3>Barcode Scanning</h3>
            <p>Quickly scan barcodes for detailed nutritional information.</p>
          </div>
          <div className="feature">
            <h3>Ingredient Analysis</h3>
            <p>Break down ingredients to highlight allergens and additives.</p>
          </div>
          <div className="feature">
            <h3>Health Scores</h3>
            <p>Understand how healthy an item is with a score from 1 to 10.</p>
          </div>
          <div className="feature">
            <h3>Comparison</h3>
            <p>Compare similar products to make informed decisions.</p>
          </div>
          <div className="feature">
            <h3>Allergy Alerts</h3>
            <p>Customize your alerts to flag ingredients you're sensitive to.</p>
          </div>
          <div className="feature">
            <h3>Personalization</h3>
            <p>Create an account to save scans and set health goals.</p>
          </div>
          <div className="feature">
            <h3>Transparency</h3>
            <p>
              Our AI-powered analysis explains why a food might be flagged as unhealthy.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
