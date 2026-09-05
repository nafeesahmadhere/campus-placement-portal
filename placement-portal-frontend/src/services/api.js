const API_URL = "http://localhost:8080/api";

async function handleResponse(response) {

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {

        const message =
            typeof data === "string"
                ? data
                : data.message || "Request failed";

        const error = new Error(message);

        error.status = response.status;

        throw error;
    }

    return data;
}


// ===============================
// PLACEMENT DRIVES
// ===============================

export async function getPlacementDrives({

    page = 0,
    size = 6,
    sortBy = "createdAt",
    direction = "desc",

    company = "",
    role = "",
    location = "",
    studentCgpa = null

} = {}) {

    const params =
        new URLSearchParams();

    params.append("page", page);
    params.append("size", size);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    if (company) {
        params.append("company", company);
    }

    if (role) {
        params.append("role", role);
    }

    if (location) {
        params.append("location", location);
    }

    if (studentCgpa !== null) {
        params.append(
            "studentCgpa",
            studentCgpa
        );
    }

    const response = await fetch(
        `${API_URL}/drives?${params.toString()}`
    );

    return handleResponse(response);
}


export async function createPlacementDrive(
    drive
) {

    const response = await fetch(
        `${API_URL}/drives`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(drive)
        }
    );

    return handleResponse(response);
}


export async function updatePlacementDrive(
    id,
    drive
) {

    const response = await fetch(
        `${API_URL}/drives/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(drive)
        }
    );

    return handleResponse(response);
}


export async function updateDriveStatus(
    id,
    status
) {

    const response = await fetch(
        `${API_URL}/drives/${id}/status?status=${status}`,
        {
            method: "PUT"
        }
    );

    return handleResponse(response);
}


export async function deletePlacementDrive(
    id
) {

    const response = await fetch(
        `${API_URL}/drives/${id}`,
        {
            method: "DELETE"
        }
    );

    return handleResponse(response);
}


// ===============================
// DASHBOARD
// ===============================

export async function getDashboardStats() {

    const response = await fetch(
        `${API_URL}/dashboard/stats`
    );

    return handleResponse(response);
}


// ===============================
// STUDENTS
// ===============================

export async function getStudent(
    studentId
) {

    const response = await fetch(
        `${API_URL}/students/${studentId}`
    );

    return handleResponse(response);
}


export async function updateStudent(
    studentId,
    student
) {

    const response = await fetch(
        `${API_URL}/students/${studentId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)
        }
    );

    return handleResponse(response);
}


// ===============================
// APPLICATIONS
// ===============================

export async function applyForDrive(
    studentId,
    driveId
) {

    const response = await fetch(

        `${API_URL}/applications/apply?studentId=${studentId}&driveId=${driveId}`,

        {
            method: "POST"
        }
    );

    return handleResponse(response);
}


export async function getStudentApplications(
    studentId,
    page = 0,
    size = 5
) {

    const response = await fetch(

        `${API_URL}/applications/student/${studentId}?page=${page}&size=${size}`
    );

    return handleResponse(response);
}


export async function getDriveApplications(
    driveId,
    page = 0,
    size = 10
) {

    const response = await fetch(

        `${API_URL}/applications/drive/${driveId}?page=${page}&size=${size}`
    );

    return handleResponse(response);
}


export async function updateApplicationStatus(
    applicationId,
    status
) {

    const response = await fetch(

        `${API_URL}/applications/${applicationId}/status?status=${status}`,

        {
            method: "PUT"
        }
    );

    return handleResponse(response);
}