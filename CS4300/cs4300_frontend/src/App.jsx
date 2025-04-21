import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import About from "./components/pages/about/about"
import Contact from "./components/pages/contact/contact"
import Navbar from "./components/navbar/navbar";
import ManualScanner from "./components/pages/barcodeScanner/barcodeScanner.jsx";
import Nutrition from "./components/pages/nutrition/nutrition";
import Login from "./components/pages/auth/login/login.jsx";
import Register from "./components/pages/auth/register/register.jsx";
import Account from "./components/pages/account/account.jsx";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import BarcodeHistory from "./components/pages/barcodeHistory/barcodeHistory.jsx";
import "./App.css";
import compare from "./components/pages/compare/Compare.jsx";
import Compare from "./components/pages/compare/Compare.jsx";
import LiveScanner from "./components/pages/barcodeScanner/liveScanner.jsx";

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Navbar />
                <Routes>
                    <Route path="/manual-scanner" element={<PrivateRoute><ManualScanner /></PrivateRoute>} />
                    <Route path="/live-scanner" element={<LiveScanner />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/history" element={<PrivateRoute><BarcodeHistory /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/compare" element={<Compare/>} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;