import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("LOGIN RESPONSE:", response.data);

            if (response.data.success) {
                const user = response.data.user;

                console.log("USER SAVED:", user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                if (user.role === "admin") {
                    window.location.href = "/admin-dashboard";
                } else if (user.role === "doctor") {
                    window.location.href = "/doctor-dashboard";
                } else if (user.role === "receptionist") {
                    window.location.href = "/receptionist-dashboard";
                } else if (user.role === "patient") {
                    window.location.href = "/dashboard";
                } else {
                    setError("Unknown user role");
                }
            } else {
                setError(
                    response.data.message ||
                    "Login failed"
                );
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* =========================
                LEFT BRANDING
            ========================= */}
            <div className="auth-brand-panel">

                <div className="auth-brand">
                    <div className="auth-brand-logo">
                        ✚
                    </div>

                    <div>
                        <h1>
                            Medi<span>Flow</span>
                        </h1>

                        <p>
                            Hospital Management System
                        </p>
                    </div>
                </div>

                <div className="auth-brand-content">

                    <h2>
                        Better Care,
                        <br />
                        <strong>
                            Smarter Management
                        </strong>
                    </h2>

                    <p>
                        Seamless appointments, efficient hospital
                        management and improved patient care —
                        all in one place.
                    </p>

                    <div className="auth-benefits">

                        <div>
                            <span>📅</span>
                            <p>
                                <strong>Book</strong>
                                <br />
                                Appointments
                            </p>
                        </div>

                        <div>
                            <span>🩺</span>
                            <p>
                                <strong>Consult</strong>
                                <br />
                                Doctors
                            </p>
                        </div>

                        <div>
                            <span>🏥</span>
                            <p>
                                <strong>Manage</strong>
                                <br />
                                Hospital
                            </p>
                        </div>

                        <div>
                            <span>♥</span>
                            <p>
                                <strong>Better</strong>
                                <br />
                                Health
                            </p>
                        </div>

                    </div>
                </div>

            </div>


            {/* =========================
                RIGHT LOGIN
            ========================= */}
            <div className="auth-form-area">

                <div className="auth-top-link">
                    Don't have an account?

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Create account
                    </button>
                </div>


                <div className="login-card">

                    <div className="auth-card-logo">
                        ✚
                    </div>

                    <h2>
                        Welcome Back 👋
                    </h2>

                    <p className="auth-subtitle">
                        Login to your MediFlow account
                    </p>


                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleLogin}>

                        <div className="auth-input-group">
                            <span>✉️</span>

                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>


                        <div className="auth-input-group">
                            <span>🔒</span>

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login  →"}
                        </button>

                    </form>


                    <p className="register-link">
                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create account
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;