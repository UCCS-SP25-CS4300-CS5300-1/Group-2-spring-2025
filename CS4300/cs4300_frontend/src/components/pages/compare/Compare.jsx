// Compare.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchBarcodeData } from "../barcodeScanner/barcodeScanner.jsx";
import "./compare.css";
import noImage from "../../../assets/no-image.jpg";

const Compare = () => {
  const location = useLocation();
  const leftBarcode = location.state?.leftBarcode;

  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");

  const leftFileRef = useRef(null);
  const rightFileRef = useRef(null);

  useEffect(() => {
    if (leftBarcode) {
      setLeftInput(leftBarcode);
      fetchBarcodeData(leftBarcode)
        .then((data) => {
          if (data) setLeftData(data);
        })
        .catch((err) => console.error("Error fetching left barcode data:", err));
    }
  }, [leftBarcode]);

  const handleScan = async (side) => {
    const input = side === "left" ? leftInput : rightInput;
    const file = side === "left" ? leftFileRef.current?.files?.[0] : rightFileRef.current?.files?.[0];

    if (!input.trim() && !file) {
      alert("Please enter a barcode or upload a file.");
      return;
    }

    try {
      const data = await fetchBarcodeData(file || input);
      if (data) {
        if (side === "left") setLeftData(data);
        else setRightData(data);
      } else {
        alert("Product not found or error fetching data.");
      }
    } catch (err) {
      console.error("Error fetching barcode data:", err);
    }
  };

  const renderNutrition = (data) => {
    if (!data || (data.name && data.name.toLowerCase().includes("unknown"))) {
      return <div className="product-not-found"><h1>Product Not Found</h1></div>;
    }

    const nutritionData = JSON.parse(data.nutrition_data || "{}");
    const normalized = {};
    for (const key in nutritionData) {
      if (Object.hasOwn(nutritionData, key)) {
        normalized[key.toLowerCase()] = nutritionData[key];
      }
    }

    const facts = [
      `Energy: ${normalized["energy-kcal"] != null ? `${normalized["energy-kcal"].toFixed(1)} kcal` : "N/A"}`,
      `Fat: ${normalized["fat"] != null ? `${normalized["fat"].toFixed(1)} g` : "N/A"}`,
      `Carbohydrates: ${normalized["carbohydrates"] != null ? `${normalized["carbohydrates"].toFixed(1)} g` : "N/A"}`,
      `Proteins: ${normalized["proteins"] != null ? `${normalized["proteins"].toFixed(1)} g` : "N/A"}`,
      `Sugars: ${normalized["sugars"] != null ? `${normalized["sugars"].toFixed(1)} g` : "N/A"}`,
      `Fiber: ${normalized["fiber"] != null ? `${normalized["fiber"].toFixed(1)} g` : "N/A"}`,
      `Salt: ${normalized["salt"] != null ? `${normalized["salt"].toFixed(1)} g` : "N/A"}`,
    ];

    return (
      <div className="food-container">
        <div className="main-section">
          <h1>{data.name}</h1>
          <img
            id="food-image"
            src={data.image_url || noImage}
            alt="Food"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImage;
            }}
          />
        </div>
        <div className="right-section">
          <div className="nutrition-facts">
            <h3>Nutrition Facts</h3>
            {facts.map((fact, i) => (
              <p key={i}>{fact}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="compare-container">
      <div className="scanner-section">
        <div className="scanner">
          <h3>Scanner #1</h3>
          <input
            type="text"
            placeholder="Enter Barcode"
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
          />
          <label htmlFor="left-barcode-image">Upload Barcode Image:</label>
          <input type="file" ref={leftFileRef} accept="image/*" />
          <button onClick={() => handleScan("left")}>Scan</button>
        </div>

        <div className="scanner">
          <h3>Scanner #2</h3>
          <input
            type="text"
            placeholder="Enter Barcode"
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
          />
          <label htmlFor="right-barcode-image">Upload Barcode Image:</label>
          <input type="file" ref={rightFileRef} accept="image/*" />
          <button onClick={() => handleScan("right")}>Scan</button>
        </div>
      </div>

      <div className="nutrition-section">
        <div className="nutrition">
          <h3>Nutrition #1</h3>
          {renderNutrition(leftData)}
        </div>
        <div className="nutrition">
          <h3>Nutrition #2</h3>
          {renderNutrition(rightData)}
        </div>
      </div>
    </div>
  );
};

export default Compare;
