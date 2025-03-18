import React, { useState, useEffect } from "react";
import "./nutrition.css";
import foodImage from "../../../assets/foodImage.jpg"

function updateFoodInfo(imageSrc = "../../../assets/foodImage.jpg", score = "7.27", alerts = ["Contains Blue Red", "UH OH"], nutrition = ["Has good food in it.", "Not poison"]) {
    document.getElementById('food-image').src = foodImage;
    document.getElementById('food-score').innerHTML = score;
    
    const alertsDiv = document.getElementById('food-alerts');
    alertsDiv.innerHTML = '<h3>Food Alerts</h3>' + alerts.map(alert => `<p>${alert}</p>`).join('');
    
    const nutritionDiv = document.getElementById('nutrition-facts');
    nutritionDiv.innerHTML = '<h3>Nutrition Facts</h3>' + nutrition.map(fact => `<p>${fact}</p>`).join('');
}

function Nutrition(){
    return (
    <div class="food-container">
        <div class="main-section">
            <img id="food-image" src="placeholder" alt="Food Image"></img>
            <div class="score-box">
                <label id="food-score">Score: 5</label>
            </div>
            <div>
                <button onClick={updateFoodInfo}> Click To Update Info </button>
            </div>
        </div>
        <div class="right-section">
            <div class="food-alerts" id="food-alerts">
                <h3>Food Alerts</h3>
                <p>No alerts available</p>
            </div>
            <div class="nutrition-facts" id="nutrition-facts">
                <h3>Nutrition Facts</h3>
                <p>No nutrition data available</p>
            </div>
        </div>
    </div>
    )
}
export default Nutrition;