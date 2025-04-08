import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import Navbar from "./components/navbar/navbar";
import Scanner from "./components/pages/barcodeScanner/barcodeScanner";
import Nutrition from "./components/pages/nutrition/nutrition";
import Login from "./components/pages/auth/login/login.jsx";
import Register from "./components/pages/auth/register/register.jsx";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import BarcodeHistory from "./components/pages/barcodeHistory/barcodeHistory.jsx";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Navbar />
                <Routes>
                    <Route path="/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
                    <Route path="/about" element={<Home />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/history" element={<PrivateRoute><BarcodeHistory /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;