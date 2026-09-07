import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/bed-room.css";

function BedRoomManagement() {
    const [dashboard, setDashboard] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [availableBeds, setAvailableBeds] = useState([]);
    const [admissions, setAdmissions] = useState([]);

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] =
        useState("dashboard");

    const [showRoomModal, setShowRoomModal] =
    useState(false);

const [showBedModal, setShowBedModal] =
    useState(false);

const [showAdmissionModal, setShowAdmissionModal] =
    useState(false);

const [showDischargeModal, setShowDischargeModal] =
    useState(false);

const [showTransferModal, setShowTransferModal] =
    useState(false);

const [showDetailsModal, setShowDetailsModal] =
    useState(false);

const [selectedDetailsAdmission, setSelectedDetailsAdmission] =
    useState(null);

const [detailsLoading, setDetailsLoading] =
    useState(false);

const [showBillModal, setShowBillModal] =
    useState(false);

const [selectedBillAdmission, setSelectedBillAdmission] =
    useState(null);

const [selectedAdmission, setSelectedAdmission] =
    useState(null);

const [selectedTransferAdmission, setSelectedTransferAdmission] =
    useState(null);

const [transferForm, setTransferForm] =
    useState({
        newBed: "",
        reason: ""
    });

    const [roomForm, setRoomForm] = useState({
        roomNumber: "",
        roomType: "General",
        floor: "",
        capacity: "",
        dailyRate: "",
        description: ""
    });

    const [bedForm, setBedForm] = useState({
        bedNumber: "",
        room: "",
        notes: ""
    });

    const [admissionForm, setAdmissionForm] =
        useState({
            patient: "",
            doctor: "",
            bed: "",
            admissionDate:
                new Date().toISOString().split("T")[0],
            admissionNotes: ""
        });

    const [dischargeForm, setDischargeForm] =
        useState({
            dischargeDate:
                new Date().toISOString().split("T")[0],
            dischargeNotes: ""
        });

    const [submitting, setSubmitting] =
        useState(false);

    // =====================================================
    // GET USER ROLE
    // =====================================================

    const getCurrentRole = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return user?.role || "admin";
        } catch {
            return "admin";
        }
    };

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {
        const response = await api.get(
            "/bed-rooms/dashboard"
        );

        if (response.data.success) {
            setDashboard(response.data);
        }
    };

    // =====================================================
    // LOAD ROOMS
    // =====================================================

    const loadRooms = async () => {
        const response = await api.get(
            "/bed-rooms/rooms"
        );

        if (response.data.success) {
            setRooms(response.data.rooms);
        }
    };

    // =====================================================
    // LOAD BEDS
    // =====================================================

    const loadBeds = async () => {
        const response = await api.get(
            "/bed-rooms/beds"
        );

        if (response.data.success) {
            setBeds(response.data.beds);
        }
    };

    // =====================================================
    // LOAD AVAILABLE BEDS
    // =====================================================

    const loadAvailableBeds = async () => {
        const response = await api.get(
            "/bed-rooms/beds/available"
        );

        if (response.data.success) {
            setAvailableBeds(
                response.data.beds
            );
        }
    };

    // =====================================================
    // LOAD ADMISSIONS
    // =====================================================

    const loadAdmissions = async () => {
        const response = await api.get(
            "/bed-rooms/admissions?status=all"
        );

        if (response.data.success) {
            setAdmissions(
                response.data.admissions
            );
        }
    };

    // =====================================================
    // LOAD PATIENTS
    // =====================================================

    const loadPatients = async () => {
        try {
            const role = getCurrentRole();

            let response;

            if (role === "receptionist") {
                response = await api.get(
                    "/receptionist/patients"
                );
            } else {
                response = await api.get(
                    "/admin/patients"
                );
            }

            if (response.data.success) {
                setPatients(
                    response.data.patients || []
                );
            }
        } catch (error) {
            console.error(
                "Patients loading error:",
                error
            );
        }
    };

    // =====================================================
    // LOAD DOCTORS
    // =====================================================

    const loadDoctors = async () => {
        try {
            const response = await api.get(
                "/doctors"
            );

            if (response.data.success) {
                setDoctors(
                    response.data.doctors || []
                );
            }
        } catch (error) {
            console.error(
                "Doctors loading error:",
                error
            );
        }
    };

    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                loadDashboard(),
                loadRooms(),
                loadBeds(),
                loadAvailableBeds(),
                loadAdmissions(),
                loadPatients(),
                loadDoctors()
            ]);
        } catch (error) {
            console.error(
                "Bed room data error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load Bed & Room Management"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =====================================================
    // REFRESH
    // =====================================================

    const refreshData = async () => {
        await loadData();
    };

    // =====================================================
    // ROOM FORM
    // =====================================================

    const handleRoomChange = (e) => {
        setRoomForm({
            ...roomForm,
            [e.target.name]: e.target.value
        });
    };

    // =====================================================
    // CREATE ROOM
    // =====================================================

    const createRoom = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const response = await api.post(
                "/bed-rooms/rooms",
                {
                    ...roomForm,
                    capacity: Number(
                        roomForm.capacity
                    ),
                    dailyRate: Number(
                        roomForm.dailyRate
                    )
                }
            );

            if (response.data.success) {
                alert(
                    "Room created successfully"
                );

                setShowRoomModal(false);

                setRoomForm({
                    roomNumber: "",
                    roomType: "General",
                    floor: "",
                    capacity: "",
                    dailyRate: "",
                    description: ""
                });

                await loadData();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to create room"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // BED FORM
    // =====================================================

    const handleBedChange = (e) => {
        setBedForm({
            ...bedForm,
            [e.target.name]: e.target.value
        });
    };

    // =====================================================
    // CREATE BED
    // =====================================================

    const createBed = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const response = await api.post(
                "/bed-rooms/beds",
                bedForm
            );

            if (response.data.success) {
                alert(
                    "Bed created successfully"
                );

                setShowBedModal(false);

                setBedForm({
                    bedNumber: "",
                    room: "",
                    notes: ""
                });

                await loadData();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to create bed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // ADMISSION FORM
    // =====================================================

    const handleAdmissionChange = (e) => {
        setAdmissionForm({
            ...admissionForm,
            [e.target.name]: e.target.value
        });
    };

    // =====================================================
    // SELECTED BED
    // =====================================================

    const selectedBed =
        availableBeds.find(
            (bed) =>
                bed._id === admissionForm.bed
        );

    // =====================================================
    // ADMIT PATIENT
    // =====================================================

    const admitPatient = async (e) => {
        e.preventDefault();

        if (
            !admissionForm.patient ||
            !admissionForm.bed
        ) {
            alert(
                "Please select a patient and available bed"
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await api.post(
                "/bed-rooms/admissions",
                admissionForm
            );

            if (response.data.success) {
                alert(
                    "Patient admitted successfully"
                );

                setShowAdmissionModal(false);

                setAdmissionForm({
                    patient: "",
                    doctor: "",
                    bed: "",
                    admissionDate:
                        new Date()
                            .toISOString()
                            .split("T")[0],
                    admissionNotes: ""
                });

                await loadData();

                setActiveTab(
                    "admissions"
                );
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to admit patient"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // OPEN DISCHARGE
    // =====================================================

    const openDischarge = (admission) => {
        setSelectedAdmission(
            admission
        );

        setDischargeForm({
            dischargeDate:
                new Date()
                    .toISOString()
                    .split("T")[0],
            dischargeNotes: ""
        });

        setShowDischargeModal(true);
    };

    // =====================================================
    // DISCHARGE FORM
    // =====================================================

    const handleDischargeChange = (e) => {
        setDischargeForm({
            ...dischargeForm,
            [e.target.name]: e.target.value
        });
    };

    // =====================================================
    // DISCHARGE PATIENT
    // =====================================================

    const dischargePatient = async (e) => {
        e.preventDefault();

        if (!selectedAdmission) {
            return;
        }

        try {
            setSubmitting(true);

            const response = await api.put(
                `/bed-rooms/admissions/${selectedAdmission._id}/discharge`,
                dischargeForm
            );

            if (response.data.success) {
                const admission =
                    response.data.admission;

                alert(
                    `Patient discharged successfully.\n\nRoom Charges: ₹${Number(
                        admission.roomCharges || 0
                    ).toLocaleString()}`
                );

                setShowDischargeModal(false);
                setSelectedAdmission(null);

                await loadData();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to discharge patient"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
// OPEN TRANSFER MODAL
// =====================================================

const openTransfer = (admission) => {
    setSelectedTransferAdmission(
        admission
    );

    setTransferForm({
        newBed: "",
        reason: ""
    });

    setShowTransferModal(true);
};

// =====================================================
// OPEN ADMISSION DETAILS
// =====================================================

const openAdmissionDetails = async (
    admission
) => {
    try {
        setDetailsLoading(true);

        setSelectedDetailsAdmission(
            admission
        );

        setShowDetailsModal(true);

        const response = await api.get(
            `/bed-rooms/admissions/${admission._id}`
        );

        if (response.data.success) {
            setSelectedDetailsAdmission(
                response.data.admission
            );
        }
    } catch (error) {
        console.error(
            "Admission details error:",
            error
        );

        alert(
            error.response?.data?.message ||
                "Failed to load admission details"
        );

        setShowDetailsModal(false);
    } finally {
        setDetailsLoading(false);
    }
};

// =====================================================
// OPEN ROOM BILL
// =====================================================

const openRoomBill = (admission) => {
    setSelectedBillAdmission(admission);
    setShowBillModal(true);
};
// =====================================================
// TRANSFER FORM CHANGE
// =====================================================

const handleTransferChange = (e) => {
    setTransferForm({
        ...transferForm,
        [e.target.name]: e.target.value
    });
};


// =====================================================
// TRANSFER PATIENT
// =====================================================

const transferPatient = async (e) => {
    e.preventDefault();

    if (
        !selectedTransferAdmission ||
        !transferForm.newBed
    ) {
        alert(
            "Please select a destination bed"
        );

        return;
    }

    try {
        setSubmitting(true);

        const response = await api.put(
            `/bed-rooms/admissions/${selectedTransferAdmission._id}/transfer`,
            transferForm
        );

        if (response.data.success) {
            alert(
                "Patient transferred successfully"
            );

            setShowTransferModal(false);

            setSelectedTransferAdmission(
                null
            );

            setTransferForm({
                newBed: "",
                reason: ""
            });

            await loadData();
        }
    } catch (error) {
        alert(
            error.response?.data?.message ||
                "Failed to transfer patient"
        );
    } finally {
        setSubmitting(false);
    }
};
    // =====================================================
    // BED STATUS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "available":
                return "status-available";

            case "occupied":
                return "status-occupied";

            case "maintenance":
                return "status-maintenance";

            case "reserved":
                return "status-reserved";

            default:
                return "";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "available":
                return "Available";

            case "occupied":
                return "Occupied";

            case "maintenance":
                return "Maintenance";

            case "reserved":
                return "Reserved";

            default:
                return status;
        }
    };

    // =====================================================
    // ROOM TYPE
    // =====================================================

    const getRoomTypeClass = (type) => {
        switch (type) {
            case "ICU":
                return "room-icu";

            case "Private":
                return "room-private";

            default:
                return "room-general";
        }
    };

    // =====================================================
    // PATIENT NAME
    // =====================================================

    const getPatientName = (patient) => {
        return (
            patient?.user?.name ||
            patient?.name ||
            "Unknown Patient"
        );
    };

    // =====================================================
    // DOCTOR NAME
    // =====================================================

    const getDoctorName = (doctor) => {
        return (
            doctor?.user?.name ||
            doctor?.name ||
            "Not assigned"
        );
    };

    // =====================================================
    // BILLING DAYS
    // =====================================================

    const getCurrentDays = (admission) => {
        if (!admission?.admissionDate) {
            return 0;
        }

        const start = new Date(
            admission.admissionDate
        );

        const end =
            admission.dischargeDate
                ? new Date(
                      admission.dischargeDate
                  )
                : new Date();

        let days = Math.ceil(
            (end.getTime() -
                start.getTime()) /
                (1000 * 60 * 60 * 24)
        );

        if (days < 1) {
            days = 1;
        }

        return days;
    };

    const getEstimatedCharges = (
        admission
    ) => {
        if (
            admission?.status !==
            "admitted"
        ) {
            return admission?.roomCharges || 0;
        }

        const days =
            getCurrentDays(admission);

        return (
            days *
            Number(admission.roomRate || 0)
        );
    };

// =====================================================
// BILLING CALCULATION HELPERS
// =====================================================
const getBillingSegmentDays = (
    segment,
    admission
) => {
    if (!segment.startDate) {
        return 0;
    }

    const startDate = new Date(
        segment.startDate
    );

    const endDate = segment.endDate
        ? new Date(segment.endDate)
        : admission.dischargeDate
        ? new Date(admission.dischargeDate)
        : new Date();

    // Use calendar dates instead of exact
    // hours/minutes for hospital room billing.
    const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    const difference =
        end.getTime() -
        start.getTime();

    let days = Math.round(
        difference /
            (1000 * 60 * 60 * 24)
    );

    // Minimum one billing day.
    if (days < 1) {
        days = 1;
    }

    return days;
};

const getBillingSegmentCharges = (
    segment,
    admission
) => {
    const days =
        getBillingSegmentDays(
            segment,
            admission
        );

    return (
        days *
        Number(segment.rate || 0)
    );
};
    // =====================================================
    // LOADING
    // =====================================================

    if (loading && !dashboard) {
        return (
            <div className="bed-room-page">

                <div className="bed-room-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading Bed & Room
                        Management...
                    </p>

                </div>

            </div>
        );
    }

    const stats =
        dashboard?.stats || {};

    return (
        <div className="bed-room-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bed-room-page-header">

                <div className="page-title-row">

                    <div className="page-title-icon">
                        🛏️
                    </div>

                    <div>

                        <h1>
                            Bed & Room Management
                        </h1>

                        <p>
                            Manage hospital rooms,
                            beds, admissions and
                            availability.
                        </p>

                    </div>

                </div>


                <button
                    className="refresh-button"
                    onClick={refreshData}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="bed-room-error">
                    ⚠️ {error}
                </div>
            )}


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="bed-stats-grid">

                <div className="bed-stat-card total">

                    <div className="stat-icon">
                        🛏️
                    </div>

                    <div>

                        <span>
                            Total Beds
                        </span>

                        <strong>
                            {stats.totalBeds ||
                                0}
                        </strong>

                    </div>

                </div>


                <div className="bed-stat-card available">

                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Available
                        </span>

                        <strong>
                            {stats.availableBeds ||
                                0}
                        </strong>

                    </div>

                </div>


                <div className="bed-stat-card occupied">

                    <div className="stat-icon">
                        🔴
                    </div>

                    <div>

                        <span>
                            Occupied
                        </span>

                        <strong>
                            {stats.occupiedBeds ||
                                0}
                        </strong>

                    </div>

                </div>


                <div className="bed-stat-card maintenance">

                    <div className="stat-icon">
                        🛠️
                    </div>

                    <div>

                        <span>
                            Maintenance
                        </span>

                        <strong>
                            {stats.maintenanceBeds ||
                                0}
                        </strong>

                    </div>

                </div>


                <div className="bed-stat-card reserved">

                    <div className="stat-icon">
                        🟡
                    </div>

                    <div>

                        <span>
                            Reserved
                        </span>

                        <strong>
                            {stats.reservedBeds ||
                                0}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                TABS
            ================================================= */}

            <div className="bed-room-tabs">

                <button
                    className={
                        activeTab ===
                        "dashboard"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab(
                            "dashboard"
                        )
                    }
                >
                    📊 Overview
                </button>


                <button
                    className={
                        activeTab === "rooms"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("rooms")
                    }
                >
                    🏢 Rooms
                </button>


                <button
                    className={
                        activeTab === "beds"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("beds")
                    }
                >
                    🛏️ Beds
                </button>


                <button
                    className={
                        activeTab ===
                        "admissions"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab(
                            "admissions"
                        )
                    }
                >
                    🧑‍⚕️ Admissions
                </button>

            </div>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            {activeTab ===
                "dashboard" && (
                <>

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Room Availability
                                </h2>

                                <p>
                                    Current capacity
                                    across room types
                                </p>

                            </div>

                        </div>


                        <div className="room-type-grid">

                            {(
                                dashboard?.roomTypes ||
                                []
                            ).map(
                                (room) => {

                                    const roomBeds =
                                        beds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed.room &&
                                                bed
                                                    .room
                                                    .roomType ===
                                                    room._id
                                        );

                                    const total =
                                        roomBeds.length;

                                    const occupied =
                                        roomBeds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed.status ===
                                                "occupied"
                                        ).length;

                                    const available =
                                        roomBeds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed.status ===
                                                "available"
                                        ).length;

                                    const percentage =
                                        total >
                                        0
                                            ? Math.round(
                                                  (available /
                                                      total) *
                                                      100
                                              )
                                            : 0;

                                    return (
                                        <div
                                            className={`room-type-card ${getRoomTypeClass(
                                                room._id
                                            )}`}
                                            key={
                                                room._id
                                            }
                                        >

                                            <div className="room-type-header">

                                                <div>

                                                    <h3>
                                                        {
                                                            room._id
                                                        }
                                                    </h3>

                                                    <span>
                                                        {
                                                            room.rooms
                                                        }{" "}
                                                        room
                                                        {room.rooms !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>

                                                </div>

                                                <span className="room-type-icon">

                                                    {room._id ===
                                                    "ICU"
                                                        ? "🏥"
                                                        : room._id ===
                                                          "Private"
                                                        ? "🛋️"
                                                        : "🏢"}

                                                </span>

                                            </div>


                                            <div className="room-progress">

                                                <div className="progress-label">

                                                    <span>
                                                        {
                                                            available
                                                        }{" "}
                                                        Available
                                                    </span>

                                                    <strong>
                                                        {
                                                            percentage
                                                        }
                                                        %
                                                    </strong>

                                                </div>


                                                <div className="progress-track">

                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${percentage}%`
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="quick-actions-card">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Manage rooms,
                                    beds and
                                    admissions
                                </p>

                            </div>

                        </div>


                        <div className="quick-actions-grid">

                            <button
                                onClick={() =>
                                    setShowRoomModal(
                                        true
                                    )
                                }
                            >

                                <span>
                                    🏢
                                </span>

                                <div>

                                    <strong>
                                        Add Room
                                    </strong>

                                    <small>
                                        Create a new
                                        hospital room
                                    </small>

                                </div>

                            </button>


                            <button
                                onClick={() =>
                                    setShowBedModal(
                                        true
                                    )
                                }
                            >

                                <span>
                                    🛏️
                                </span>

                                <div>

                                    <strong>
                                        Add Bed
                                    </strong>

                                    <small>
                                        Add bed to a
                                        room
                                    </small>

                                </div>

                            </button>


                            <button
                                onClick={() =>
                                    setShowAdmissionModal(
                                        true
                                    )
                                }
                            >

                                <span>
                                    🧑‍⚕️
                                </span>

                                <div>

                                    <strong>
                                        Admit Patient
                                    </strong>

                                    <small>
                                        Assign patient
                                        to a bed
                                    </small>

                                </div>

                            </button>

                        </div>

                    </div>


                    {/* RECENT ADMISSIONS */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Recent Admissions
                                </h2>

                                <p>
                                    Latest admitted
                                    patients
                                </p>

                            </div>


                            <button
                                className="view-all-button"
                                onClick={() =>
                                    setActiveTab(
                                        "admissions"
                                    )
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {(
                            dashboard?.recentAdmissions ||
                            []
                        ).length ===
                        0 ? (
                            <div className="empty-state">

                                <span>
                                    🛏️
                                </span>

                                <h3>
                                    No admissions yet
                                </h3>

                                <p>
                                    Admitted patients
                                    will appear here.
                                </p>

                            </div>
                        ) : (
                            <div className="admissions-table-wrapper">

                                <table className="admissions-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Patient
                                            </th>

                                            <th>
                                                Room
                                            </th>

                                            <th>
                                                Bed
                                            </th>

                                            <th>
                                                Doctor
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {dashboard.recentAdmissions.map(
                                            (
                                                admission
                                            ) => (
                                                <tr
                                                    key={
                                                        admission._id
                                                    }
                                                >

                                                    <td>
                                                        <strong>
                                                            {getPatientName(
                                                                admission.patient
                                                            )}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            admission
                                                                .room
                                                                ?.roomNumber
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            admission
                                                                .bed
                                                                ?.bedNumber
                                                        }
                                                    </td>

                                                    <td>
                                                        {getDoctorName(
                                                            admission.doctor
                                                        )}
                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            admission.admissionDate
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td>

                                                        <span className="admission-status">
                                                            {
                                                                admission.status
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>

                </>
            )}


            {/* =================================================
                ROOMS
            ================================================= */}

            {activeTab ===
                "rooms" && (
                <div className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Hospital Rooms
                            </h2>

                            <p>
                                Manage ICU, General
                                and Private rooms
                            </p>

                        </div>


                        <button
                            className="primary-action"
                            onClick={() =>
                                setShowRoomModal(
                                    true
                                )
                            }
                        >
                            + Add Room
                        </button>

                    </div>


                    {rooms.length ===
                    0 ? (
                        <div className="empty-state">

                            <span>
                                🏢
                            </span>

                            <h3>
                                No rooms found
                            </h3>

                            <p>
                                Create your first
                                room to get started.
                            </p>

                        </div>
                    ) : (
                        <div className="rooms-grid">

                            {rooms.map(
                                (room) => {

                                    const roomBeds =
                                        beds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed
                                                    .room
                                                    ?._id ===
                                                room._id
                                        );

                                    const available =
                                        roomBeds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed.status ===
                                                "available"
                                        ).length;

                                    const occupied =
                                        roomBeds.filter(
                                            (
                                                bed
                                            ) =>
                                                bed.status ===
                                                "occupied"
                                        ).length;

                                    return (
                                        <div
                                            className="room-card"
                                            key={
                                                room._id
                                            }
                                        >

                                            <div className="room-card-top">

                                                <div
                                                    className={`room-icon ${getRoomTypeClass(
                                                        room.roomType
                                                    )}`}
                                                >
                                                    {room.roomType ===
                                                    "ICU"
                                                        ? "🏥"
                                                        : room.roomType ===
                                                          "Private"
                                                        ? "🛋️"
                                                        : "🏢"}
                                                </div>

                                                <span className="room-number">
                                                    {
                                                        room.roomNumber
                                                    }
                                                </span>

                                            </div>


                                            <h3>
                                                {
                                                    room.roomType
                                                }{" "}
                                                Room
                                            </h3>

                                            <p>
                                                Floor{" "}
                                                {
                                                    room.floor
                                                }
                                            </p>


                                            <div className="room-card-stats">

                                                <div>

                                                    <span>
                                                        Capacity
                                                    </span>

                                                    <strong>
                                                        {
                                                            room.capacity
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Available
                                                    </span>

                                                    <strong className="text-green">
                                                        {
                                                            available
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Occupied
                                                    </span>

                                                    <strong className="text-red">
                                                        {
                                                            occupied
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="room-rate">

                                                ₹
                                                {Number(
                                                    room.dailyRate
                                                ).toLocaleString()}

                                                <span>
                                                    {" "}
                                                    / day
                                                </span>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            )}


            {/* =================================================
                BEDS
            ================================================= */}

            {activeTab ===
                "beds" && (
                <div className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Bed Inventory
                            </h2>

                            <p>
                                Current status of
                                every hospital bed
                            </p>

                        </div>


                        <button
                            className="primary-action"
                            onClick={() =>
                                setShowBedModal(
                                    true
                                )
                            }
                        >
                            + Add Bed
                        </button>

                    </div>


                    {beds.length ===
                    0 ? (
                        <div className="empty-state">

                            <span>
                                🛏️
                            </span>

                            <h3>
                                No beds found
                            </h3>

                            <p>
                                Add beds to your
                                hospital rooms.
                            </p>

                        </div>
                    ) : (
                        <div className="beds-grid">

                            {beds.map(
                                (bed) => (
                                    <div
                                        className="bed-card"
                                        key={
                                            bed._id
                                        }
                                    >

                                        <div className="bed-card-header">

                                            <div className="bed-icon">
                                                🛏️
                                            </div>

                                            <span
                                                className={`bed-status ${getStatusClass(
                                                    bed.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    bed.status
                                                )}
                                            </span>

                                        </div>


                                        <h3>
                                            {
                                                bed.bedNumber
                                            }
                                        </h3>

                                        <p>
                                            {
                                                bed.room
                                                    ?.roomNumber
                                            }{" "}
                                            •{" "}
                                            {
                                                bed.room
                                                    ?.roomType
                                            }
                                        </p>


                                        {bed.currentPatient && (
                                            <div className="current-patient">

                                                <span>
                                                    Patient
                                                </span>

                                                <strong>
                                                    {getPatientName(
                                                        bed.currentPatient
                                                    )}
                                                </strong>

                                            </div>
                                        )}

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>
            )}


            {/* =================================================
                ADMISSIONS
            ================================================= */}

            {activeTab ===
                "admissions" && (
                <div className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Patient Admissions
                            </h2>

                            <p>
                                Manage admitted
                                patients and room
                                billing
                            </p>

                        </div>


                        <button
                            className="primary-action"
                            onClick={() =>
                                setShowAdmissionModal(
                                    true
                                )
                            }
                        >
                            + Admit Patient
                        </button>

                    </div>


                    {admissions.length ===
                    0 ? (
                        <div className="empty-state">

                            <span>
                                🧑‍⚕️
                            </span>

                            <h3>
                                No admissions
                            </h3>

                            <p>
                                No patient has been
                                admitted yet.
                            </p>

                        </div>
                    ) : (
                        <div className="admissions-table-wrapper">

                            <table className="admissions-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Room
                                        </th>

                                        <th>
                                            Bed
                                        </th>

                                        <th>
                                            Doctor
                                        </th>

                                        <th>
                                            Admission
                                        </th>

                                        <th>
                                            Rate / Day
                                        </th>

                                        <th>
                                            Est. Charges
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {admissions.map(
                                        (
                                            admission
                                        ) => {

                                            const days =
                                                getCurrentDays(
                                                    admission
                                                );

                                            const charges =
                                                getEstimatedCharges(
                                                    admission
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        admission._id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {getPatientName(
                                                                admission.patient
                                                            )}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            admission
                                                                .room
                                                                ?.roomNumber
                                                        }

                                                        <br />

                                                        <small>
                                                            {
                                                                admission
                                                                    .room
                                                                    ?.roomType
                                                            }
                                                        </small>

                                                    </td>


                                                    <td>
                                                        {
                                                            admission
                                                                .bed
                                                                ?.bedNumber
                                                        }
                                                    </td>


                                                    <td>
                                                        {getDoctorName(
                                                            admission.doctor
                                                        )}
                                                    </td>


                                                    <td>

                                                        {new Date(
                                                            admission.admissionDate
                                                        ).toLocaleDateString()}

                                                        <br />

                                                        <small>
                                                            {
                                                                days
                                                            }{" "}
                                                            day
                                                            {days !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </small>

                                                    </td>


                                                    <td>
                                                        ₹
                                                        {Number(
                                                            admission.roomRate ||
                                                                0
                                                        ).toLocaleString()}
                                                    </td>


                                                    <td>

                                                        <strong className="billing-amount">
                                                            ₹
                                                            {Number(
                                                                charges ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                admission.status ===
                                                                "admitted"
                                                                    ? "admission-status active"
                                                                    : "admission-status discharged"
                                                            }
                                                        >
                                                            {
                                                                admission.status
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>
{admission.status === "admitted" && (
    <div className="admission-actions">

        <button
            className="details-button"
            onClick={() =>
                openAdmissionDetails(
                    admission
                )
            }
        >
            🔍 Details
        </button>

        <button
            className="transfer-button"
            onClick={() =>
                openTransfer(admission)
            }
        >
            🔄 Transfer
        </button>

        <button
            className="discharge-button"
            onClick={() =>
                openDischarge(admission)
            }
        >
            🚪 Discharge
        </button>

    </div>
)}

{admission.status === "discharged" && (
    <div className="admission-actions">

        <button
            className="details-button"
            onClick={() =>
                openAdmissionDetails(
                    admission
                )
            }
        >
            🔍 Details
        </button>

        <button
            className="bill-button"
            onClick={() =>
                openRoomBill(admission)
            }
        >
            🧾 Bill
        </button>

        <span className="completed-text">
            Completed
        </span>

    </div>
)}
                                                        {admission.status ===
                                                            "discharged" && (
                                                            <span className="completed-text">
                                                                Completed
                                                            </span>
                                                        )}

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>
            )}


            {/* =================================================
                ADD ROOM MODAL
            ================================================= */}

            {showRoomModal && (
                <div
                    className="bed-modal-overlay"
                    onClick={() =>
                        setShowRoomModal(
                            false
                        )
                    }
                >

                    <div
                        className="bed-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add New Room
                                </h2>

                                <p>
                                    Create a hospital
                                    room
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowRoomModal(
                                        false
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={createRoom}
                        >

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Room Number
                                    </label>

                                    <input
                                        name="roomNumber"
                                        value={
                                            roomForm.roomNumber
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                        placeholder="e.g. ICU-01"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Room Type
                                    </label>

                                    <select
                                        name="roomType"
                                        value={
                                            roomForm.roomType
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                    >

                                        <option>
                                            General
                                        </option>

                                        <option>
                                            ICU
                                        </option>

                                        <option>
                                            Private
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Floor
                                    </label>

                                    <input
                                        name="floor"
                                        value={
                                            roomForm.floor
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                        placeholder="e.g. Ground Floor"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Bed Capacity
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        name="capacity"
                                        value={
                                            roomForm.capacity
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                        placeholder="e.g. 4"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Daily Rate (₹)
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="dailyRate"
                                        value={
                                            roomForm.dailyRate
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                        placeholder="e.g. 2500"
                                        required
                                    />

                                </div>


                                <div className="form-group full-width">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            roomForm.description
                                        }
                                        onChange={
                                            handleRoomChange
                                        }
                                        rows="3"
                                        placeholder="Optional description"
                                    />

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowRoomModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-action"
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Create Room"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                ADD BED MODAL
            ================================================= */}

            {showBedModal && (
                <div
                    className="bed-modal-overlay"
                    onClick={() =>
                        setShowBedModal(
                            false
                        )
                    }
                >

                    <div
                        className="bed-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add New Bed
                                </h2>

                                <p>
                                    Assign a bed to a
                                    room
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowBedModal(
                                        false
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={createBed}
                        >

                            <div className="form-group">

                                <label>
                                    Bed Number
                                </label>

                                <input
                                    name="bedNumber"
                                    value={
                                        bedForm.bedNumber
                                    }
                                    onChange={
                                        handleBedChange
                                    }
                                    placeholder="e.g. ICU-B01"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Select Room
                                </label>

                                <select
                                    name="room"
                                    value={
                                        bedForm.room
                                    }
                                    onChange={
                                        handleBedChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select a room
                                    </option>

                                    {rooms.map(
                                        (
                                            room
                                        ) => (
                                            <option
                                                key={
                                                    room._id
                                                }
                                                value={
                                                    room._id
                                                }
                                            >
                                                {
                                                    room.roomNumber
                                                }{" "}
                                                -{" "}
                                                {
                                                    room.roomType
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        bedForm.notes
                                    }
                                    onChange={
                                        handleBedChange
                                    }
                                    rows="3"
                                    placeholder="Optional notes"
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowBedModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-action"
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Create Bed"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                ADMIT PATIENT MODAL
            ================================================= */}

            {showAdmissionModal && (
                <div
                    className="bed-modal-overlay"
                    onClick={() =>
                        setShowAdmissionModal(
                            false
                        )
                    }
                >

                    <div
                        className="bed-modal admission-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    🧑‍⚕️ Admit Patient
                                </h2>

                                <p>
                                    Assign a patient
                                    to an available
                                    hospital bed
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAdmissionModal(
                                        false
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={
                                admitPatient
                            }
                        >

                            {/* PATIENT */}

                            <div className="form-group">

                                <label>
                                    Patient *
                                </label>

                                <select
                                    name="patient"
                                    value={
                                        admissionForm.patient
                                    }
                                    onChange={
                                        handleAdmissionChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map(
                                        (
                                            patient
                                        ) => (
                                            <option
                                                key={
                                                    patient._id
                                                }
                                                value={
                                                    patient._id
                                                }
                                            >
                                                {getPatientName(
                                                    patient
                                                )}
                                                {patient
                                                    .user
                                                    ?.phone
                                                    ? ` - ${patient.user.phone}`
                                                    : ""}
                                            </option>
                                        )
                                    )}

                                </select>

                                {patients.length ===
                                    0 && (
                                    <small className="form-help">
                                        No patients
                                        found.
                                    </small>
                                )}

                            </div>


                            {/* DOCTOR */}

                            <div className="form-group">

                                <label>
                                    Assigned Doctor
                                </label>

                                <select
                                    name="doctor"
                                    value={
                                        admissionForm.doctor
                                    }
                                    onChange={
                                        handleAdmissionChange
                                    }
                                >

                                    <option value="">
                                        Select Doctor
                                        (Optional)
                                    </option>

                                    {doctors.map(
                                        (
                                            doctor
                                        ) => (
                                            <option
                                                key={
                                                    doctor._id
                                                }
                                                value={
                                                    doctor._id
                                                }
                                            >
                                                {getDoctorName(
                                                    doctor
                                                )}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            {/* AVAILABLE BED */}

                            <div className="form-group">

                                <label>
                                    Available Bed *
                                </label>

                                <select
                                    name="bed"
                                    value={
                                        admissionForm.bed
                                    }
                                    onChange={
                                        handleAdmissionChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Available
                                        Bed
                                    </option>

                                    {availableBeds.map(
                                        (
                                            bed
                                        ) => (
                                            <option
                                                key={
                                                    bed._id
                                                }
                                                value={
                                                    bed._id
                                                }
                                            >
                                                {
                                                    bed
                                                        .room
                                                        ?.roomNumber
                                                }{" "}
                                                •{" "}
                                                {
                                                    bed
                                                        .room
                                                        ?.roomType
                                                }{" "}
                                                • Bed{" "}
                                                {
                                                    bed.bedNumber
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                                {availableBeds.length ===
                                    0 && (
                                    <small className="form-help error-help">
                                        No available
                                        beds.
                                    </small>
                                )}

                            </div>


                            {/* SELECTED ROOM */}

                            {selectedBed && (
                                <div className="selected-bed-info">

                                    <div>
                                        <span>
                                            🏢 Room
                                        </span>

                                        <strong>
                                            {
                                                selectedBed
                                                    .room
                                                    ?.roomNumber
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            🛏️ Bed
                                        </span>

                                        <strong>
                                            {
                                                selectedBed.bedNumber
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            💰 Daily Rate
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                selectedBed
                                                    .room
                                                    ?.dailyRate ||
                                                    0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                </div>
                            )}


                            {/* DATE */}

                            <div className="form-group">

                                <label>
                                    Admission Date *
                                </label>

                                <input
                                    type="date"
                                    name="admissionDate"
                                    value={
                                        admissionForm.admissionDate
                                    }
                                    onChange={
                                        handleAdmissionChange
                                    }
                                    required
                                />

                            </div>


                            {/* NOTES */}

                            <div className="form-group">

                                <label>
                                    Admission Notes
                                </label>

                                <textarea
                                    name="admissionNotes"
                                    value={
                                        admissionForm.admissionNotes
                                    }
                                    onChange={
                                        handleAdmissionChange
                                    }
                                    rows="3"
                                    placeholder="Reason for admission, special requirements, etc."
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowAdmissionModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-action"
                                    disabled={
                                        submitting ||
                                        availableBeds.length ===
                                            0
                                    }
                                >
                                    {submitting
                                        ? "Admitting..."
                                        : "Admit Patient"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                DISCHARGE MODAL
            ================================================= */}

            {showDischargeModal &&
                selectedAdmission && (
                    <div
                        className="bed-modal-overlay"
                        onClick={() =>
                            setShowDischargeModal(
                                false
                            )
                        }
                    >

                        <div
                            className="bed-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        🚪 Discharge
                                        Patient
                                    </h2>

                                    <p>
                                        Complete
                                        admission and
                                        calculate room
                                        charges.
                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        setShowDischargeModal(
                                            false
                                        )
                                    }
                                >
                                    ✕
                                </button>

                            </div>


                            {/* PATIENT SUMMARY */}

                            <div className="discharge-summary">

                                <div>

                                    <span>
                                        Patient
                                    </span>

                                    <strong>
                                        {getPatientName(
                                            selectedAdmission.patient
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Room / Bed
                                    </span>

                                    <strong>
                                        {
                                            selectedAdmission
                                                .room
                                                ?.roomNumber
                                        }{" "}
                                        /{" "}
                                        {
                                            selectedAdmission
                                                .bed
                                                ?.bedNumber
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Daily Rate
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedAdmission.roomRate ||
                                                0
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Current Days
                                    </span>

                                    <strong>
                                        {getCurrentDays(
                                            selectedAdmission
                                        )}
                                    </strong>

                                </div>


                                <div className="summary-total">

                                    <span>
                                        Estimated Room
                                        Charges
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            getEstimatedCharges(
                                                selectedAdmission
                                            )
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    dischargePatient
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Discharge Date
                                    </label>

                                    <input
                                        type="date"
                                        name="dischargeDate"
                                        value={
                                            dischargeForm.dischargeDate
                                        }
                                        onChange={
                                            handleDischargeChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Discharge Notes
                                    </label>

                                    <textarea
                                        name="dischargeNotes"
                                        value={
                                            dischargeForm.dischargeNotes
                                        }
                                        onChange={
                                            handleDischargeChange
                                        }
                                        rows="3"
                                        placeholder="Enter discharge notes"
                                    />

                                </div>


                                <div className="modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() =>
                                            setShowDischargeModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="primary-action discharge-submit"
                                        disabled={
                                            submitting
                                        }
                                    >
                                        {submitting
                                            ? "Discharging..."
                                            : "Confirm Discharge"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

                {/* =================================================
    TRANSFER PATIENT MODAL
================================================= */}

{showTransferModal &&
    selectedTransferAdmission && (
        <div
            className="bed-modal-overlay"
            onClick={() =>
                setShowTransferModal(
                    false
                )
            }
        >

            <div
                className="bed-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="modal-header">

                    <div>

                        <h2>
                            🔄 Transfer Patient
                        </h2>

                        <p>
                            Move the patient to
                            another available
                            bed.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            setShowTransferModal(
                                false
                            )
                        }
                    >
                        ✕
                    </button>

                </div>


                {/* CURRENT LOCATION */}

                <div className="transfer-current-location">

                    <div>

                        <span>
                            Current Room
                        </span>

                        <strong>
                            {
                                selectedTransferAdmission
                                    .room
                                    ?.roomNumber
                            }
                        </strong>

                    </div>


                    <div>

                        <span>
                            Current Bed
                        </span>

                        <strong>
                            {
                                selectedTransferAdmission
                                    .bed
                                    ?.bedNumber
                            }
                        </strong>

                    </div>


                    <div>

                        <span>
                            Current Rate
                        </span>

                        <strong>
                            ₹
                            {Number(
                                selectedTransferAdmission.roomRate ||
                                    0
                            ).toLocaleString()}
                            /day
                        </strong>

                    </div>

                </div>


                <form
                    onSubmit={
                        transferPatient
                    }
                >

                    {/* DESTINATION BED */}

                    <div className="form-group">

                        <label>
                            Destination Bed *
                        </label>

                        <select
                            name="newBed"
                            value={
                                transferForm.newBed
                            }
                            onChange={
                                handleTransferChange
                            }
                            required
                        >

                            <option value="">
                                Select Available
                                Bed
                            </option>

                            {availableBeds
                                .filter(
                                    (bed) =>
                                        bed._id !==
                                        selectedTransferAdmission.bed?._id
                                )
                                .map(
                                    (
                                        bed
                                    ) => (
                                        <option
                                            key={
                                                bed._id
                                            }
                                            value={
                                                bed._id
                                            }
                                        >
                                            {
                                                bed
                                                    .room
                                                    ?.roomNumber
                                            }{" "}
                                            •{" "}
                                            {
                                                bed
                                                    .room
                                                    ?.roomType
                                            }{" "}
                                            • Bed{" "}
                                            {
                                                bed.bedNumber
                                            }{" "}
                                            • ₹
                                            {Number(
                                                bed
                                                    .room
                                                    ?.dailyRate ||
                                                    0
                                            )}
                                            /day
                                        </option>
                                    )
                                )}

                        </select>

                        {availableBeds.length ===
                            0 && (
                            <small className="form-help error-help">
                                No available beds
                                for transfer.
                            </small>
                        )}

                    </div>


                    {/* SELECTED DESTINATION */}

                    {transferForm.newBed && (
                        <div className="transfer-destination-info">

                            {(() => {

                                const destination =
                                    availableBeds.find(
                                        (bed) =>
                                            bed._id ===
                                            transferForm.newBed
                                    );

                                if (!destination) {
                                    return null;
                                }

                                return (
                                    <>
                                        <div>

                                            <span>
                                                🏢 New Room
                                            </span>

                                            <strong>
                                                {
                                                    destination
                                                        .room
                                                        ?.roomNumber
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                🛏️ New Bed
                                            </span>

                                            <strong>
                                                {
                                                    destination.bedNumber
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                💰 New Rate
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    destination
                                                        .room
                                                        ?.dailyRate ||
                                                        0
                                                ).toLocaleString()}
                                                /day
                                            </strong>

                                        </div>
                                    </>
                                );

                            })()}

                        </div>
                    )}


                    {/* REASON */}

                    <div className="form-group">

                        <label>
                            Transfer Reason
                        </label>

                        <textarea
                            name="reason"
                            value={
                                transferForm.reason
                            }
                            onChange={
                                handleTransferChange
                            }
                            rows="3"
                            placeholder="e.g. Patient requires ICU care"
                        />

                    </div>


                    {/* WARNING */}

                    <div className="transfer-warning">

                        ⚠️ The current bed will become
                        <strong>
                            {" "}Available
                        </strong>
                        {" "}and the selected bed will
                        become
                        <strong>
                            {" "}Occupied
                        </strong>
                        .

                    </div>


                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                setShowTransferModal(
                                    false
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-action"
                            disabled={
                                submitting ||
                                availableBeds.length ===
                                    0
                            }
                        >
                            {submitting
                                ? "Transferring..."
                                : "Confirm Transfer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )}
   {/* =================================================
    ADMISSION DETAILS MODAL
================================================= */}

{showDetailsModal &&
    selectedDetailsAdmission && (
        <div
            className="bed-modal-overlay"
            onClick={() =>
                setShowDetailsModal(false)
            }
        >

            <div
                className="bed-modal admission-details-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="modal-header">

                    <div>

                        <h2>
                            📋 Admission Details
                        </h2>

                        <p>
                            Complete admission,
                            transfer and billing
                            information.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setShowDetailsModal(
                                false
                            )
                        }
                    >
                        ✕
                    </button>

                </div>


                {detailsLoading ? (

                    <div className="details-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading admission
                            details...
                        </p>

                    </div>

                ) : (

                    <>

                        {/* =================================
                            PATIENT SUMMARY
                        ================================= */}

                        <div className="details-patient-card">

                            <div className="details-patient-icon">
                                👤
                            </div>

                            <div>

                                <span>
                                    Patient
                                </span>

                                <h3>
                                    {getPatientName(
                                        selectedDetailsAdmission.patient
                                    )}
                                </h3>

                                {selectedDetailsAdmission
                                    .patient
                                    ?.user
                                    ?.phone && (
                                    <small>
                                        📞{" "}
                                        {
                                            selectedDetailsAdmission
                                                .patient
                                                .user
                                                .phone
                                        }
                                    </small>
                                )}

                            </div>

                        </div>


                        {/* =================================
                            CURRENT INFORMATION
                        ================================= */}

                        <div className="details-section">

                            <div className="details-section-title">

                                <h3>
                                    🏥 Current Admission
                                </h3>

                            </div>


                            <div className="details-info-grid">

                                <div className="details-info-item">

                                    <span>
                                        Room
                                    </span>

                                    <strong>
                                        {
                                            selectedDetailsAdmission
                                                .room
                                                ?.roomNumber
                                        }
                                    </strong>

                                    <small>
                                        {
                                            selectedDetailsAdmission
                                                .room
                                                ?.roomType
                                        }
                                    </small>

                                </div>


                                <div className="details-info-item">

                                    <span>
                                        Bed
                                    </span>

                                    <strong>
                                        {
                                            selectedDetailsAdmission
                                                .bed
                                                ?.bedNumber
                                        }
                                    </strong>

                                </div>


                                <div className="details-info-item">

                                    <span>
                                        Doctor
                                    </span>

                                    <strong>
                                        {getDoctorName(
                                            selectedDetailsAdmission.doctor
                                        )}
                                    </strong>

                                </div>


                                <div className="details-info-item">

                                    <span>
                                        Admission Date
                                    </span>

                                    <strong>
                                        {new Date(
                                            selectedDetailsAdmission.admissionDate
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <div className="details-info-item">

                                    <span>
                                        Daily Rate
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedDetailsAdmission.roomRate ||
                                                0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <div className="details-info-item">

                                    <span>
                                        Status
                                    </span>

                                    <strong
                                        className={
                                            selectedDetailsAdmission.status ===
                                            "admitted"
                                                ? "details-status-active"
                                                : "details-status-discharged"
                                        }
                                    >
                                        {
                                            selectedDetailsAdmission.status
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            ADMISSION NOTES
                        ================================= */}

                        {selectedDetailsAdmission
                            .admissionNotes && (
                            <div className="details-notes">

                                <span>
                                    📝 Admission Notes
                                </span>

                                <p>
                                    {
                                        selectedDetailsAdmission
                                            .admissionNotes
                                    }
                                </p>

                            </div>
                        )}


                        {/* =================================
                            TRANSFER HISTORY
                        ================================= */}

                        <div className="details-section">

                            <div className="details-section-title">

                                <div>

                                    <h3>
                                        🔄 Transfer History
                                    </h3>

                                    <p>
                                        Previous room and
                                        bed movements.
                                    </p>

                                </div>

                                <span className="history-count">
                                    {
                                        selectedDetailsAdmission
                                            .transfers
                                            ?.length || 0
                                    }
                                </span>

                            </div>


                            {(
                                selectedDetailsAdmission
                                    .transfers ||
                                []
                            ).length === 0 ? (

                                <div className="no-history">

                                    <span>
                                        🔄
                                    </span>

                                    <p>
                                        No transfers
                                        recorded.
                                    </p>

                                </div>

                            ) : (

                                <div className="transfer-history">

                                    {selectedDetailsAdmission.transfers.map(
                                        (
                                            transfer,
                                            index
                                        ) => (

                                            <div
                                                className="transfer-history-item"
                                                key={
                                                    transfer._id ||
                                                    index
                                                }
                                            >

                                                <div className="transfer-number">
                                                    {index +
                                                        1}
                                                </div>


                                                <div className="transfer-history-content">

                                                    <div className="transfer-route">

                                                        <div>

                                                            <span>
                                                                From
                                                            </span>

                                                            <strong>
                                                                {
                                                                    transfer
                                                                        .fromRoom
                                                                        ?.roomNumber
                                                                }
                                                            </strong>

                                                            <small>
                                                                Bed{" "}
                                                                {
                                                                    transfer
                                                                        .fromBed
                                                                        ?.bedNumber
                                                                }
                                                            </small>

                                                        </div>


                                                        <div className="transfer-arrow">
                                                            →
                                                        </div>


                                                        <div>

                                                            <span>
                                                                To
                                                            </span>

                                                            <strong>
                                                                {
                                                                    transfer
                                                                        .toRoom
                                                                        ?.roomNumber
                                                                }
                                                            </strong>

                                                            <small>
                                                                Bed{" "}
                                                                {
                                                                    transfer
                                                                        .toBed
                                                                        ?.bedNumber
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>


                                                    <div className="transfer-history-meta">

                                                        <span>
                                                            📅{" "}
                                                            {new Date(
                                                                transfer.transferDate
                                                            ).toLocaleDateString(
                                                                "en-IN"
                                                            )}
                                                        </span>


                                                        {transfer.reason && (
                                                            <span>
                                                                📝{" "}
                                                                {
                                                                    transfer.reason
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

{/* =================================
    BILLING BREAKDOWN
================================= */}

<div className="details-section">

    <div className="details-section-title">

        <div>

            <h3>
                💰 Billing Breakdown
            </h3>

            <p>
                Room charges by stay period.
            </p>

        </div>

    </div>


    {(
        selectedDetailsAdmission
            .billingSegments ||
        []
    ).length === 0 ? (

        <div className="no-history">

            <span>
                💰
            </span>

            <p>
                Billing history is not
                available for this admission.
            </p>

        </div>

    ) : (

        <div className="billing-breakdown">

            <div className="billing-table">

                {/* =============================
                    BILLING HEADER
                ============================== */}

                <div className="billing-row billing-header">

                    <span>
                        Room / Bed
                    </span>

                    <span>
                        Rate
                    </span>

                    <span>
                        Days
                    </span>

                    <span>
                        Charges
                    </span>

                </div>


                {/* =============================
                    BILLING SEGMENTS
                ============================== */}

                {selectedDetailsAdmission.billingSegments.map(
                    (
                        segment,
                        index
                    ) => {

                        const days =
                            getBillingSegmentDays(
                                segment,
                                selectedDetailsAdmission
                            );

                        const charges =
                            getBillingSegmentCharges(
                                segment,
                                selectedDetailsAdmission
                            );

                        const isCurrentSegment =
                            !segment.endDate &&
                            selectedDetailsAdmission.status ===
                                "admitted";

                        return (

                            <div
                                className="billing-row"
                                key={
                                    segment._id ||
                                    index
                                }
                            >

                                {/* ROOM / BED */}

                                <div>

                                    <strong>
                                        {
                                            segment
                                                .room
                                                ?.roomNumber ||
                                            "Room"
                                        }
                                    </strong>

                                    <small>
                                        Bed{" "}
                                        {
                                            segment
                                                .bed
                                                ?.bedNumber ||
                                            "N/A"
                                        }
                                    </small>

                                </div>


                                {/* RATE */}

                                <span>

                                    ₹
                                    {Number(
                                        segment.rate ||
                                            0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                    <small
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "2px"
                                        }}
                                    >
                                        / day
                                    </small>

                                </span>


                                {/* DAYS */}

                                <span>

                                    {days}

                                    {isCurrentSegment && (
                                        <small
                                            className="billing-live-label"
                                        >
                                            Current
                                        </small>
                                    )}

                                </span>


                                {/* CHARGES */}

                                <strong
                                    className="billing-segment-charge"
                                >
                                    ₹
                                    {Number(
                                        charges
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        );
                    }
                )}

            </div>


            {/* =============================
                TOTAL
            ============================== */}

            <div className="billing-total">

                <span>
                    Total Room Charges
                </span>

                <strong>

                    ₹
                    {selectedDetailsAdmission.billingSegments
                        .reduce(
                            (
                                total,
                                segment
                            ) =>
                                total +
                                getBillingSegmentCharges(
                                    segment,
                                    selectedDetailsAdmission
                                ),
                            0
                        )
                        .toLocaleString(
                            "en-IN"
                        )}

                </strong>

            </div>


            {/* =============================
                BILLING NOTE
            ============================== */}

            {selectedDetailsAdmission.status ===
                "admitted" && (

                <div className="billing-estimate-note">

                    ℹ️ Current room charges are
                    estimated up to today. Final
                    charges will be calculated
                    when the patient is discharged.

                </div>

            )}

        </div>

    )}

</div>

                        {/* =================================
                            DISCHARGE INFORMATION
                        ================================= */}

                        {selectedDetailsAdmission
                            .status ===
                            "discharged" && (
                            <div className="discharge-details">

                                <div>

                                    <span>
                                        Discharge Date
                                    </span>

                                    <strong>
                                        {selectedDetailsAdmission
                                            .dischargeDate
                                            ? new Date(
                                                  selectedDetailsAdmission.dischargeDate
                                              ).toLocaleDateString(
                                                  "en-IN"
                                              )
                                            : "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Total Stay
                                    </span>

                                    <strong>
                                        {
                                            selectedDetailsAdmission.totalDays
                                        }{" "}
                                        day
                                        {selectedDetailsAdmission.totalDays !==
                                        1
                                            ? "s"
                                            : ""}
                                    </strong>

                                </div>

                            </div>
                        )}


                        {/* =================================
                            CLOSE
                        ================================= */}

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setShowDetailsModal(
                                        false
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </>
                )}

            </div>

        </div>
    )} 
{/* =====================================================
    ROOM BILL / DISCHARGE INVOICE
===================================================== */}

{showBillModal &&
    selectedBillAdmission && (

        <div
            className="bed-modal-overlay bill-modal-overlay"
            onClick={() =>
                setShowBillModal(false)
            }
        >

            <div
                className="room-bill-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =================================================
                    BILL HEADER
                ================================================= */}

                <div className="bill-header">

                    <div className="bill-hospital">

                        <div className="bill-logo">
                            🏥
                        </div>

                        <div>

                            <h1>
                                MediFlow
                            </h1>

                            <p>
                                Hospital Management System
                            </p>

                        </div>

                    </div>


                    <div className="bill-title">

                        <span>
                            ROOM BILL
                        </span>

                        <strong>
                            DISCHARGE INVOICE
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    PATIENT INFORMATION
                ================================================= */}

                <div className="bill-patient-section">

                    <div>

                        <span>
                            PATIENT
                        </span>

                        <strong>
                            {getPatientName(
                                selectedBillAdmission.patient
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            DOCTOR
                        </span>

                        <strong>
                            {getDoctorName(
                                selectedBillAdmission.doctor
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ADMISSION DATE
                        </span>

                        <strong>
                            {new Date(
                                selectedBillAdmission.admissionDate
                            ).toLocaleDateString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            DISCHARGE DATE
                        </span>

                        <strong>
                            {selectedBillAdmission
                                .dischargeDate
                                ? new Date(
                                      selectedBillAdmission.dischargeDate
                                  ).toLocaleDateString(
                                      "en-IN"
                                  )
                                : "-"}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    BILL STATUS
                ================================================= */}

                <div className="bill-status-row">

                    <span>
                        Admission Status
                    </span>

                    <strong>
                        DISCHARGED
                    </strong>

                </div>


                {/* =================================================
                    BILLING TABLE
                ================================================= */}

                <div className="bill-table-wrapper">

                    <table className="room-bill-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    ROOM / BED
                                </th>

                                <th>
                                    RATE / DAY
                                </th>

                                <th>
                                    DAYS
                                </th>

                                <th>
                                    AMOUNT
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {(
                                selectedBillAdmission
                                    .billingSegments ||
                                []
                            ).map(
                                (
                                    segment,
                                    index
                                ) => {

                                    const days =
                                        Number(
                                            segment.days ||
                                                0
                                        );

                                    const rate =
                                        Number(
                                            segment.rate ||
                                                0
                                        );

                                    const charges =
                                        Number(
                                            segment.charges ||
                                                days *
                                                    rate
                                        );

                                    return (

                                        <tr
                                            key={
                                                segment._id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index +
                                                    1}
                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        segment
                                                            .room
                                                            ?.roomNumber ||
                                                        "Room"
                                                    }
                                                </strong>

                                                <small>
                                                    Bed{" "}
                                                    {
                                                        segment
                                                            .bed
                                                            ?.bedNumber ||
                                                        "N/A"
                                                    }
                                                </small>

                                            </td>


                                            <td>
                                                ₹
                                                {rate.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>


                                            <td>
                                                {days}
                                            </td>


                                            <td className="bill-amount">
                                                ₹
                                                {charges.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <div className="bill-total-section">

                    <div>

                        <span>
                            Total Room Charges
                        </span>

                        <strong>
                            ₹
                            {Number(
                                selectedBillAdmission
                                    .roomCharges ||
                                    0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    DISCHARGE SUMMARY
                ================================================= */}

                <div className="bill-summary">

                    <div>

                        <span>
                            Total Stay
                        </span>

                        <strong>
                            {
                                selectedBillAdmission
                                    .totalDays
                            }{" "}
                            day
                            {selectedBillAdmission
                                .totalDays !==
                            1
                                ? "s"
                                : ""}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Room / Bed
                        </span>

                        <strong>
                            {
                                selectedBillAdmission
                                    .room
                                    ?.roomNumber
                            }{" "}
                            /{" "}
                            {
                                selectedBillAdmission
                                    .bed
                                    ?.bedNumber
                            }
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    NOTES
                ================================================= */}

                {selectedBillAdmission
                    .dischargeNotes && (

                    <div className="bill-notes">

                        <strong>
                            Discharge Notes
                        </strong>

                        <p>
                            {
                                selectedBillAdmission
                                    .dischargeNotes
                            }
                        </p>

                    </div>

                )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="bill-footer">

                    <p>
                        Thank you for choosing
                        MediFlow.
                    </p>

                    <small>
                        This is a computer-generated
                        hospital room bill.
                    </small>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="bill-actions">

                    <button
                        className="bill-close-button"
                        onClick={() =>
                            setShowBillModal(
                                false
                            )
                        }
                    >
                        Close
                    </button>


                    <button
                        className="bill-print-button"
                        onClick={() =>
                            window.print()
                        }
                    >
                        🖨️ Print / Save PDF
                    </button>

                </div>

            </div>

        </div>

    )}
        </div>
    );
}

export default BedRoomManagement;