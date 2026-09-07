import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistProfile() {
    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [name, setName] = useState(
        storedUser?.name || ""
    );

    const [email] = useState(
        storedUser?.email || ""
    );

    const [phone, setPhone] = useState(
        storedUser?.phone || ""
    );

    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUser = {
            ...storedUser,
            name,
            phone,
            role: "receptionist"
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setSuccess("Profile information updated successfully.");

        setTimeout(() => {
            setSuccess("");
        }, 3000);
    };

    return (
        <AdminLayout
            title="Receptionist Profile"
            role="receptionist"
        >
            <div className="receptionist-page">

                {/* HEADER */}

                <div className="receptionist-intro">
                    <div>
                        <h1>My Profile</h1>

                        <p>
                            View and manage your receptionist
                            account information.
                        </p>
                    </div>
                </div>

                {/* PROFILE CARD */}

                <div className="receptionist-profile-card">

                    <div className="receptionist-profile-header">

                        <div className="receptionist-profile-avatar">
                            R
                        </div>

                        <div>
                            <h2>
                                {name || "Receptionist"}
                            </h2>

                            <span>
                                Receptionist
                            </span>
                        </div>

                    </div>

                    {success && (
                        <div className="receptionist-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="receptionist-profile-form">

                            {/* NAME */}

                            <div className="receptionist-profile-field">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                />

                            </div>

                            {/* EMAIL */}

                            <div className="receptionist-profile-field">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                />

                                <small>
                                    Email cannot be changed here.
                                </small>

                            </div>

                            {/* PHONE */}

                            <div className="receptionist-profile-field">

                                <label htmlFor="phone">
                                    Phone
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                />

                            </div>

                            {/* ROLE */}

                            <div className="receptionist-profile-field">

                                <label>
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value="Receptionist"
                                    disabled
                                />

                            </div>

                        </div>

                        <div className="receptionist-profile-actions">

                            <button
                                type="submit"
                                className="profile-save-btn"
                            >
                                Save Profile
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </AdminLayout>
    );
}

export default ReceptionistProfile;