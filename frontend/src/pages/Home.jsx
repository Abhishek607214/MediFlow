import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import Chatbot from "../components/Chatbot";

function Home() {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    };

const services = [
    {
        number: "01",
        icon: "👨‍⚕️",
        title: "Find Trusted Doctors",
        description: "Find qualified doctors across medical specialties.",
        action: "Find Doctors",
        onClick: () => navigate("/doctors")
    },
    {
        number: "02",
        icon: "📅",
        title: "Easy Appointments",
        description: "Book appointments with your preferred doctor.",
        action: "Book Appointment",
        onClick: () => navigate("/book-appointment")
    },
    {
        number: "03",
        icon: "💬",
        title: "Personal Doctor Chat",
        description: "Connect privately with your assigned doctor.",
        action: "View Appointments",
        onClick: () => navigate("/appointments")
    },
    {
        number: "04",
        icon: "📹",
        title: "Video Consultation",
        description: "Consult your doctor through secure online video.",
        action: "View Appointments",
        onClick: () => navigate("/appointments")
    },
    {
        number: "05",
        icon: "📄",
        title: "Medical Reports",
        description: "Access and manage your healthcare reports.",
        action: "Medical Reports",
        onClick: () => navigate("/medical-reports")
    },
    {
        number: "06",
        icon: "👤",
        title: "Health Profile",
        description: "Keep your personal health information organized.",
        action: "Manage Profile",
        onClick: () => navigate("/patient-profile")
    },
    {
        number: "07",
        icon: "🛏️",
        title: "Bed & Room Management",
        description: "Manage hospital beds, rooms and admissions.",
        action: "Hospital Management",
        onClick: () => navigate("/login")
    },
    {
        number: "08",
        icon: "🏥",
        title: "Healthcare Management",
        description: "Manage essential healthcare services in one place.",
        action: "Explore MediFlow",
        onClick: () => scrollToSection("why-mediflow")
    }
];

    const specialties = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "General Medicine"
    ];

    const whyFeatures = [
        {
            icon: "🔒",
            title: "Secure & Private",
            description:
                "Your personal and healthcare information is handled with security and privacy in mind."
        },
        {
            icon: "⚡",
            title: "Easy Booking",
            description:
                "Find doctors and schedule appointments without unnecessary waiting or complexity."
        },
        {
            icon: "🩺",
            title: "Trusted Doctors",
            description:
                "Discover qualified healthcare professionals across different medical specialties."
        },
        {
            icon: "📋",
            title: "Health Management",
            description:
                "Keep your healthcare information organized and easily accessible."
        }
    ];

    const testimonials = [
        {
            initials: "PS",
            name: "Priya Sharma",
            text:
                "MediFlow made booking my appointment extremely simple. I found a doctor quickly and didn't have to wait."
        },
        {
            initials: "RV",
            name: "Rahul Verma",
            text:
                "The platform is clean and easy to use. I can manage my appointments and profile from one place."
        },
        {
            initials: "AM",
            name: "Anjali Mehta",
            text:
                "Finding a specialist and booking an appointment was much easier than I expected."
        }
    ];

    return (
        <div className="home-page">

            {/* ================= UTILITY BAR ================= */}

            <div className="home-utility-bar">

                <div className="home-utility-left">
                    <span>🇮🇳</span>
                    <span>MediFlow Healthcare Platform</span>
                </div>

                <div className="home-utility-right">
                    <span>Emergency Help</span>
                    <span>Accessibility</span>
                    <span>A+</span>
                    <span>A</span>
                    <span>A−</span>
                    <span>English ▾</span>
                </div>

            </div>


            {/* ================= BRAND HEADER ================= */}

            <header className="home-main-header">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="home-logo-icon">
                        +
                    </div>

                    <div>
                        <h2>MediFlow</h2>
                        <span>Your Health, Our Priority</span>
                    </div>
                </div>


                <div className="home-header-actions">

                    <div className="home-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search doctors, services..."
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

            </header>


            {/* ================= NAVIGATION ================= */}

            <nav className="home-navbar">

                <div className="home-nav-links">

                    <button
                        className="active"
                        onClick={() => navigate("/")}
                    >
                        🏠 Home
                    </button>

                    <button
                        onClick={() => navigate("/doctors")}
                    >
                        Find Doctors
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("services")
                        }
                    >
                        Services
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("why-mediflow")
                        }
                    >
                        About Us
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("footer")
                        }
                    >
                        Help
                    </button>

                </div>

            </nav>


{/* ================= HERO ================= */}

<section className="home-hero">

    <div className="home-hero-container">

        <div className="home-hero-content">

            <div className="home-badge">
                <span className="home-badge-dot"></span>
                SMART HEALTHCARE PLATFORM
            </div>

            <p className="hero-welcome">
                WELCOME TO MEDIFLOW
            </p>

            <h1>
                Healthcare that
                <span>puts you first.</span>
            </h1>

            <p className="home-hero-description">
                Connect with trusted doctors, book appointments,
                communicate privately and access digital healthcare
                services — all from one simple platform.
            </p>

            <div className="home-hero-buttons">

                <button
                    className="home-primary-btn"
                    onClick={() => navigate("/doctors")}
                >
                    Find a Doctor
                    <span>→</span>
                </button>

                <button
                    className="home-secondary-btn"
                    onClick={() => navigate("/book-appointment")}
                >
                    Book Appointment
                </button>

            </div>

            <div className="home-trust">

                <div className="home-trust-badges">
                    <span>500+</span>
                    <span>10K+</span>
                    <span>50+</span>
                </div>

                <div>
                    <div className="home-stars">
                        ★ ★ ★ ★ ★
                    </div>

                    <small>
                        Trusted healthcare platform
                    </small>
                </div>

            </div>

        </div>

    </div>

</section>
            {/* ================= QUICK ACCESS ================= */}

            <section className="home-quick-access">

                <div className="quick-access-title">
                    <span>✦</span>
                    <strong>QUICK ACCESS</strong>
                </div>

                <div className="quick-access-items">

                    <button
                        onClick={() => navigate("/doctors")}
                    >
                        👨‍⚕️
                        <span>Find Doctor</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/book-appointment")
                        }
                    >
                        📅
                        <span>Book Appointment</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/appointments")
                        }
                    >
                        📋
                        <span>My Appointments</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/medical-reports")
                        }
                    >
                        📄
                        <span>Medical Reports</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/patient-profile")
                        }
                    >
                        👤
                        <span>Health Profile</span>
                    </button>

                </div>

            </section>


            {/* ================= UPDATE BAR ================= */}

            <section className="home-update-bar">

                <div className="home-update-label">
                    <span>●</span>
                    MEDIFLOW UPDATE
                </div>

                <div className="home-update-content">
                    Personal Doctor Chat • Video Consultation •
                    Medical Reports
                </div>

                <button
                    onClick={() =>
                        navigate("/appointments")
                    }
                >
                    Explore →
                </button>

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

<section className="home-services" id="services">
    <div className="home-section-heading">
        <h2>
            Everything you need for{" "}
            <strong>better healthcare.</strong>
        </h2>

    </div>
    <div className="service-flow">

        {services.map((service, index) => (
            <div
                className={`service-flow-item ${
                    index % 2 === 0 ? "service-up" : "service-down"
                }`}
                key={service.number}
            >

                <div className="service-visual">
                    <div className="service-icon">
                        {service.icon}
                    </div>
                </div>

                <div className="service-number">
                    {service.number}
                </div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <button onClick={service.onClick}>
                    {service.action}
                    <span>→</span>
                </button>

            </div>
        ))}

    </div>

    <div className="services-bottom-cta">
        <div className="services-cta-icon">♥</div>

        <div>
<h3>Ready for better healthcare?</h3>
<p>
    Everything you need, all in one place.
</p>
        </div>

        <button onClick={() => navigate("/register")}>
            Get Started Today →
        </button>
    </div>

</section>

{/* ================= CONNECTED HEALTHCARE GALLERY ================= */}

            <section className="home-gallery-section">

                <div className="home-gallery-heading">
                    <span>CONNECTED HEALTHCARE</span>

                    <h2>
                        Healthcare designed for <strong>real life.</strong>
                    </h2>

                    <p>
                        Connect, consult and manage healthcare in one place.
                    </p>
                </div>

                <div className="home-gallery">

                    {/* 01 - Wide top image */}
                    <div className="gallery-main">
 <img
    src="/image.png"
    alt="Doctor consulting with patient"
/>
                        <div className="gallery-overlay">
                            <small>01</small>
                            <h3>Connected Healthcare</h3>
                            <p>Patients, doctors and healthcare services together.</p>
                            <button onClick={() => navigate("/doctors")}>
                                Explore Healthcare →
                            </button>
                        </div>
                    </div>

                    {/* 02 - Bottom left */}
                    <div className="gallery-small gallery-video">
<img
    src="/video.png"
    alt="Video consultation with doctor"
/>
                        <div className="gallery-overlay">
                            <small>02</small>
                            <h3>Video Consultation</h3>
                            <p>Connect with your doctor online.</p>
                            <button onClick={() => navigate("/appointments")}>
                                View Appointments →
                            </button>
                        </div>
                    </div>

                    {/* 03 - Bottom right */}
                    <div className="gallery-small gallery-hospital">
<img
    src="/bed.png"
    alt="Modern hospital room"
/>

                        <div className="gallery-overlay">
                            <small>03</small>
                            <h3>Smart Hospital</h3>
                            <p>Manage beds, rooms and admissions.</p>
                            <button onClick={() => navigate("/login")}>
                                Hospital Management →
                            </button>
                        </div>
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
                        Healthcare made{" "}
                        <strong>simple.</strong>
                    </h2>

                    <p>
                        Designed to make managing your healthcare
                        easier, faster and more convenient.
                    </p>

                </div>


                <div className="home-why-grid">
{whyFeatures.map((feature) => (
    <div
        className="home-why-card"
        key={feature.title}
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            e.currentTarget.style.setProperty(
                "--mouse-x",
                `${e.clientX - rect.left}px`
            );

            e.currentTarget.style.setProperty(
                "--mouse-y",
                `${e.clientY - rect.top}px`
            );
        }}
    >

                            <div className="why-icon">
                                {feature.icon}
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.description}
                            </p>

                        </div>
                    ))}

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
                        Simple healthcare experiences from people
                        who use MediFlow.
                    </p>

                </div>


                <div className="home-testimonial-grid">

                    {testimonials.map((testimonial) => (
                        <div
                            className="home-testimonial-card"
                            key={testimonial.name}
                        >

                            <div className="testimonial-stars">
                                ★★★★★
                            </div>

                            <p>
                                "{testimonial.text}"
                            </p>

                            <div className="testimonial-user">

                                <div className="testimonial-avatar">
                                    {testimonial.initials}
                                </div>

                                <div>
                                    <strong>
                                        {testimonial.name}
                                    </strong>

                                    <span>
                                        Verified Patient
                                    </span>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* ================= FINAL CTA ================= */}

            <section className="home-cta">

                <div className="home-cta-content">

                    <div>

                        <span>
                            YOUR HEALTH MATTERS
                        </span>

                        <h2>
                            Your healthcare,
                            connected in one place.
                        </h2>

                        <p>
                            Find the right doctor, book your
                            appointment and stay connected with
                            your healthcare team.
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

            <footer
                className="home-footer"
                id="footer"
            >

                <div className="footer-container">

                    <div className="footer-brand">

                        <div className="footer-logo">

                            <span className="footer-logo-icon">
                                +
                            </span>

                            <span>
                                MediFlow
                            </span>

                        </div>

                        <p>
                            Modern healthcare made simple.
                            Accessible, secure and convenient
                            for everyone.
                        </p>

                        <div className="footer-socials">

                            <a
                                href="#"
                                aria-label="Facebook"
                            >
                                f
                            </a>

                            <a
                                href="#"
                                aria-label="Twitter"
                            >
                                𝕏
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                            >
                                ◎
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                            >
                                in
                            </a>

                        </div>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Quick Links
                        </h3>

                        <span className="footer-line"></span>

                        <a
                            href="/"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/");
                            }}
                        >
                            Home
                        </a>

                        <a
                            href="/doctors"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/doctors");
                            }}
                        >
                            Find Doctors
                        </a>

                        <a
                            href="/appointments"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/appointments");
                            }}
                        >
                            Appointments
                        </a>

                        <a
                            href="/login"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Login
                        </a>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Services
                        </h3>

                        <span className="footer-line"></span>

                        <a
                            href="/doctors"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/doctors");
                            }}
                        >
                            Find Doctors
                        </a>

                        <a
                            href="/appointments"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/appointments");
                            }}
                        >
                            Online Appointments
                        </a>

                        <a
                            href="/patient-profile"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/patient-profile");
                            }}
                        >
                            Health Profiles
                        </a>

                        <a
                            href="/medical-reports"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/medical-reports");
                            }}
                        >
                            Medical Reports
                        </a>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Hospital
                        </h3>

                        <span className="footer-line"></span>

                        <a
                            href="/login"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Bed Management
                        </a>

                        <a
                            href="/login"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Room Management
                        </a>

                        <a
                            href="/login"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Admissions
                        </a>

                        <a
                            href="/login"
                            onClick={(event) => {
                                event.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Billing
                        </a>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Support
                        </h3>

                        <span className="footer-line"></span>

                        <a href="#">
                            Help Center
                        </a>

                        <a href="#">
                            Contact Us
                        </a>

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Terms of Service
                        </a>

                    </div>

                </div>


                <div className="footer-bottom">

                    <div className="footer-bottom-left">
                        <span>
                            © 2026 MediFlow. All rights reserved.
                        </span>
                    </div>

                    <div className="footer-bottom-right">
                        <span>
                            Your Health, Our Priority
                        </span>
                    </div>

                </div>

            </footer>


            {/* ================= CHATBOT ================= */}

            <Chatbot />

        </div>
    );
}

export default Home;