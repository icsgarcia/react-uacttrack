import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DownloadableForms from "./pages/DownloadableForms";
import ExternalLinks from "./pages/ExternalLinks";
import CreateAPF from "./pages/CreateAPF";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route
                            path="/downloadable-forms"
                            element={<DownloadableForms />}
                        />
                        <Route path="/create-apf" element={<CreateAPF />} />
                        <Route
                            path="/external-links"
                            element={<ExternalLinks />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
