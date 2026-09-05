import {
    useState
} from "react";

import StudentDashboard
    from "./pages/StudentDashboard";

import CoordinatorDashboard
    from "./pages/CoordinatorDashboard";

import "./App.css";


function App() {

    // TEMPORARY
    // JWT will provide this later.
    const STUDENT_ID = 1;


    const [roleView, setRoleView] =
        useState("STUDENT");


    return (

        <div className="app">

            <header className="header">

                <div>

                    <h1>
                        Campus Placement Portal
                    </h1>

                    <p>
                        Placement drives and
                        recruitment tracking
                    </p>

                </div>


                <div className="nav-buttons">

                    <button
                        className={
                            roleView === "STUDENT"
                                ? "active-nav"
                                : ""
                        }
                        onClick={() =>
                            setRoleView(
                                "STUDENT"
                            )
                        }
                    >
                        Student
                    </button>


                    <button
                        className={
                            roleView ===
                            "COORDINATOR"
                                ? "active-nav"
                                : ""
                        }
                        onClick={() =>
                            setRoleView(
                                "COORDINATOR"
                            )
                        }
                    >
                        Coordinator
                    </button>

                </div>

            </header>


            <main className="container">

                {roleView === "STUDENT" ? (

                    <StudentDashboard
                        studentId={
                            STUDENT_ID
                        }
                    />

                ) : (

                    <CoordinatorDashboard />

                )}

            </main>

        </div>
    );
}

export default App;