import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./nutrition.css";
import foodImage from "../../../assets/foodImage.jpg";

function Nutrition() {
  const location = useLocation();
  const barcodeData = location.state?.barcodeData || {};

  const [imageSrc, setImageSrc] = useState(foodImage);
  const [name, setName] = useState("");
  const [score, setScore] = useState("5");
  const [alerts, setAlerts] = useState(["No alerts available"]);
  const [nutrition, setNutrition] = useState(["No nutrition data available"]);

  useEffect(() => {
    if (barcodeData) {
      setName(barcodeData.name || "Unknown Food");
      setImageSrc(barcodeData.image || foodImage);
      setScore(barcodeData.nutrition_score_fr || "N/A");
      setAlerts(barcodeData.alerts || ["No alerts available"]);

      const nutritionData = barcodeData.nutrition_data
        ? JSON.parse(barcodeData.nutrition_data)
        : {};
      setNutrition([
        `Energy: ${nutritionData["energy-kcal"]} kcal`,
        `Fat: ${nutritionData.fat} g`,
        `Carbohydrates: ${nutritionData.carbohydrates} g`,
        `Proteins: ${nutritionData.proteins} g`,
        `Sugars: ${nutritionData.sugars} g`,
        `Fiber: ${nutritionData.fiber} g`,
        `Salt: ${nutritionData.salt} g`,
      ]);
    }
  }, [barcodeData]);

  return (
    <div className="page-container nutrition-container">
      <div className="main-section">
        <h1>{name}</h1>
        <img id="food-image" src={imageSrc} alt="Food" />
        <div className="score-box">
          <label id="food-score">Score: {score}</label>
        </div>
      </div>

      <div className="right-section">
        <div className="food-alerts">
          <h3>Food Alerts</h3>
          {alerts.map((alert, index) => (
            <p key={index}>{alert}</p>
          ))}
        </div>
        <div className="nutrition-facts">
          <h3>Nutrition Facts</h3>
          {nutrition.map((fact, index) => (
            <p key={index}>{fact}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Nutrition;
