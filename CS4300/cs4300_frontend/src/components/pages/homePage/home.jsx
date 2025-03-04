import React from "react";
import "./Home.css";
import foodImage from "../../../assets/foodImage.jpg"; // Ensure the image exists in the path

function Home() {
    return (
        <div className="home">
            <header className="home-header">
                <div className="home-header-content">
                    <h1>Food Scanner</h1>
                    <p>Get better information about the things you eat.</p>
                </div>
            </header>
            <main className="home-main">
                <img src={foodImage} alt="Healthy food" className="home-image" />
                <section className="home-description">
                    <h2>Welcome to Food Scanner</h2>
                    <p>
                        Our app helps you understand what is in the food you are looking to purchase.
                        Scan barcodes to get a breakdown of ingredients, health scores, and potential allergens.
                    </p>
                </section>
            </main>
        </div>
    );
}

export default Home;
