import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./barcodeScanner.css";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

function LiveScanner() {
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Define format hints to improve scan accuracy
        const hints = new Map();
        const formats = [
          BarcodeFormat.CODE_128,
          BarcodeFormat.EAN_13,
          BarcodeFormat.UPC_A,
          BarcodeFormat.QR_CODE,
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

        codeReaderRef.current = new BrowserMultiFormatReader(undefined, {
            delayBetweenScanAttempts: 300,
        });

        const startScanner = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError("No camera devices found.");
                    return;
                }

                // Start decoding from the first available device
                codeReaderRef.current.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (result, err) => {
                    if (result) {
                        console.log("Barcode scanned:", result.getText());

                        // Stop the scanner


                        // Send barcode to your existing backend
                        fetch(`${API_URL}/product/${result.getText()}/`, {
                            method: "GET",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": localStorage.getItem("token"),
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.name && !data.name.toLowerCase().includes("unknown")) {
                                    navigate("/nutrition", {state: {barcodeData: data}});
                                } else {
                                    alert("Product not found.");
                                }
                            })
                            .catch((err) => {
                                console.error("Backend error:", err);
                                alert("Failed to fetch product info.");
                            });
                        codeReaderRef.current?.reset();
                    } else if (err) {
                        console.log("No result yet:", err);
                    }
                });
            } catch (e) {
                console.error("Camera error:", e);
                setError("Could not access camera.");
            }
        };

        startScanner();

        return () => {
            if (codeReaderRef.current && typeof codeReaderRef.current.reset === "function") {
                codeReaderRef.current.reset();
            }
        };

    }, [navigate]);

    const handleSwitch = () => {
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.reset === "function"
      ) {
        codeReaderRef.current.reset();
      }
      navigate("/manual-scanner");
    };


    return (
        <div className="barcode-app">
            <h2>Live Barcode Scanner</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <video ref={videoRef} style={{width: "100%", maxWidth: "400px", borderRadius: "8px"}}/>

            <div>
                  <button className="switch-btn" onClick={handleSwitch}>Switch to Manual Entry</button>
            </div>
        </div>
    );
}

export default LiveScanner;
