import { HashRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/pages/homePage/home";
import Navbar from "./components/navbar/navbar";
import Scanner from "./components/barcodeScanner/barcodeScanner";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                 <Route path="/" element={<Home />} />
                 <Route path="/scanner" element={<Scanner />} />
             </Routes>
        </BrowserRouter>
    );
}

export default App;