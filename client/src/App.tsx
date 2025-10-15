import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DownloadableForms from "./pages/DownloadableForms";
import ExternalLinks from "./pages/ExternalLinks";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Dashboard />} />
                <Route
                    path="/downloadable-forms"
                    element={<DownloadableForms />}
                />
                <Route path="/external-links" element={<ExternalLinks />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
