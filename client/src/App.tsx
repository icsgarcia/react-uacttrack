import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DownloadableForms from "./pages/DownloadableForms";
import ExternalLinks from "./pages/ExternalLinks";
import CreateAPF from "./pages/CreateAPF";
import PendingAPF from "./pages/PendingAPF";
import ApprovedAPF from "./pages/ApprovedAPF";
import RejectedAPF from "./pages/RejectedAPF";
import APF from "./pages/APF";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

function App() {
    const queryClient = new QueryClient();
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Routes>
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>

                        <Route
                            element={<ProtectedRoute allowedRoles={["USER"]} />}
                        >
                            <Route path="/" element={<Dashboard />} />
                            <Route
                                path="/downloadable-forms"
                                element={<DownloadableForms />}
                            />
                            <Route path="/create-apf" element={<CreateAPF />} />
                            <Route path="/apf/:id" element={<APF />} />
                            <Route
                                path="/pending-apf"
                                element={<PendingAPF />}
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
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
