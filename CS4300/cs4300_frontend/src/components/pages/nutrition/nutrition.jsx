import React, { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./nutrition.css";
import noImage from "../../../assets/no-image.jpg";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

function Nutrition() {
    const location = useLocation();
    const barcodeData = location.state?.barcodeData || {};
    const navigate = useNavigate()

    const [imageSrc, setImageSrc] = useState(noImage);
    const [name, setName] = useState("");
    const [score, setScore] = useState("Loading...");
    const [alerts, setAlerts] = useState(["No alerts available"]);
    const [Ingredients, setIngredients] = useState(["Information Failed to Load"]);
    const [nutrition, setNutrition] = useState(["No nutrition data available"]);
    const [summary, setSummary] = useState("Loading...");

    useEffect(() => {
        if (!barcodeData) return;

        const foodName = barcodeData.name || "Unknown Food";
        const nutritionString = barcodeData.nutrition_data || "{}";
        const nutritionData = JSON.parse(nutritionString);
        const csrfToken = localStorage.getItem("token");
        const alertsString = barcodeData.alerts || "{}";
        const alertsData = JSON.parse(alertsString);
        const IngredientsString = barcodeData.ingredients || "{}";
        const IngredientsData = JSON.parse(IngredientsString);

        setName(foodName);
        setImageSrc(barcodeData.image_url || noImage);
        setAlerts(alertsData || ["No alerts available"]);
        setIngredients(IngredientsData || ["Information Failed to Load"]);

        const normalizedNutrition = {};
        for (const key in nutritionData) {
            if (Object.hasOwn(nutritionData, key)) {
                normalizedNutrition[key.toLowerCase()] = nutritionData[key];
            }
        }

        setNutrition([
            `Energy: ${normalizedNutrition["energy-kcal"] != null ? `${normalizedNutrition["energy-kcal"]} kcal` : "N/A"}`,
            `Fat: ${normalizedNutrition["fat"] != null ? `${normalizedNutrition["fat"]} g` : "N/A"}`,
            `Carbohydrates: ${normalizedNutrition["carbohydrates"] != null ? `${normalizedNutrition["carbohydrates"]} g` : "N/A"}`,
            `Proteins: ${normalizedNutrition["proteins"] != null ? `${normalizedNutrition["proteins"]} g` : "N/A"}`,
            `Sugars: ${normalizedNutrition["sugars"] != null ? `${normalizedNutrition["sugars"]} g` : "N/A"}`,
            `Fiber: ${normalizedNutrition["fiber"] != null ? `${normalizedNutrition["fiber"]} g` : "N/A"}`,
            `Salt: ${normalizedNutrition["salt"] != null ? `${normalizedNutrition["salt"]} g` : "N/A"}`
        ]);



        // Call health-score and health-summary in parallel
        Promise.all([
            fetch(`${API_URL}/health-score/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({ name: foodName, nutrition_data: nutritionString })
            }),
            fetch(`${API_URL}/health-summary/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({ name: foodName, nutrition_data: nutritionString })
            })
        ])
            .then(async ([scoreRes, summaryRes]) => {
                const scoreData = await scoreRes.json();
                const summaryData = await summaryRes.json();

                setScore(scoreData?.health_score || "Unavailable");
                setSummary(summaryData?.health_score_summary || "Unable to generate summary");
            })
            .catch((err) => {
                console.error(err);
                setScore("Unavailable");
                setSummary("Error generating health data.");
            });

    }, [barcodeData]);

    return (
        <div className="food-container">
            <div className="main-section">
                <h1>{name}</h1>
                <img
                    id="food-image"
                    src={imageSrc}
                    alt="Food"
                    onError={() => setImageSrc(noImage)}
                />
                <div className="score-box">
                    <div id="food-score">{score}</div>
                    <div id="food-score-summary">{summary}</div>
                </div>
            </div>
            <div className="right-section">
                <div className="food-alerts" id="food-alerts">
                    <h3>Food Alerts</h3>
                    {alerts.map((alert, index) => (
                        <p key={index}>{alert}</p>
                    ))}
                </div>
                <div className="nutrition-facts" id="nutrition-facts">
                    <h3>Nutrition Facts</h3>
                    {nutrition.map((fact, index) => (
                        <p key={index}>{fact}</p>
                    ))}
                </div>
                <div className="ingredients" id="ingredients">
                <h3>Ingredients</h3>
                    {Ingredients.map((fact, index) => (
                        <p key={index}>{fact}</p>
                    ))}
                </div>
            </div>
            <div className="compare_button">
                <button onClick={() =>
                    navigate("/compare", { state: { leftBarcode: barcodeData.barcode}})}>
                    Compare this with another food
                </button>
            </div>
        </div>
    );
}

export default Nutrition;
