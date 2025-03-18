import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import "./barcodeScanner.css";

function Scanner() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const inputChange = (event) => {
    setInputValue(event.target.value);
  };

  const clicked = async() => {
    alert(inputValue);
    navigate(`/nutrition?item=${inputValue}`); // this is terrible. Do not do this. I could hijack a link pretty easily. 
    if (true) {
      return 
    }
    try {
      //const response = await fetch("http://localhost:8080");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      navigate("/contact");
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
        <a class="about-btn" href="/about">About</a>
      </div>
    </div>
  );
}

export default Scanner;
