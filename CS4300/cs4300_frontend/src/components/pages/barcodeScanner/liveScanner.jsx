import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./barcodeScanner.css";
import { fetchBarcodeData } from "../barcodeScanner/barcodeScanner.jsx";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";

export default function LiveScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get available video input devices
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

  // Start scanning on device change
  useEffect(() => {
    if (!selectedDeviceId) return;

    // Cleanup previous instance
    controlsRef.current?.stop();
    if (videoRef.current) videoRef.current.srcObject = null;

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
          controls.stop();
          if (videoRef.current) videoRef.current.srcObject = null;

          const barcode = result.getText();
          const data = await fetchBarcodeData(barcode);

          if (data && data.name && !data.name.toLowerCase().includes("unknown")) {
            navigate("/nutrition", { state: { barcodeData: data } });
          } else {
            alert("Product not found.");
          }
        } else if (err) {
          console.log("Scanning...", err?.message || err);
        }
      }
    );

    return () => {
      active = false;
      controlsRef.current?.stop();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [selectedDeviceId, navigate]);

  const handleSwitchCamera = () => {
    if (!devices.length) return;
    const idx = devices.findIndex((d) => d.deviceId === selectedDeviceId);
    const next = devices[(idx + 1) % devices.length];
    setSelectedDeviceId(next.deviceId);
  };

  const handleManual = () => {
    controlsRef.current?.stop();
    if (videoRef.current) videoRef.current.srcObject = null;
    navigate("/manual-scanner");
  };

  return (
    <div className="barcode-app">
      <h2>Live Barcode Scanner</h2>
      {error && <p className="error-text">{error}</p>}

      <video
        ref={videoRef}
        className="live-video"
        autoPlay
        playsInline
      />

      <div className="scanner-button-group">
        {devices.length > 1 && (
          <button className="switch-btn" onClick={handleSwitchCamera}>
            Switch Camera
          </button>
        )}
        <button className="switch-btn" onClick={handleManual}>
          Switch to Manual Entry
        </button>
      </div>
    </div>
  );
}
