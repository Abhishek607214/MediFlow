import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-users.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users", {
                params: {
                    search,
                    role
                }
            });

            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                setError(
                    response.data.message ||
                    "Unable to load users"
                );
            }
        } catch (error) {
            console.error("USERS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            await api.patch(
                `/admin/users/${userId}/status`,
                {
                    isActive: !currentStatus
                }
            );

            fetchUsers();
        } catch (error) {
            console.error(
                "USER STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update user status"
            );
        }
    };

    const handleDelete = async (userId, userName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/users/${userId}`
            );

            fetchUsers();
        } catch (error) {
            console.error(
                "DELETE USER ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };

    return (
        <AdminLayout
            title="User Management"
            role="admin"
        >
            <div className="user-page">

                {/* SEARCH & FILTER */}
                <div className="user-search-box">

                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search user by name, email or phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <button type="submit">
                            Search
                        </button>
                    </form>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                        <option value="doctor">
                            Doctor
                        </option>

                        <option value="patient">
                            Patient
                        </option>

                        <option value="receptionist">
                            Receptionist
                        </option>
                    </select>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* TABLE */}
                <div className="user-table-card">

                    <h2>
                        Users ({users.length})
                    </h2>

                    {loading ? (
                        <p>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <div className="user-table-wrapper">
                            <table className="user-table">

                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Account</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>

                                            <td>
                                                <div className="user-person">
                                                    <strong>
                                                        {user.name}
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.phone || "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`user-role ${user.role}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        user.isActive
                                                            ? "user-status active"
                                                            : "user-status inactive"
                                                    }
                                                >
                                                    {user.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="user-actions">

                                                 {user.role !== "admin" && (
                                          <button
                                     className={
                                           user.isActive
                                            ? "user-action-btn deactivate"
                                            : "user-action-btn activate"
                                            }
                                     onClick={() =>
                                     handleStatusChange(
                                      user._id,
                                      user.isActive
                                     )
                                     }
                                    >
                                  {user.isActive
                                       ? "Deactivate"
                                        : "Activate"}
                                         </button>
                                        )}
                                                    {user.role !== "admin" && (
                                                        <button
                                                            className="user-action-btn delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id,
                                                                    user.name
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    )}

                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}

                </div>

            </div>
        </AdminLayout>
    );
}

export default AdminUsers;