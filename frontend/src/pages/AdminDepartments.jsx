import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/department.css";

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
    name: "",
    description: ""
});
    // ==========================================
    // GET DEPARTMENTS
    // ==========================================

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/departments",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load departments"
                );
            }

            setDepartments(data.departments || []);

        } catch (error) {
            console.error("DEPARTMENTS ERROR:", error);
            setError(error.message || "Unable to load departments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);


    // ==========================================
    // FORM INPUT
    // ==========================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

// ==========================================
// CREATE / UPDATE DEPARTMENT
// ==========================================

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
        alert("Department name is required");
        return;
    }

    try {
        const url = editingId
            ? `http://localhost:5000/api/departments/${editingId}`
            : "http://localhost:5000/api/departments";

        const method = editingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                (editingId
                    ? "Unable to update department"
                    : "Unable to create department")
            );
        }

        // Reset form
        setFormData({
            name: "",
            description: ""
        });

        setEditingId(null);
        setShowForm(false);

        fetchDepartments();

    } catch (error) {
        console.error(
            editingId
                ? "UPDATE DEPARTMENT ERROR:"
                : "CREATE DEPARTMENT ERROR:",
            error
        );

        alert(error.message);
    }
};

// ==========================================
// EDIT DEPARTMENT
// ==========================================

const handleEdit = (department) => {
    setEditingId(department._id);

    setFormData({
        name: department.name,
        description: department.description || ""
    });

    setShowForm(true);
};
    // ==========================================
    // TOGGLE STATUS
    // ==========================================

    const handleStatusChange = async (department) => {
        const newStatus =
            department.status === "active"
                ? "inactive"
                : "active";

        try {
            const response = await fetch(
                `http://localhost:5000/api/departments/${department._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update status"
                );
            }

            fetchDepartments();

        } catch (error) {
            console.error("STATUS ERROR:", error);
            alert(error.message);
        }
    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/departments/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete department"
                );
            }

            fetchDepartments();

        } catch (error) {
            console.error("DELETE DEPARTMENT ERROR:", error);
            alert(error.message);
        }
    };


    return (
        <AdminLayout title="Department Management">

            <div className="department-page">

                {/* PAGE INTRO */}
                <div className="department-page-intro">
                    <div>
                        <h1>Manage Departments</h1>
                        <p>
                            Create, manage and organize MediFlow departments.
                        </p>
                    </div>

                  <button className="department-add-btn"
                         onClick={() => {
                        setEditingId(null);

                   setFormData({
                               name: "",
                              description: ""
                           });

                      setShowForm(!showForm);
                    }}
                    >
                     + Add Department
                  </button>
                </div>


                {/* ADD DEPARTMENT FORM */}
                {showForm && (
                    <div className="department-form-card">

                       <h2>
                {editingId ? "Edit Department" : "Add Department"}
                      </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="department-form-group">
                                <label>
                                    Department Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiology"
                                />
                            </div>


                            <div className="department-form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter department description..."
                                    rows="3"
                                />
                            </div>


                            <div className="department-form-actions">

                                <button type="button" className="department-cancel-btn"
                                     onClick={() => {
                                            setShowForm(false);
                                            setEditingId(null);

                                         setFormData({
                                              name: "",
                                           description: ""
                                         });
                                        }}
                                   >
                                   Cancel
                               </button>

                              <button
                              type="submit"
                             className="department-save-btn"
                              >
                               {editingId ? "Update Department" : "Save Department"}
                          </button>

                            </div>

                        </form>

                    </div>
                )}


                {/* ERROR */}
                {error && (
                    <div className="department-error">
                        {error}
                    </div>
                )}


                {/* TABLE */}
                <div className="department-table-card">

                    <div className="department-table-header">
                        <h2>
                            Departments ({departments.length})
                        </h2>
                    </div>


                    {loading ? (

                        <div className="department-message">
                            Loading departments...
                        </div>

                    ) : departments.length === 0 ? (

                        <div className="department-message">
                            No departments found.
                        </div>

                    ) : (

                        <div className="department-table-wrapper">

                            <table className="department-table">

                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {departments.map((department) => (

                                        <tr key={department._id}>

                                            <td>
                                                <strong>
                                                    {department.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {department.description ||
                                                    "No description"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`department-status ${department.status}`}
                                                >
                                                    {department.status}
                                                </span>
                                            </td>

                                            <td>

<div className="department-actions">

    {/* EDIT */}
    <button
        className="department-edit-btn"
        onClick={() => handleEdit(department)}
    >
        Edit
    </button>

    {/* ACTIVATE / DEACTIVATE */}
    <button
        className={`department-action-btn ${
            department.status === "active"
                ? "deactivate"
                : "activate"
        }`}
        onClick={() =>
            handleStatusChange(department)
        }
    >
        {department.status === "active"
            ? "Deactivate"
            : "Activate"}
    </button>

    {/* DELETE */}
    <button
        className="department-delete-btn"
        onClick={() =>
            handleDelete(department._id)
        }
    >
        Delete
    </button>

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
};

export default AdminDepartments;