import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import About from "./components/pages/about/about";
import Contact from "./components/pages/contact/contact";
import Scanner from "./components/pages/barcodeScanner/barcodeScanner";
import Nutrition from "./components/pages/nutrition/nutrition";
import Login from "./components/pages/auth/login/login";
import Register from "./components/pages/auth/register/register";
import BarcodeHistory from "./components/pages/barcodeHistory/barcodeHistory";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/Footer";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/history" element={<PrivateRoute><BarcodeHistory /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
