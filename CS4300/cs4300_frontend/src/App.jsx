import { HashRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import Navbar from "./components/navbar/navbar";
import Scanner from "./components/pages/barcodeScanner/barcodeScanner";
import Nutrition from "./components/pages/nutrition/nutrition";
import Login from "./components/pages/auth/login/login.jsx";
import Register from "./components/pages/auth/register/register.jsx";
import {PrivateRoute} from "./components/PrivateRoute/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
                     <Route path="/about" element={ <Home />} />
                     <Route path="/nutrition" element={ <Nutrition />} />
                     <Route path="/login" element={<Login />} />
                     <Route path="/register" element={<Register />} />

                     <Route path="*" element={<Home />} />
                 </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;