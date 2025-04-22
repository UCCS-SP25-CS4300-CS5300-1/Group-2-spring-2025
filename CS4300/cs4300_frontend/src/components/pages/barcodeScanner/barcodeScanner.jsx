import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./barcodeScanner.css";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

export const fetchBarcodeData = async (barcode) => {
  const csrfToken = localStorage.getItem("token");

  if (typeof barcode !== "string") {
    const formData = new FormData();
    formData.append("file", barcode);
    try {
      const response = await fetch(`${API_URL}/imagescan/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
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
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access failed:", err);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log("Camera stopped.");
      }
    };
  }, []);

  const inputChange = (e) => setInputValue(e.target.value);

  const clicked = async () => {
    const fileInput = document.getElementById("barcode-image");
    const file = fileInput?.files?.[0];
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
        saveScannedItem(barcodeToSave).catch((err) =>
          console.warn("Failed to save scanned item:", err)
        );
      }
      if (data.name && !data.name.toLowerCase().includes("unknown")) {
        navigate("/nutrition", { state: { barcodeData: data } });
      } else {
        alert("Product not found.");
      }
    } else {
      alert("Error fetching data.");
    }
  };

  const handleSwitch = () => {
    navigate("/live-scanner");
  };

  return (
    <div className="barcode-app">
      <h2>Food Scanner</h2>

      <div className="input-group">
        <label htmlFor="barcode-int">Input Barcode Number:</label>
        <input
          type="text"
          id="barcode-int"
          placeholder="Enter UPC"
          onChange={inputChange}
        />

        <label htmlFor="barcode-image">Upload Barcode Image:</label>
        <input type="file" id="barcode-image" accept="image/*" />
      </div>

      <button className="scan-btn" onClick={clicked}>Scan Barcode</button>

      <button className="switch-btn" onClick={handleSwitch}>
        Switch to Camera Scan
      </button>

      <div className="button-group">
        <button className="account-btn" onClick={() => navigate("/account")}>
          Account
        </button>
      </div>

      <div className="bottom-links">
        <Link className="faq-btn" to="/contact">FAQ</Link>
        <Link className="about-btn" to="/about">About</Link>
      </div>
    </div>
  );
}

export default Scanner;
