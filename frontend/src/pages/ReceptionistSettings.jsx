import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistSettings() {
    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [appointmentAlerts, setAppointmentAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [success, setSuccess] = useState("");

    // ================= LOAD SETTINGS =================

    useEffect(() => {
        const savedSettings = JSON.parse(
            localStorage.getItem("receptionistSettings") || "null"
        );

        if (savedSettings) {
            setNotifications(
                savedSettings.notifications ?? true
            );

            setEmailNotifications(
                savedSettings.emailNotifications ?? true
            );

            setAppointmentAlerts(
                savedSettings.appointmentAlerts ?? true
            );

            setDarkMode(
                savedSettings.darkMode ?? false
            );
        }
    }, []);

    // ================= SAVE SETTINGS =================

    const handleSave = () => {
        const settings = {
            notifications,
            emailNotifications,
            appointmentAlerts,
            darkMode
        };

        localStorage.setItem(
            "receptionistSettings",
            JSON.stringify(settings)
        );

        setSuccess("Settings saved successfully.");

        setTimeout(() => {
            setSuccess("");
        }, 3000);
    };

    return (
        <AdminLayout
            title="Receptionist Settings"
            role="receptionist"
        >
            <div className="receptionist-page">

                {/* HEADER */}

                <div className="receptionist-intro">
                    <div>
                        <h1>Settings</h1>

                        <p>
                            Manage your receptionist account
                            preferences.
                        </p>
                    </div>
                </div>

                {/* SUCCESS */}

                {success && (
                    <div className="receptionist-success">
                        {success}
                    </div>
                )}

                {/* NOTIFICATIONS */}

                <div className="receptionist-settings-card">

                    <div className="receptionist-settings-heading">
                        <div className="settings-icon">
                            🔔
                        </div>

                        <div>
                            <h2>Notifications</h2>

                            <p>
                                Manage how you receive
                                important hospital updates.
                            </p>
                        </div>
                    </div>

                    <div className="receptionist-setting-list">

                        <div className="receptionist-setting-item">

                            <div>
                                <strong>
                                    Enable Notifications
                                </strong>

                                <span>
                                    Receive important
                                    receptionist notifications.
                                </span>
                            </div>

                            <label className="receptionist-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) =>
                                        setNotifications(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="receptionist-slider"></span>
                            </label>

                        </div>

                        <div className="receptionist-setting-item">

                            <div>
                                <strong>
                                    Email Notifications
                                </strong>

                                <span>
                                    Receive updates through
                                    your registered email.
                                </span>
                            </div>

                            <label className="receptionist-switch">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) =>
                                        setEmailNotifications(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="receptionist-slider"></span>
                            </label>

                        </div>

                        <div className="receptionist-setting-item">

                            <div>
                                <strong>
                                    Appointment Alerts
                                </strong>

                                <span>
                                    Get alerts about new and
                                    updated appointments.
                                </span>
                            </div>

                            <label className="receptionist-switch">
                                <input
                                    type="checkbox"
                                    checked={appointmentAlerts}
                                    onChange={(e) =>
                                        setAppointmentAlerts(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="receptionist-slider"></span>
                            </label>

                        </div>

                    </div>

                </div>

                {/* APPEARANCE */}

                <div className="receptionist-settings-card">

                    <div className="receptionist-settings-heading">
                        <div className="settings-icon">
                            🎨
                        </div>

                        <div>
                            <h2>Appearance</h2>

                            <p>
                                Customize your dashboard
                                appearance.
                            </p>
                        </div>
                    </div>

                    <div className="receptionist-setting-item">

                        <div>
                            <strong>
                                Dark Mode
                            </strong>

                            <span>
                                Use dark appearance for the
                                receptionist dashboard.
                            </span>
                        </div>

                        <label className="receptionist-switch">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) =>
                                    setDarkMode(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="receptionist-slider"></span>
                        </label>

                    </div>

                </div>

                {/* ACCOUNT SECURITY */}

                <div className="receptionist-settings-card">

                    <div className="receptionist-settings-heading">
                        <div className="settings-icon">
                            🔐
                        </div>

                        <div>
                            <h2>Account & Security</h2>

                            <p>
                                Information about your
                                receptionist account.
                            </p>
                        </div>
                    </div>

                    <div className="receptionist-security-info">

                        <div>
                            <span>Account Role</span>
                            <strong>Receptionist</strong>
                        </div>

                        <div>
                            <span>Authentication</span>
                            <strong>JWT Secure Login</strong>
                        </div>

                        <div>
                            <span>Session</span>
                            <strong>HTTP-only Cookie</strong>
                        </div>

                    </div>

                </div>

                {/* SAVE */}

                <div className="receptionist-settings-actions">

                    <button
                        className="profile-save-btn"
                        onClick={handleSave}
                    >
                        Save Settings
                    </button>

                </div>

            </div>
        </AdminLayout>
    );
}

export default ReceptionistSettings;