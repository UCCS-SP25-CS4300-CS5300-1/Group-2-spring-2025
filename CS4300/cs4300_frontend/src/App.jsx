import { HashRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import Navbar from "./components/navbar/navbar";
import Scanner from "./components/pages/barcodeScanner/barcodeScanner";
import Nutrition from "./components/pages/nutrition/nutrition";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                 <Route path="/Group-2-spring-2025/" element={<Scanner />} />
                 <Route path="/Group-2-spring-2025/about" element={ <Home />} />
                 <Route path="/Group-2-spring-2025/nutrition" element={ <Nutrition />} />
             </Routes>
        </BrowserRouter>
    );
}

export default App;