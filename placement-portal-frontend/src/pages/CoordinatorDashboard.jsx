import {
    useEffect,
    useState
} from "react";

import {

    createPlacementDrive,
    deletePlacementDrive,
    getDashboardStats,
    getDriveApplications,
    getPlacementDrives,
    updateApplicationStatus,
    updateDriveStatus,
    updatePlacementDrive

} from "../services/api";

import Pagination
    from "../components/Pagination";


const APPLICATION_STATUSES = [

    "APPLIED",
    "ASSESSMENT",
    "TECHNICAL_INTERVIEW",
    "HR_INTERVIEW",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN"

];


const EMPTY_DRIVE = {

    companyName: "",
    role: "",
    description: "",
    packageLpa: "",
    location: "",
    minimumCgpa: "",
    maxBacklogs: "",
    deadline: "",
    eligibleDepartments: ""

};


function CoordinatorDashboard() {

    const [stats, setStats] =
        useState({
            totalDrives: 0,
            openDrives: 0,
            totalApplications: 0,
            selectedStudents: 0,
            interviewStage: 0
        });


    const [drives, setDrives] =
        useState([]);

    const [drivePage, setDrivePage] =
        useState(0);

    const [driveTotalPages, setDriveTotalPages] =
        useState(0);


    const [form, setForm] =
        useState(EMPTY_DRIVE);

    const [editingDriveId, setEditingDriveId] =
        useState(null);


    const [selectedDrive, setSelectedDrive] =
        useState(null);

    const [applicants, setApplicants] =
        useState([]);

    const [applicantPage, setApplicantPage] =
        useState(0);

    const [
        applicantTotalPages,
        setApplicantTotalPages
    ] = useState(0);


    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadDashboard();
        loadDrives();

    }, [drivePage]);


    useEffect(() => {

        if (selectedDrive) {
            loadApplicants(
                selectedDrive.id
            );
        }

    }, [applicantPage]);


    async function loadDashboard() {

        try {

            const data =
                await getDashboardStats();

            setStats(data);

        } catch (err) {

            setError(err.message);
        }
    }


    async function loadDrives() {

        try {

            const data =
                await getPlacementDrives({
                    page: drivePage,
                    size: 6
                });

            setDrives(data.content);

            setDriveTotalPages(
                data.totalPages
            );

        } catch (err) {

            setError(err.message);
        }
    }


    function handleFormChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;

        setForm({
            ...form,
            [name]: value
        });
    }


    async function handleDriveSubmit(
        event
    ) {

        event.preventDefault();

        try {

            setError("");
            setMessage("");


            const driveData = {

                companyName:
                    form.companyName,

                role:
                    form.role,

                description:
                    form.description,

                packageLpa:
                    Number(
                        form.packageLpa
                    ),

                location:
                    form.location,

                minimumCgpa:
                    Number(
                        form.minimumCgpa
                    ),

                maxBacklogs:
                    Number(
                        form.maxBacklogs
                    ),

                deadline:
                    form.deadline,

                eligibleDepartments:
                    form
                        .eligibleDepartments
                        .split(",")
                        .map(
                            department =>
                                department
                                    .trim()
                                    .toUpperCase()
                        )
                        .filter(Boolean)
            };


            if (editingDriveId) {

                await updatePlacementDrive(
                    editingDriveId,
                    driveData
                );

                setMessage(
                    "Placement drive updated successfully."
                );

            } else {

                await createPlacementDrive(
                    driveData
                );

                setMessage(
                    "Placement drive posted successfully."
                );
            }


            setForm(EMPTY_DRIVE);

            setEditingDriveId(null);

            await loadDrives();

            await loadDashboard();


        } catch (err) {

            setError(err.message);
        }
    }


    function startEditing(
        drive
    ) {

        setEditingDriveId(
            drive.id
        );

        setForm({

            companyName:
                drive.companyName || "",

            role:
                drive.role || "",

            description:
                drive.description || "",

            packageLpa:
                drive.packageLpa ?? "",

            location:
                drive.location || "",

            minimumCgpa:
                drive.minimumCgpa ?? "",

            maxBacklogs:
                drive.maxBacklogs ?? "",

            deadline:
                drive.deadline || "",

            eligibleDepartments:
                drive.eligibleDepartments
                    ?.join(", ") || ""
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function cancelEditing() {

        setEditingDriveId(null);

        setForm(EMPTY_DRIVE);
    }


    async function changeDriveStatus(
        drive
    ) {

        try {

            const newStatus =
                drive.status === "OPEN"
                    ? "CLOSED"
                    : "OPEN";


            await updateDriveStatus(
                drive.id,
                newStatus
            );


            setMessage(
                `Drive changed to ${newStatus}.`
            );


            await loadDrives();

            await loadDashboard();


        } catch (err) {

            setError(err.message);
        }
    }


    async function handleDeleteDrive(
        id
    ) {

        const confirmed =
            window.confirm(
                "Delete this placement drive?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await deletePlacementDrive(
                id
            );

            setMessage(
                "Placement drive deleted."
            );

            if (
                selectedDrive?.id === id
            ) {
                setSelectedDrive(null);
                setApplicants([]);
            }

            await loadDrives();

            await loadDashboard();


        } catch (err) {

            setError(err.message);
        }
    }


    async function openApplicants(
        drive
    ) {

        setSelectedDrive(drive);

        setApplicantPage(0);

        await loadApplicants(
            drive.id,
            0
        );
    }


    async function loadApplicants(
        driveId,
        page = applicantPage
    ) {

        try {

            const data =
                await getDriveApplications(
                    driveId,
                    page,
                    10
                );

            setApplicants(
                data.content
            );

            setApplicantTotalPages(
                data.totalPages
            );

        } catch (err) {

            setError(err.message);
        }
    }


    async function changeApplicationStatus(
        applicationId,
        status
    ) {

        try {

            await updateApplicationStatus(
                applicationId,
                status
            );

            setMessage(
                "Application status updated."
            );

            if (selectedDrive) {

                await loadApplicants(
                    selectedDrive.id
                );
            }

            await loadDashboard();


        } catch (err) {

            setError(err.message);
        }
    }


    return (

        <div>


            <div className="page-title-row">

                <div>

                    <h2>
                        Coordinator Dashboard
                    </h2>

                    <p className="muted">
                        Manage placement drives and
                        student recruitment progress.
                    </p>

                </div>

            </div>


            {error && (

                <div className="alert error-alert">
                    {error}
                </div>
            )}


            {message && (

                <div className="alert success-alert">
                    {message}
                </div>
            )}


            <div className="stats-grid">

                <div className="stat-card">

                    <h3>Total Drives</h3>

                    <p>
                        {stats.totalDrives}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>Open Drives</h3>

                    <p>
                        {stats.openDrives}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>Applications</h3>

                    <p>
                        {
                            stats.totalApplications
                        }
                    </p>

                </div>


                <div className="stat-card">

                    <h3>Selected</h3>

                    <p>
                        {
                            stats.selectedStudents
                        }
                    </p>

                </div>


                <div className="stat-card">

                    <h3>Interview Stage</h3>

                    <p>
                        {
                            stats.interviewStage
                        }
                    </p>

                </div>

            </div>


            <section className="panel">

                <div className="section-title-row">

                    <h2>
                        {editingDriveId
                            ? "Edit Placement Drive"
                            : "Post New Placement Drive"}
                    </h2>


                    {editingDriveId && (

                        <button
                            className="secondary-button"
                            onClick={
                                cancelEditing
                            }
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>


                <form
                    className="form-grid"
                    onSubmit={
                        handleDriveSubmit
                    }
                >

                    <label>
                        Company Name

                        <input
                            required
                            name="companyName"
                            value={
                                form.companyName
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Role

                        <input
                            required
                            name="role"
                            value={
                                form.role
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Package LPA

                        <input
                            required
                            type="number"
                            step="0.1"
                            name="packageLpa"
                            value={
                                form.packageLpa
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Location

                        <input
                            required
                            name="location"
                            value={
                                form.location
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Minimum CGPA

                        <input
                            required
                            type="number"
                            step="0.01"
                            name="minimumCgpa"
                            value={
                                form.minimumCgpa
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Maximum Backlogs

                        <input
                            required
                            type="number"
                            name="maxBacklogs"
                            value={
                                form.maxBacklogs
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Deadline

                        <input
                            required
                            type="date"
                            name="deadline"
                            value={
                                form.deadline
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label>
                        Eligible Departments

                        <input
                            required
                            name="eligibleDepartments"
                            placeholder="CSE, IT, ECE"
                            value={
                                form
                                    .eligibleDepartments
                            }
                            onChange={
                                handleFormChange
                            }
                        />
                    </label>


                    <label className="full-width">

                        Description

                        <textarea
                            name="description"
                            rows="4"
                            value={
                                form.description
                            }
                            onChange={
                                handleFormChange
                            }
                        />

                    </label>


                    <div className="full-width">

                        <button
                            className="primary-button"
                            type="submit"
                        >

                            {editingDriveId
                                ? "Update Drive"
                                : "Post Drive"}

                        </button>

                    </div>

                </form>

            </section>


            <section className="section-space">

                <h2>
                    Manage Placement Drives
                </h2>


                <div className="drive-grid">

                    {drives.map(
                        drive => (

                            <div
                                className="drive-card"
                                key={drive.id}
                            >

                                <div className="drive-top">

                                    <h3>
                                        {
                                            drive.companyName
                                        }
                                    </h3>

                                    <span
                                        className={
                                            drive.status ===
                                            "OPEN"
                                                ? "status open"
                                                : "status closed"
                                        }
                                    >
                                        {
                                            drive.status ||
                                            "OPEN"
                                        }
                                    </span>

                                </div>


                                <h4>
                                    {drive.role}
                                </h4>


                                <p>
                                    <strong>
                                        Package:
                                    </strong>{" "}
                                    {drive.packageLpa} LPA
                                </p>


                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {drive.location}
                                </p>


                                <p>
                                    <strong>
                                        Deadline:
                                    </strong>{" "}
                                    {drive.deadline}
                                </p>


                                <div className="card-actions">

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            openApplicants(
                                                drive
                                            )
                                        }
                                    >
                                        Applicants
                                    </button>


                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            startEditing(
                                                drive
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            changeDriveStatus(
                                                drive
                                            )
                                        }
                                    >

                                        {drive.status ===
                                        "OPEN"
                                            ? "Close"
                                            : "Open"}

                                    </button>


                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            handleDeleteDrive(
                                                drive.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>


                <Pagination
                    page={drivePage}
                    totalPages={
                        driveTotalPages
                    }
                    onPageChange={
                        setDrivePage
                    }
                />

            </section>


            {selectedDrive && (

                <section className="section-space panel">

                    <div className="section-title-row">

                        <div>

                            <h2>
                                Applicants
                            </h2>

                            <p className="muted">

                                {
                                    selectedDrive.companyName
                                }

                                {" — "}

                                {
                                    selectedDrive.role
                                }

                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                setSelectedDrive(
                                    null
                                )
                            }
                        >
                            Close
                        </button>

                    </div>


                    {applicants.length === 0 ? (

                        <div className="empty-state">

                            No students have applied
                            to this drive.

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Student</th>
                                        <th>Department</th>
                                        <th>CGPA</th>
                                        <th>Backlogs</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {applicants.map(
                                        application => (

                                            <tr
                                                key={
                                                    application.id
                                                }
                                            >

                                                <td>

                                                    {
                                                        application
                                                            .student
                                                            .user
                                                            .name
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        application
                                                            .student
                                                            .department
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        application
                                                            .student
                                                            .cgpa
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        application
                                                            .student
                                                            .backlogs
                                                    }

                                                </td>


                                                <td>

                                                    <select
                                                        value={
                                                            application
                                                                .status
                                                        }
                                                        onChange={
                                                            event =>
                                                                changeApplicationStatus(
                                                                    application.id,
                                                                    event.target.value
                                                                )
                                                        }
                                                    >

                                                        {
                                                            APPLICATION_STATUSES
                                                                .map(
                                                                    status => (

                                                                        <option
                                                                            key={
                                                                                status
                                                                            }
                                                                            value={
                                                                                status
                                                                            }
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </option>
                                                                    )
                                                                )
                                                        }

                                                    </select>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}


                    <Pagination
                        page={
                            applicantPage
                        }
                        totalPages={
                            applicantTotalPages
                        }
                        onPageChange={
                            setApplicantPage
                        }
                    />

                </section>
            )}

        </div>
    );
}

export default CoordinatorDashboard;