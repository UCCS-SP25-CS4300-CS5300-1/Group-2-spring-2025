import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import "./barcodeScanner.css";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;


const fetchBarcodeData = async (barcode) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await fetch(`${API_URL}/product/${barcode}/`, {
            headers: {
                Authorization: `Token ${token}`, // Include the token in the Authorization header
                "Content-Type": "application/json"
            },
            credentials: "include" // Ensure cookies are included in the request
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Barcode Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching barcode information:", error);
        return null;
    }
};

function Scanner() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const inputChange = (event) => {
    setInputValue(event.target.value);
  };

  const clicked = async() => {
    if (!inputValue.trim()) {
      alert("Please enter a barcode number.");
    //alert(inputValue);
    //navigate(`/Group-2-spring-2025/nutrition?item=${inputValue}`); // this is terrible. Do not do this. I could hijack a link pretty easily.
    //if (true) {
      return
    }
    try {
      //API call
      const data = await fetchBarcodeData(inputValue);

      if (data) {
                navigate(`/Group-2-spring-2025/nutrition`, { state: { barcodeData: data } });
            } else {
                alert("Product not found or error fetching data.");
            }
    } catch(err){
      console.error("Error fetching barcode information: ", err);
    }
  }

  return (
    <div class="barcode-app">
      <h2>Food Scanner</h2>
      <div class="input-group">
        <label for="barcode-image">Upload Barcode Image:</label>
        <input type="file" id="barcode-image" accept="image/*"></input>
        <div></div>
        <label for="barcode-int">Input Barcode Number:</label>
        <input type="text" id="barcode-int" placeholder="Enter UPC" onChange={inputChange}></input>
      </div>
      <button class="scan-btn" onClick={clicked}>Scan Barcode</button>
      
      <div class="button-group">
        <button class="account-btn">Account</button>
        <button class="signup-btn">Sign Up</button>
      </div>
      <div class="bottom-links">
        <a class="faq-btn" href="faq">FAQ</a>
        <a class="about-btn" href="about">About</a>
      </div>
    </div>
  );
}

export default Scanner;
