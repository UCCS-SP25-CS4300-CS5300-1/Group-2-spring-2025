import React, { useState } from "react";
import { fetchBarcodeData } from "../barcodeScanner/barcodeScanner.jsx"; // Reuse the fetchBarcodeData function
import "./compare.css";
import foodImage from "../../../assets/foodImage.jpg";

const Compare = () => {
    const [leftData, setLeftData] = useState(null);
    const [rightData, setRightData] = useState(null);
    const [leftInput, setLeftInput] = useState("");
    const [rightInput, setRightInput] = useState("");

    const handleScan = async (side) => {
        const fileInput = document.getElementById(`${side}-barcode-image`);
        const file = fileInput.files[0];
        const input = side === "left" ? leftInput : rightInput;

        if (!input.trim() && !file) {
            alert("Please enter a barcode or upload a file.");
            return;
        }

        try {
            const data = await fetchBarcodeData(file || input);
            if (data) {
                if (side === "left") {
                    setLeftData(data);
                } else {
                    setRightData(data);
                }
            } else {
                alert("Product not found or error fetching data.");
            }
        } catch (err) {
            console.error("Error fetching barcode information: ", err);
        }
    };

    const renderNutrition = (data) => {
        if (!data || (data.name && data.name.toLowerCase().includes("unknown"))) {
            return (
                <div className="product-not-found">
                    <h1>Product Not Found</h1>
                </div>
            );
        }

        const nutritionData = JSON.parse(data.nutrition_data || "{}");
        const normalizedNutrition = {};
        for (const key in nutritionData) {
            if (Object.hasOwn(nutritionData, key)) {
                normalizedNutrition[key.toLowerCase()] = nutritionData[key];
            }
        }

        const nutritionFacts = [
            `Energy: ${normalizedNutrition["energy-kcal"] != null ? `${normalizedNutrition["energy-kcal"].toFixed(1)} kcal` : "N/A"}`,
            `Fat: ${normalizedNutrition["fat"] != null ? `${normalizedNutrition["fat"].toFixed(1)} g` : "N/A"}`,
            `Carbohydrates: ${normalizedNutrition["carbohydrates"] != null ? `${normalizedNutrition["carbohydrates"].toFixed(1)} g` : "N/A"}`,
            `Proteins: ${normalizedNutrition["proteins"] != null ? `${normalizedNutrition["proteins"].toFixed(1)} g` : "N/A"}`,
            `Sugars: ${normalizedNutrition["sugars"] != null ? `${normalizedNutrition["sugars"].toFixed(1)} g` : "N/A"}`,
            `Fiber: ${normalizedNutrition["fiber"] != null ? `${normalizedNutrition["fiber"].toFixed(1)} g` : "N/A"}`,
            `Salt: ${normalizedNutrition["salt"] != null ? `${normalizedNutrition["salt"].toFixed(1)} g` : "N/A"}`
        ];

        return (
            <div className="food-container">
                <div className="main-section">
                    <h1>{data.name}</h1>
                    <img id="food-image" src={data.image || foodImage} alt="Food" />
                </div>
                <div className="right-section">
                    <div className="nutrition-facts">
                        <h3>Nutrition Facts</h3>
                        {nutritionFacts.map((fact, index) => (
                            <p key={index}>{fact}</p>
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
                    <input type="file" id="left-barcode-image" accept="image/*" />
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
                    <input type="file" id="right-barcode-image" accept="image/*" />
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