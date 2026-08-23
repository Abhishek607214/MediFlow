import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="home-navbar">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="home-logo-icon">✚</div>

                    <div>
                        <h2>MediFlow</h2>
                        <span>Your Health, Our Priority</span>
                    </div>
                </div>

                <div className="home-nav-links">

                    <button
                        className="active"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/doctors")}
                    >
                        Find Doctors
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("services")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        Services
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("why-mediflow")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        About Us
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("footer")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        Help
                    </button>

                </div>

                <div className="home-nav-actions">

                    <div className="home-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search..."
                        />
                    </div>

                    <button
                        className="nav-login"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="nav-book"
                        onClick={() =>
                            navigate("/book-appointment")
                        }
                    >
                        Book Appointment
                    </button>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="home-hero">

                <div className="hero-circle hero-circle-one"></div>
                <div className="hero-circle hero-circle-two"></div>

                <div className="home-hero-container">

                    {/* LEFT */}

                    <div className="home-hero-content">

                        <div className="home-badge">
                            <span className="home-badge-dot"></span>
                            SMART HEALTHCARE PLATFORM
                        </div>

                        <h1>
                            Healthcare that
                            <span>puts you first.</span>
                        </h1>

                        <p className="home-hero-description">
                            Connect with trusted doctors, book appointments,
                            manage your health information and get the care
                            you need — all from one simple platform.
                        </p>

                        <div className="home-hero-buttons">

                            <button
                                className="home-primary-btn"
                                onClick={() =>
                                    navigate("/doctors")
                                }
                            >
                                Find a Doctor
                                <span>→</span>
                            </button>

                            <button
                                className="home-secondary-btn"
                                onClick={() =>
                                    navigate("/book-appointment")
                                }
                            >
                                Book Appointment
                            </button>

                        </div>


                        {/* TRUST */}

                        <div className="home-trust">

                            <div className="home-patient-avatars">
                                <span>👩🏻</span>
                                <span>👨🏻</span>
                                <span>👩🏼</span>
                                <span>👨🏼</span>
                            </div>

                            <div>
                                <div className="home-stars">
                                    ★ ★ ★ ★ ★
                                </div>

                                <small>
                                    Trusted by thousands of patients
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="home-hero-visual">

                        <div className="home-doctor-card">

                            <div className="home-doctor-card-top">

                                <span>
                                    <i></i>
                                    Available today
                                </span>

                                <span className="home-heart">
                                    ♡
                                </span>

                            </div>

                            <div className="home-doctor-image">
                                👩‍⚕️
                            </div>

                            <div className="home-doctor-info">

                                <div>
                                    <h3>
                                        Expert Healthcare
                                    </h3>

                                    <p>
                                        Qualified professionals
                                    </p>
                                </div>

                                <span className="home-rating">
                                    ★ 4.9
                                </span>

                            </div>

                        </div>


                        {/* FLOATING CARD */}

                        <div className="home-floating-card home-doctors-float">

                            <div className="floating-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    500+
                                </strong>

                                <small>
                                    Verified Doctors
                                </small>
                            </div>

                        </div>


                        {/* SECURITY CARD */}

                        <div className="home-floating-card home-security-float">

                            <div className="floating-icon security">
                                ♡
                            </div>

                            <div>
                                <strong>
                                    100%
                                </strong>

                                <small>
                                    Secure & Private
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= STATS ================= */}

            <section className="home-stats-wrapper">

                <div className="home-stats">

                    <div className="home-stat">
                        <strong>500+</strong>
                        <span>Verified Doctors</span>
                    </div>

                    <div className="home-stat">
                        <strong>10K+</strong>
                        <span>Happy Patients</span>
                    </div>

                    <div className="home-stat">
                        <strong>50+</strong>
                        <span>Medical Specialists</span>
                    </div>

                    <div className="home-stat">
                        <strong>4.9</strong>
                        <span>Average Rating</span>
                    </div>

                </div>

            </section>


            {/* ================= SERVICES ================= */}

            <section
                className="home-services"
                id="services"
            >

                <div className="home-section-heading">

                    <span>
                        WHAT WE OFFER
                    </span>

                    <h2>
                        Everything you need for{" "}
                        <strong>better healthcare.</strong>
                    </h2>

                    <p>
                        MediFlow brings essential healthcare services
                        together in one secure and easy-to-use platform.
                    </p>

                </div>


                <div className="home-service-grid">

                    {/* CARD 1 */}

                    <div className="home-service-card">

                        <div className="home-service-icon blue">
                            ✦
                        </div>

                        <span className="service-number">
                            01
                        </span>

                        <h3>
                            Find Trusted Doctors
                        </h3>

                        <p>
                            Browse qualified doctors by specialization
                            and choose the right healthcare professional
                            for your needs.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/doctors")
                            }
                        >
                            Find Doctors →
                        </button>

                    </div>


                    {/* CARD 2 */}

                    <div className="home-service-card">

                        <div className="home-service-icon">
                            ▦
                        </div>

                        <span className="service-number">
                            02
                        </span>

                        <h3>
                            Easy Appointments
                        </h3>

                        <p>
                            Schedule appointments with your preferred
                            doctor and select convenient available
                            dates and time slots.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/book-appointment")
                            }
                        >
                            Book Appointment →
                        </button>

                    </div>


                    {/* CARD 3 */}

                    <div className="home-service-card">

                        <div className="home-service-icon green">
                            ♡
                        </div>

                        <span className="service-number">
                            03
                        </span>

                        <h3>
                            Secure Health Profile
                        </h3>

                        <p>
                            Keep your personal and medical information
                            organized securely and access it whenever
                            you need it.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/patient-profile")
                            }
                        >
                            Manage Profile →
                        </button>

                    </div>

                </div>

            </section>


            {/* ================= WHY MEDIFLOW ================= */}

            <section
                className="home-why"
                id="why-mediflow"
            >

                <div className="home-section-heading">

                    <span>
                        WHY MEDIFLOW?
                    </span>

                    <h2>
                        Healthcare made <strong>simple.</strong>
                    </h2>

                    <p>
                        Designed to make managing your healthcare
                        easier, faster and more convenient.
                    </p>

                </div>


                <div className="home-why-grid">

                    <div className="home-why-card">
                        <div>🔒</div>

                        <h3>
                            Secure & Private
                        </h3>

                        <p>
                            Your personal and healthcare information
                            is handled with security and privacy in mind.
                        </p>
                    </div>


                    <div className="home-why-card">
                        <div>⚡</div>

                        <h3>
                            Easy Booking
                        </h3>

                        <p>
                            Find doctors and schedule appointments
                            without unnecessary waiting or complexity.
                        </p>
                    </div>


                    <div className="home-why-card">
                        <div>🩺</div>

                        <h3>
                            Trusted Doctors
                        </h3>

                        <p>
                            Discover qualified healthcare professionals
                            across different medical specialties.
                        </p>
                    </div>


                    <div className="home-why-card">
                        <div>📋</div>

                        <h3>
                            Health Management
                        </h3>

                        <p>
                            Keep your healthcare information organized
                            and easily accessible.
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= TESTIMONIALS ================= */}

            <section className="home-testimonials">

                <div className="home-section-heading">

                    <span>
                        PATIENT EXPERIENCES
                    </span>

                    <h2>
                        What our patients say
                    </h2>

                    <p>
                        Simple healthcare experiences from the people
                        who use MediFlow.
                    </p>

                </div>


                <div className="home-testimonial-grid">

                    <div className="home-testimonial-card">

                        <div className="testimonial-stars">
                            ★★★★★
                        </div>

                        <p>
                            "MediFlow made booking my appointment
                            extremely simple. I found a doctor quickly
                            and didn't have to wait."
                        </p>

                        <div className="testimonial-user">

                            <div className="testimonial-avatar">
                                PS
                            </div>

                            <div>
                                <strong>
                                    Priya Sharma
                                </strong>

                                <span>
                                    Verified Patient
                                </span>
                            </div>

                        </div>

                    </div>


                    <div className="home-testimonial-card">

                        <div className="testimonial-stars">
                            ★★★★★
                        </div>

                        <p>
                            "The platform is clean and easy to use.
                            I can manage my appointments and profile
                            from one place."
                        </p>

                        <div className="testimonial-user">

                            <div className="testimonial-avatar">
                                RV
                            </div>

                            <div>
                                <strong>
                                    Rahul Verma
                                </strong>

                                <span>
                                    Verified Patient
                                </span>
                            </div>

                        </div>

                    </div>


                    <div className="home-testimonial-card">

                        <div className="testimonial-stars">
                            ★★★★★
                        </div>

                        <p>
                            "Finding a specialist and booking an
                            appointment was much easier than I expected."
                        </p>

                        <div className="testimonial-user">

                            <div className="testimonial-avatar">
                                AM
                            </div>

                            <div>
                                <strong>
                                    Anjali Mehta
                                </strong>

                                <span>
                                    Verified Patient
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="home-cta">

                <div className="home-cta-content">

                    <div>

                        <span>
                            YOUR HEALTH MATTERS
                        </span>

                        <h2>
                            Ready to take control of your healthcare?
                        </h2>

                        <p>
                            Find the right doctor and book your
                            appointment today.
                        </p>

                    </div>

                    <div className="home-cta-buttons">

                        <button
                            onClick={() =>
                                navigate("/doctors")
                            }
                        >
                            Find a Doctor
                        </button>

                        <button
                            className="cta-outline"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </section>

{/* ================= FOOTER ================= */}
<footer className="home-footer">

    <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

            <div className="footer-logo">
                <span className="footer-logo-icon">+</span>
                <span>MediFlow</span>
            </div>

            <p>
                Modern healthcare made simple.
                Accessible, secure and convenient
                for everyone.
            </p>

            <div className="footer-socials">
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Twitter">𝕏</a>
                <a href="#" aria-label="Instagram">◎</a>
                <a href="#" aria-label="LinkedIn">in</a>
            </div>

        </div>


        {/* Quick Links */}
        <div className="footer-column">

            <h3>Quick Links</h3>

            <span className="footer-line"></span>

            <a href="/">⌂ <span>Home</span></a>
            <a href="/doctors">♙ <span>Find Doctors</span></a>
            <a href="/appointments">▣ <span>Appointments</span></a>
            <a href="/login">⇥ <span>Login</span></a>

        </div>


        {/* Services */}
        <div className="footer-column">

            <h3>Services</h3>

            <span className="footer-line"></span>

            <a href="/doctors">♙ <span>Find Doctors</span></a>
            <a href="/appointments">▣ <span>Online Appointments</span></a>
            <a href="/patient-profile">□ <span>Health Profiles</span></a>
            <a href="/dashboard">▣ <span>Healthcare Management</span></a>

        </div>


        {/* Support */}
        <div className="footer-column">

            <h3>Support</h3>

            <span className="footer-line"></span>

            <a href="#">♧ <span>Help Center</span></a>
            <a href="#">☎ <span>Contact Us</span></a>
            <a href="#">♢ <span>Privacy Policy</span></a>
            <a href="#">▱ <span>Terms of Service</span></a>

        </div>

    </div>


    {/* Bottom Footer */}
    <div className="footer-bottom">

        <div className="footer-bottom-left">
            <span className="footer-bottom-icon">♢</span>
            <span>© 2026 MediFlow. All rights reserved.</span>
        </div>

        <div className="footer-bottom-right">
            <span className="footer-bottom-icon">♡</span>
            <span>Your Health, Our Priority</span>
        </div>

    </div>

</footer>
        </div>
    );
}

export default Home;
