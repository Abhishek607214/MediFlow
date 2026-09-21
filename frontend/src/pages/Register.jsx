import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("patient");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                phone,
                password,
                role
            });

            console.log("REGISTER RESPONSE:", response.data);

            if (response.data.success) {
                setSuccess(
                    "Registration successful. Please login."
                );

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                setError(
                    response.data.message ||
                    "Registration failed"
                );
            }
        } catch (error) {
            console.error("REGISTER ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    const roleName =
        role === "doctor"
            ? "Doctor"
            : role === "receptionist"
            ? "Receptionist"
            : "Patient";

    return (
        <div className="auth-page">

            {/* LEFT BRANDING */}
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
                        Join MediFlow and manage your healthcare
                        appointments and services easily.
                    </p>


                    <div className="auth-benefits">

                        <div>
                            <span>📅</span>
                            <p>
                                <strong>Easy</strong>
                                <br />
                                Appointments
                            </p>
                        </div>

                        <div>
                            <span>🩺</span>
                            <p>
                                <strong>Trusted</strong>
                                <br />
                                Doctors
                            </p>
                        </div>

                        <div>
                            <span>🏥</span>
                            <p>
                                <strong>Smart</strong>
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


            {/* RIGHT REGISTER */}
            <div className="auth-form-area">

                <div className="auth-top-link">

                    Already have an account?

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </button>

                </div>


                <div className="login-card">

                    <div className="auth-card-logo">
                        ✚
                    </div>


                    <h2>
                        Create Account
                    </h2>

                    <p className="auth-subtitle">
                        Register to manage your healthcare
                        appointments
                    </p>


                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}


                    {/* ROLE */}
                    <div className="role-section">

                        <label>
                            Register as
                        </label>

                        <div className="role-buttons">

                            <button
                                type="button"
                                className={
                                    role === "patient"
                                        ? "role-btn active"
                                        : "role-btn"
                                }
                                onClick={() =>
                                    setRole("patient")
                                }
                            >
                                <span>👤</span>
                                Patient
                            </button>


                            <button
                                type="button"
                                className={
                                    role === "doctor"
                                        ? "role-btn active"
                                        : "role-btn"
                                }
                                onClick={() =>
                                    setRole("doctor")
                                }
                            >
                                <span>🩺</span>
                                Doctor
                            </button>


                            <button
                                type="button"
                                className={
                                    role === "receptionist"
                                        ? "role-btn active"
                                        : "role-btn"
                                }
                                onClick={() =>
                                    setRole("receptionist")
                                }
                            >
                                <span>👨‍💼</span>
                                Receptionist
                            </button>

                        </div>

                    </div>


                    <form onSubmit={handleRegister}>

                        {/* NAME */}
                        <div className="auth-input-group">

                            <span>👤</span>

                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* EMAIL */}
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


                        {/* PHONE */}
                        <div className="auth-input-group">

                            <span>📱</span>

                            <input
                                type="tel"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* PASSWORD */}
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
                                ? "Creating Account..."
                                : `Register as ${roleName} →`
                            }
                        </button>

                    </form>


                    <p className="register-link">

                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            Login
                        </button>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;