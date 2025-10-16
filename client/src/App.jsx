import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import EditJob from "./pages/EditJob.jsx";
import AllJobs from "./pages/AllJobs.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-jobs"
          element={
            <ProtectedRoute>
              <AllJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myjobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-job/:id" // <-- new route for editing
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
