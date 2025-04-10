import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import foodImage from "../../../assets/foodImage.jpg";

function Home() {
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [hasForcedScroll, setHasForcedScroll] = useState(false);
  const targetSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = 700;
      let opacity = 1;

      if (scrollTop <= fadeStart) {
        opacity = 1;
      } else if (scrollTop >= fadeEnd) {
        opacity = 0;
      } else {
        opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
      }
      setFadeOpacity(opacity);

      // Force scroll only if not already done and if the scroll passes a threshold
      const forceScrollThreshold = 100;
      if (!hasForcedScroll && scrollTop >= forceScrollThreshold && targetSectionRef.current) {
        targetSectionRef.current.scrollIntoView({ behavior: "smooth" });
        setHasForcedScroll(true);
      }
      // Optionally, allow reset of the forced scroll flag when scrolling back up
      else if (scrollTop < forceScrollThreshold && hasForcedScroll) {
        setHasForcedScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasForcedScroll]);

  return (
      <div className="home">
        {/* Background image with fade */}
        <img
            src={foodImage}
            alt="Healthy food"
            className="home-image faded-background-image"
            style={{ opacity: fadeOpacity }}
        />

        {/* Big Bold Title Overlay */}
        <h1 className="faded-title" style={{ opacity: fadeOpacity }}>
          Food Scanner
        </h1>

        {/* Small Subtitle Under Title */}
        <p className="faded-subtitle" style={{ opacity: fadeOpacity }}>
          Healthier choices one scan at a time.
        </p>

        <main className="home-main">
          <section className="home-description">
            <h2>Welcome to Food Scanner</h2>
            <p>
              Our app helps you understand what is in the food you are looking to purchase.
              Scan barcodes to get a breakdown of ingredients, health scores, and potential allergens.
            </p>
          </section>
          {/* This section is used as the target for forced scrolling */}
          <section ref={targetSectionRef} className="home-overview">
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
              <p>Customize your allergens to have alerts when a food contains a potential allergen.</p>
            </div>
            <div className="feature">
              <h3>Personalization</h3>
              <p>Sign up for a free account to personalize your nutritional goals and save scanned items.</p>
            </div>
            <div className="feature">
              <h3>Understanding</h3>
              <p>
                Want to know why a food is flagged as unhealthy? With our AI-Powered food analysis, you can understand why a food is flagged.
              </p>
            </div>
          </section>
        </main>
      </div>
  );
}

export default Home;
