import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DownloadableForms from "./pages/DownloadableForms";
import ExternalLinks from "./pages/ExternalLinks";
import CreateAPF from "./pages/CreateAPF";
import SubmittedAPF from "./pages/SubmittedAPF";
import ApprovedAPF from "./pages/ApprovedAPF";
import RejectedAPF from "./pages/RejectedAPF";

function App() {
    const queryClient = new QueryClient();
    return (
        <AuthProvider>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
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
                                path="/submitted-apf"
                                element={<SubmittedAPF />}
                            />
                            <Route
                                path="/external-links"
                                element={<ExternalLinks />}
                            />
                            <Route
                                path="/approved-apf"
                                element={<ApprovedAPF />}
                            />

                            <Route
                                path="/rejected-apf"
                                element={<RejectedAPF />}
                            />
                        </Route>
                    </Routes>
                </QueryClientProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
