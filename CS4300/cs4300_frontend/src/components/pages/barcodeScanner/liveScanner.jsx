import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./barcodeScanner.css";
import { fetchBarcodeData } from "../barcodeScanner/barcodeScanner.jsx";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";


const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

export default function LiveScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Enumerate available cameras once
  useEffect(() => {
    (async () => {
      try {
        const cams = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!cams.length) {
          setError("No camera devices found.");
        } else {
          setDevices(cams);
          setSelectedDeviceId(cams[0].deviceId);
        }
      } catch (e) {
        console.error("Camera enumeration error:", e);
        setError("Could not enumerate cameras.");
      }
    })();
  }, []);

  // Start or restart scanning on camera change
  useEffect(() => {
    if (!selectedDeviceId) return;

    // cleanup any previous stream
    controlsRef.current?.stop();
    if (videoRef.current) videoRef.current.srcObject = null;

    // set up ZXing reader
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
      BarcodeFormat.UPC_A,
      BarcodeFormat.QR_CODE,
    ]);
    codeReaderRef.current = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 300,
    });

    let active = true;
    codeReaderRef.current.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.current,
      async (result, err, controls) => {
        if (!active) return;
        controlsRef.current = controls;

        if (result) {
          // stop scanning and clear video
          controls.stop();
          if (videoRef.current) videoRef.current.srcObject = null;

          const barcode = result.getText();
          console.log("Barcode scanned:", barcode);

          // ② Delegate to your helper
          const data = await fetchBarcodeData(barcode);

          if (data) {
            if (data.name && !data.name.toLowerCase().includes("unknown")) {
              navigate("/nutrition", { state: { barcodeData: data } });
            } else {
              alert("Product not found.");
            }
          } else {
            alert("Failed to fetch product info.");
          }
        } else if (err) {
          console.log("No result yet:", err);
        }
      }
    );

    return () => {
      active = false;
      controlsRef.current?.stop();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [selectedDeviceId, navigate]);

  // Cycle through devices on button click
  const handleSwitchCamera = () => {
    if (!devices.length) return;
    const idx = devices.findIndex((d) => d.deviceId === selectedDeviceId);
    const next = devices[(idx + 1) % devices.length];
    setSelectedDeviceId(next.deviceId);
  };

  // Switch to manual entry
  const handleManual = () => {
    controlsRef.current?.stop();
    if (videoRef.current) videoRef.current.srcObject = null;
    navigate("/manual-scanner");
  };

  return (
    <div className="barcode-app">
      <h2>Live Barcode Scanner</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Camera swap button */}
      {devices.length > 1 && (
        <button className="switch-btn" onClick={handleSwitchCamera}>
          Switch Camera
        </button>
      )}

      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
        autoPlay
        playsInline
      />

      <button className="switch-btn" onClick={handleManual}>
        Switch to Manual Entry
      </button>
    </div>
  );
}
