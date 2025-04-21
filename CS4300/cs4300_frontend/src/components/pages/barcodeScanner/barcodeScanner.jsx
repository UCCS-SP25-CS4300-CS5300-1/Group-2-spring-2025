import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./barcodeScanner.css";
import {getCSRFToken} from "../../utils/auth_utils.jsx";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

// Public Product Lookup (Image or Text)
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

// this CSRF token shouldnt work but it doesnt and I dont wanna break it
const saveScannedItem = async (barcode) => {
    try {
        const csrfToken = localStorage.getItem("token");
        console.log("token sent to saved scanned item: ", csrfToken)
        const response = await fetch(`${API_URL}/save-scanned-item/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ barcode }),
        });
        if (!response.ok) {
            throw new Error("Failed to save scanned item");
        }
        const data = await response.json();
        console.log("Saved scanned item:", data);
        return data;
    } catch (error) {
        console.error("Error saving scanned item:", error);
        return null;
    }
};

function Scanner() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [leftData, setLeftData] = useState(null);
    const videoRef = useRef(null);

    //init camera
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
                console.error("Failed to access camera: ", err);
            }
        };
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                console.log("📷 Camera stream stopped.");
            }
        };
    }, []);

    const inputChange = (event) => {
        setInputValue(event.target.value);
    };

    const clicked = async () => {
        const fileInput = document.getElementById("barcode-image");
        const file = fileInput.files[0];
        let input = inputValue;

        if (!inputValue.trim()) {
            if (!file) {
                alert("Please enter a barcode number.");
                return;
            }
            // If no text input, use the file upload.
            input = file;
        }
        try {
            // Fetch product data (public endpoint)
            const data = await fetchBarcodeData(input);
            if (data) {
                setLeftData(data);
                // If user is authenticated, save the scanned item to history.
                const token = localStorage.getItem("token");
                if (token) {
                    // Use the barcode from the input if it was text, otherwise from the fetched data.
                    const barcodeToSave = typeof input === "string" ? input : data.barcode;
                    saveScannedItem(barcodeToSave).catch((err) => {
                        console.warn("Failed to save scanned item:", err);
                    });
                }
                // Navigate to the nutrition details page with the product data.
                if (data.name && !data.name.toLowerCase().includes("unknown")){
                    navigate("/nutrition", { state: { barcodeData: data } });
                } else {
                    alert("Product not found or error fetching data.");
                }

            } else {
                alert("Product not found or error fetching data.");
            }
        } catch (err) {
            console.error("Error fetching barcode information: ", err);
        }
    };

    const handleSwitch = () => {
        navigate('/live-scanner');
      };

    return (
        <div className="barcode-app">
            <h2>Food Scanner</h2>
            <div className="input-group">
                <label htmlFor="barcode-image">Upload Barcode Image:</label>
                <input type="file" id="barcode-image" accept="image/*"/>

                <label htmlFor="barcode-int">Input Barcode Number:</label>
                <input
                    type="text"
                    id="barcode-int"
                    placeholder="Enter UPC"
                    onChange={inputChange}
                />
            </div>

            <button className="scan-btn" onClick={clicked}>
                Scan Barcode
            </button>

            <div>
                <button className="switch-btn" onClick={handleSwitch}>Switch to Camera Scan</button>
            </div>

            <div className="button-group">
                <button className="account-btn">Account</button>
            </div>
            <div className="bottom-links">
                <Link className="faq-btn" to="/contact">FAQ</Link>
                <Link className="about-btn" to="/about">About</Link>
            </div>
        </div>
    );
}

export default Scanner;
