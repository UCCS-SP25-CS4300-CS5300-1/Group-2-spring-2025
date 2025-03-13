import React, { useState, useEffect } from "react";
import "./barcodeScanner.css";

function Scanner() {


  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header-content">
          <h1>Food Scanner</h1>
          <p>you can find food</p>
        </div>
      </header>
      <main className="home-main">
        <section className="home-description">
          <h2>Welcome to Food Scanner</h2>
          <p>
            Our app helps you understand what is in the food you are looking to purchase.
            Scan barcodes to get a breakdown of ingredients, health scores, and potential allergens.
          </p>
        </section>
        <section className="home-overview">
          <h2>Overview</h2>
          <p>
            Food Scanner provides a comprehensive look at the foods you consume by scanning barcodes and analyzing ingredients,
            nutritional information, and potential allergens. It’s your go-to app for informed food choices.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Scanner;
