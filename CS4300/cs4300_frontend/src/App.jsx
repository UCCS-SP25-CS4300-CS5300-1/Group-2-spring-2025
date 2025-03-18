import { HashRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import Navbar from "./components/navbar/navbar";
import Scanner from "./components/pages/barcodeScanner/barcodeScanner";
import Nutrition from "./components/pages/nutrition/nutrition";

function App() {
    // <Route path="/scanner" element={<Scanner />} />
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                 <Route path="/" element={<Scanner />} />
                 <Route path="/about" element={ <Home />} />
                 <Route path="nutrition" element={ <Nutrition />} />
             </Routes>
        </BrowserRouter>
    );
}

export default App;