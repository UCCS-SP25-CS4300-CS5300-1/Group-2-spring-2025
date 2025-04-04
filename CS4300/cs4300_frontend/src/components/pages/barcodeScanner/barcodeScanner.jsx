import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import "./barcodeScanner.css";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

const fetchBarcodeData = async (barcode) => {
  // do we have a code to fetch already or does the server need to decode it?
  if (typeof barcode != 'string'){
    const formData = new FormData();
    formData.append("file", barcode);

    try {
      // Send it on and return the food information.
      const response = await fetch(`${API_URL}/imagescan/`, {
        method: "POST",
        body: formData,
      })
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

  }else{
    try {
        const response = await fetch(`${API_URL}/product/${barcode}/`);
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
  }
};

function Scanner() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const inputChange = (event) => {
    setInputValue(event.target.value);
  };

  const clicked = async() => {
    const fileInput = document.getElementById("barcode-image");
    const file = fileInput.files[0];
    let input = inputValue;

    if (!inputValue.trim()) {
      if (!file){
        // there is no file to fallback on, nothing was entered. 
        alert("Please enter a barcode number.");
        return
      }
      // okay, the input must be a file.
      input = file;
    }
    try {
      //API call
      const data = await fetchBarcodeData(input);

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
