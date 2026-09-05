import {
    useEffect,
    useState
} from "react";

import {

    applyForDrive,
    getPlacementDrives,
    getStudent,
    getStudentApplications,
    updateStudent

} from "../services/api";

import Pagination from "../components/Pagination";


function StudentDashboard({
    studentId
}) {

    const [student, setStudent] =
        useState(null);

    const [editingProfile, setEditingProfile] =
        useState(false);

    const [drives, setDrives] =
        useState([]);

    const [drivePage, setDrivePage] =
        useState(0);

    const [driveTotalPages, setDriveTotalPages] =
        useState(0);

    const [applications, setApplications] =
        useState([]);

    const [applicationPage, setApplicationPage] =
        useState(0);

    const [
        applicationTotalPages,
        setApplicationTotalPages
    ] = useState(0);

    const [filters, setFilters] =
        useState({
            company: "",
            role: "",
            location: ""
        });

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadStudent();

    }, [studentId]);


    useEffect(() => {

        loadDrives();

    }, [drivePage]);


    useEffect(() => {

        loadApplications();

    }, [applicationPage]);


    async function loadStudent() {

        try {

            const data =
                await getStudent(studentId);

            setStudent(data);

        } catch (err) {

            setError(err.message);
        }
    }


    async function loadDrives() {

        try {

            setLoading(true);

            const data =
                await getPlacementDrives({
                    page: drivePage,
                    size: 6,
                    company: filters.company,
                    role: filters.role,
                    location: filters.location
                });

            setDrives(data.content);

            setDriveTotalPages(
                data.totalPages
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    }


    async function loadApplications() {

        try {

            const data =
                await getStudentApplications(
                    studentId,
                    applicationPage,
                    5
                );

            setApplications(
                data.content
            );

            setApplicationTotalPages(
                data.totalPages
            );

        } catch (err) {

            setError(err.message);
        }
    }


    async function handleApply(
        driveId
    ) {

        try {

            setError("");
            setMessage("");

            await applyForDrive(
                studentId,
                driveId
            );

            setMessage(
                "Application submitted successfully."
            );

            setApplicationPage(0);

            await loadApplications();

        } catch (err) {

            setError(err.message);
        }
    }


    function handleFilterChange(event) {

        const {
            name,
            value
        } = event.target;

        setFilters({
            ...filters,
            [name]: value
        });
    }


    function handleSearch(event) {

        event.preventDefault();

        setDrivePage(0);

        loadDrives();
    }


    function clearFilters() {

        setFilters({
            company: "",
            role: "",
            location: ""
        });

        setDrivePage(0);

        setTimeout(
            () => loadDrives(),
            0
        );
    }


    function handleProfileChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;

        if (
            name === "name" ||
            name === "email"
        ) {

            setStudent({
                ...student,

                user: {
                    ...student.user,
                    [name]: value
                }
            });

        } else {

            setStudent({
                ...student,
                [name]: value
            });
        }
    }


    async function saveProfile(
        event
    ) {

        event.preventDefault();

        try {

            setError("");

            const payload = {

                user: {
                    name: student.user.name,
                    email: student.user.email
                },

                department:
                    student.department,

                cgpa:
                    Number(student.cgpa),

                backlogs:
                    Number(student.backlogs),

                graduationYear:
                    Number(
                        student.graduationYear
                    )
            };

            const updated =
                await updateStudent(
                    studentId,
                    payload
                );

            setStudent(updated);

            setEditingProfile(false);

            setMessage(
                "Student profile updated."
            );

        } catch (err) {

            setError(err.message);
        }
    }


    function hasApplied(
        driveId
    ) {

        return applications.some(
            application =>
                application
                    .placementDrive
                    .id === driveId
        );
    }


    if (loading && !student) {

        return (
            <p>Loading student dashboard...</p>
        );
    }


    return (

        <div>

            <div className="page-title-row">

                <div>

                    <h2>
                        Student Dashboard
                    </h2>

                    <p className="muted">
                        Browse opportunities and track
                        your placement applications.
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


            {student && (

                <section className="panel">

                    <div className="section-title-row">

                        <h3>
                            My Profile
                        </h3>

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setEditingProfile(
                                    !editingProfile
                                )
                            }
                        >
                            {editingProfile
                                ? "Cancel"
                                : "Edit Profile"}
                        </button>

                    </div>


                    {!editingProfile ? (

                        <div className="profile-grid">

                            <div>
                                <span>Name</span>
                                <strong>
                                    {student.user.name}
                                </strong>
                            </div>

                            <div>
                                <span>Department</span>
                                <strong>
                                    {student.department}
                                </strong>
                            </div>

                            <div>
                                <span>CGPA</span>
                                <strong>
                                    {student.cgpa}
                                </strong>
                            </div>

                            <div>
                                <span>Backlogs</span>
                                <strong>
                                    {student.backlogs}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Graduation Year
                                </span>
                                <strong>
                                    {student.graduationYear}
                                </strong>
                            </div>

                        </div>

                    ) : (

                        <form
                            className="form-grid"
                            onSubmit={saveProfile}
                        >

                            <label>
                                Name

                                <input
                                    name="name"
                                    value={
                                        student.user.name
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <label>
                                Email

                                <input
                                    name="email"
                                    value={
                                        student.user.email
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <label>
                                Department

                                <input
                                    name="department"
                                    value={
                                        student.department
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <label>
                                CGPA

                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={
                                        student.cgpa
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <label>
                                Backlogs

                                <input
                                    type="number"
                                    name="backlogs"
                                    value={
                                        student.backlogs
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <label>
                                Graduation Year

                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={
                                        student
                                            .graduationYear
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />
                            </label>


                            <div className="full-width">

                                <button
                                    className="primary-button"
                                    type="submit"
                                >
                                    Save Profile
                                </button>

                            </div>

                        </form>
                    )}

                </section>
            )}


            <section>

                <h2>
                    Placement Drives
                </h2>


                <form
                    className="filter-bar"
                    onSubmit={handleSearch}
                >

                    <input
                        name="company"
                        placeholder="Company"
                        value={
                            filters.company
                        }
                        onChange={
                            handleFilterChange
                        }
                    />

                    <input
                        name="role"
                        placeholder="Role"
                        value={
                            filters.role
                        }
                        onChange={
                            handleFilterChange
                        }
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        value={
                            filters.location
                        }
                        onChange={
                            handleFilterChange
                        }
                    />

                    <button
                        className="primary-button"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </form>


                <div className="drive-grid">

                    {drives.map(
                        drive => {

                            const applied =
                                hasApplied(
                                    drive.id
                                );

                            return (

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
                                        {
                                            drive.description
                                        }
                                    </p>


                                    <div className="drive-details">

                                        <span>
                                            📍 {
                                                drive.location
                                            }
                                        </span>

                                        <span>
                                            ₹ {
                                                drive.packageLpa
                                            } LPA
                                        </span>

                                        <span>
                                            CGPA ≥ {
                                                drive.minimumCgpa
                                            }
                                        </span>

                                        <span>
                                            Backlogs ≤ {
                                                drive.maxBacklogs
                                            }
                                        </span>

                                    </div>


                                    <p>
                                        <strong>
                                            Departments:
                                        </strong>{" "}

                                        {
                                            drive
                                                .eligibleDepartments
                                                ?.join(", ")
                                        }
                                    </p>


                                    <p>
                                        <strong>
                                            Deadline:
                                        </strong>{" "}

                                        {drive.deadline}
                                    </p>


                                    <button
                                        className="primary-button full-button"
                                        disabled={
                                            drive.status !==
                                                "OPEN" ||
                                            applied
                                        }
                                        onClick={() =>
                                            handleApply(
                                                drive.id
                                            )
                                        }
                                    >

                                        {applied
                                            ? "Applied"
                                            : drive.status ===
                                              "CLOSED"
                                            ? "Applications Closed"
                                            : "Apply Now"}

                                    </button>

                                </div>
                            );
                        }
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


            <section className="section-space">

                <h2>
                    My Applications
                </h2>


                {applications.length === 0 ? (

                    <div className="empty-state">
                        You haven't applied to any
                        placement drive yet.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Applied</th>
                                </tr>

                            </thead>

                            <tbody>

                                {applications.map(
                                    application => (

                                        <tr
                                            key={
                                                application.id
                                            }
                                        >

                                            <td>
                                                {
                                                    application
                                                        .placementDrive
                                                        .companyName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    application
                                                        .placementDrive
                                                        .role
                                                }
                                            </td>

                                            <td>

                                                <span className="application-status">

                                                    {
                                                        application.status
                                                    }

                                                </span>

                                            </td>

                                            <td>
                                                {
                                                    application.appliedAt
                                                        ?.replace(
                                                            "T",
                                                            " "
                                                        )
                                                        .slice(
                                                            0,
                                                            16
                                                        )
                                                }
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
                        applicationPage
                    }
                    totalPages={
                        applicationTotalPages
                    }
                    onPageChange={
                        setApplicationPage
                    }
                />

            </section>

        </div>
    );
}

export default StudentDashboard;
