import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./barcodeScanner.css";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

const fetchBarcodeData = async (barcode) => {
  if (typeof barcode !== "string") {
    const formData = new FormData();
    formData.append("file", barcode);
    try {
      const response = await fetch(`${API_URL}/imagescan/`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Image scan failed");
      return await response.json();
    } catch (error) {
      console.error("Image scan error:", error);
      return null;
    }
  } else {
    try {
      const response = await fetch(`${API_URL}/product/${barcode}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Product fetch failed");
      return await response.json();
    } catch (error) {
      console.error("Text scan error:", error);
      return null;
    }
  }
};

const saveScannedItem = async (barcode) => {
  try {
    const csrfToken = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/save-scanned-item/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ barcode }),
    });
    if (!response.ok) throw new Error("Failed to save scan");
    return await response.json();
  } catch (error) {
    console.error("Save error:", error);
    return null;
  }
};

function Scanner() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const inputChange = (e) => setInputValue(e.target.value);

  const clicked = async () => {
    const fileInput = document.getElementById("barcode-image");
    const file = fileInput.files[0];
    let input = inputValue;

    if (!inputValue.trim() && !file) {
      alert("Please enter a barcode number or upload an image.");
      return;
    }

    if (!inputValue.trim() && file) {
      input = file;
    }

    const data = await fetchBarcodeData(input);
    if (data) {
      const token = localStorage.getItem("token");
      if (token) {
        const barcodeToSave = typeof input === "string" ? input : data.barcode;
        await saveScannedItem(barcodeToSave);
      }
      navigate("/nutrition", { state: { barcodeData: data } });
    } else {
      alert("Product not found or error fetching data.");
    }
  };

  return (
    <div className="page-container barcode-app">
      <h2>Food Scanner</h2>

      <div className="input-group">
        <label htmlFor="barcode-image">Upload Barcode Image:</label>
        <input type="file" id="barcode-image" accept="image/*" />

        <label htmlFor="barcode-int">Or Enter Barcode Number:</label>
        <input
          type="text"
          id="barcode-int"
          placeholder="Enter UPC"
          onChange={inputChange}
        />
      </div>

      <button className="scan-btn" onClick={clicked}>Scan Barcode</button>

      <div className="bottom-actions">
        <Link className="bottom-btn" to="/contact">FAQ</Link>
        <Link className="bottom-btn" to="/about">About</Link>
        <button className="bottom-btn">Account</button>
      </div>
    </div>
  );
}

export default Scanner;
