import { Link, useLocation } from "react-router-dom";

function AdminLayout({ children, title, role = "admin" }) {
    const location = useLocation();

    // ================= ADMIN MENU =================

    const adminMenu = [
        {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: "📊",
        },
        {
            name: "Patients",
            path: "/admin/patients",
            icon: "👤",
        },
        {
            name: "Doctors",
            path: "/admin/doctors",
            icon: "🩺",
        },
        {
            name: "Appointments",
            path: "/admin/appointments",
            icon: "📅",
        },
        {
            name: "Bed & Rooms",
            path: "/bed-room-management",
            icon: "🛏️",
        },
        {
            name: "Departments",
            path: "/admin/departments",
            icon: "🏥",
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: "👥",
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: "📊",
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: "⚙️",
        },
    ];

    // ================= PATIENT MENU =================

    const patientMenu = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            name: "Find Doctors",
            path: "/doctors",
            icon: "🩺",
        },
        {
            name: "Book Appointment",
            path: "/book-appointment",
            icon: "📅",
        },
        {
            name: "My Appointments",
            path: "/appointments",
            icon: "🗓️",
        },
        {
            name: "My Profile",
            path: "/patient-profile",
            icon: "👤",
        },
        {
            name: "Medical Records",
            path: "/medical-records",
            icon: "📋",
        },
        {
            name: "Prescriptions",
            path: "/prescriptions",
            icon: "💊",
        },
        {
            name: "Settings",
            path: "/patient-settings",
            icon: "⚙️",
        },
    ];

    // ================= DOCTOR MENU =================

    const doctorMenu = [
        {
            name: "Dashboard",
            path: "/doctor-dashboard",
            icon: "📊",
        },
        {
            name: "Appointments",
            path: "/doctor-dashboard",
            icon: "📅",
        },
        {
            name: "My Patients",
            path: "/doctor-patients",
            icon: "👤",
        },
        {
            name: "My Profile",
            path: "/doctor-profile",
            icon: "🩺",
        },
        {
            name: "Settings",
            path: "/doctor-settings",
            icon: "⚙️",
        },
    ];

    // ================= RECEPTIONIST MENU =================

    const receptionistMenu = [
        {
            name: "Dashboard",
            path: "/receptionist-dashboard",
            icon: "📊",
        },
        {
            name: "Appointments",
            path: "/receptionist/appointments",
            icon: "📅",
        },
        {
            name: "Patients",
            path: "/receptionist/patients",
            icon: "👤",
        },
        {
            name: "Doctors",
            path: "/receptionist/doctors",
            icon: "🩺",
        },
        {
            name: "Profile",
            path: "/receptionist-profile",
            icon: "👤",
        },
        {
            name: "Settings",
            path: "/receptionist-settings",
            icon: "⚙️",
        },
        {
            name: "Bed & Rooms",
            path: "/bed-room-management",
            icon: "🛏️",
        },
    ];

    // ================= ROLE =================

    let menuItems;
    let roleName;
    let avatar;

    if (role === "patient") {
        menuItems = patientMenu;
        roleName = "Patient";
        avatar = "P";
    } else if (role === "doctor") {
        menuItems = doctorMenu;
        roleName = "Doctor";
        avatar = "D";
    } else if (role === "receptionist") {
        menuItems = receptionistMenu;
        roleName = "Receptionist";
        avatar = "R";
    } else {
        menuItems = adminMenu;
        roleName = "Administrator";
        avatar = "A";
    }

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    // ================= UI =================

    return (
        <div className="admin-layout">

            {/* ================= TOP BAR ================= */}

            <header className="admin-topbar">

                {/* LOGO */}

                <div className="admin-logo">

                    <span className="admin-logo-icon">
                        🏥
                    </span>

                    <span>
                        MediFlow
                    </span>

                </div>


                {/* PROFILE */}

                <div className="admin-top-right">

                    <div className="admin-profile">

                        <div className="admin-avatar">
                            {avatar}
                        </div>

                        <span>
                            {roleName}
                        </span>

                    </div>


                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ================= BODY ================= */}

            <div className="admin-body">

                {/* ================= SIDEBAR ================= */}

                <aside className="admin-sidebar">

                    <div className="sidebar-title">
                        MAIN MENU
                    </div>


                    <nav className="admin-nav">

                        {menuItems.map((item) => {

                            const active =
                                location.pathname ===
                                item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={
                                        active
                                            ? "admin-menu-item active"
                                            : "admin-menu-item"
                                    }
                                >

                                    <span className="menu-icon">
                                        {item.icon}
                                    </span>

                                    <span className="menu-text">
                                        {item.name}
                                    </span>

                                </Link>
                            );

                        })}

                    </nav>


                    {/* ================= SIDEBAR LOGOUT ================= */}

                    <div className="sidebar-bottom">

                        <button
                            className="sidebar-logout"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>

                    </div>

                </aside>


                {/* ================= MAIN CONTENT ================= */}

                <main className="admin-content">

                    {/* PAGE TITLE */}

                    <div className="admin-page-header">

                        <h2>
                            {title}
                        </h2>

                    </div>


                    {/* PAGE CONTENT */}

                    <div className="admin-page-body">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default AdminLayout;