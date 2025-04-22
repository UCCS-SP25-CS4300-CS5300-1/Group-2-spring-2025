import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import About from "./components/pages/about/about";
import Contact from "./components/pages/contact/contact";
import ManualScanner from "./components/pages/barcodeScanner/barcodeScanner";
import LiveScanner from "./components/pages/barcodeScanner/liveScanner";
import Nutrition from "./components/pages/nutrition/nutrition";
import Login from "./components/pages/auth/login/login";
import Register from "./components/pages/auth/register/register";
import BarcodeHistory from "./components/pages/barcodeHistory/barcodeHistory";
import Account from "./components/pages/account/account";
import Compare from "./components/pages/compare/Compare";
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
              <Route path="/manual-scanner" element={<PrivateRoute><ManualScanner /></PrivateRoute>} />
              <Route path="/live-scanner" element={<PrivateRoute><LiveScanner /></PrivateRoute>} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/history" element={<PrivateRoute><BarcodeHistory /></PrivateRoute>} />
              <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
              <Route path="/compare" element={<PrivateRoute><Compare /></PrivateRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
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
