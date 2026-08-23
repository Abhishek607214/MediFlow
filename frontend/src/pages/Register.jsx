import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

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
            console.error(
                "REGISTER ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>MediFlow</h1>

                <h2>Create Account</h2>

                <p>
                    Register to manage your healthcare
                    appointments.
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

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
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
    );
}

export default Register;
