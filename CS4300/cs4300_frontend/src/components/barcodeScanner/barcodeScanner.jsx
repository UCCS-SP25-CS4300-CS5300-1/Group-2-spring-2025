import React, { useState, useEffect } from "react";
import "./barcodeScanner.css";

function Scanner() {


  return (
    <div class="barcode-app">
      <h2>Barcode Scanner</h2>
      <div class="input-group">
        <label for="barcode-image">Upload Barcode Image:</label>
        <div> </div>
        <input type="file" id="barcode-image" accept="image/*"></input>
      </div>
      <button class="scan-btn">Scan Barcode</button>
    </div>
  );
}

export default Scanner;
