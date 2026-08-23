import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

             console.log("USER SAVED:",user);

             localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

           if (user.role === "doctor") {
                    window.location.href = "/doctor-dashboard";
               } else {
                   window.location.href = "/dashboard";
               }
            }
            else {
                setError(response.data.message || "Login failed");
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
        <div className="login-container">

            <div className="login-card">

                <h1>MediFlow</h1>

                <h2>Login</h2>

                <p>Login to manage your healthcare appointments.</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                 
                </form>
                <p className="register-link">
                   Don't have an account?{" "}
                <button
                   type="button"
                   onClick={() => navigate("/register")}
                   >
                 Register
               </button>
                </p>

            </div>

        </div>
    );
}

export default Login;