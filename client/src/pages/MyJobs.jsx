// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function MyJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   // Fetch logged-in user for Navbar
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           withCredentials: true,
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Fetch my posted jobs
//   const fetchMyJobs = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/jobs/my-jobs", {
//         withCredentials: true,
//       });
//       setJobs(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (jobId) => {
//     if (!window.confirm("Are you sure you want to delete this job?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
//         withCredentials: true,
//       });
//       setJobs(jobs.filter((job) => job._id !== jobId));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to delete job");
//     }
//   };

//   useEffect(() => {
//     fetchMyJobs();
//   }, []);

//   if (loading) return <p className="text-center mt-8">Loading...</p>;

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <Navbar user={user} />

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto p-6">
//         <h2 className="text-2xl font-bold mb-6">My Jobs</h2>

//         {jobs.length === 0 ? (
//           <p>No jobs posted yet by You.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {jobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="p-4 bg-white rounded-lg shadow flex flex-col justify-between"
//               >
//                 <div>
//                   <h3 className="text-xl font-bold text-indigo-600">
//                     {job.jobTitle}
//                   </h3>
//                   <p className="text-gray-500">{job.company}</p>
//                   <p className="text-sm">{job.location}</p>
//                 </div>

//                 <div className="mt-4 flex gap-2">
//                   <button
//                     onClick={() =>
//                       window.location.assign(`/edit-job/${job._id}`)
//                     }
//                     className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(job._id)}
//                     className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }



import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Trash2,
    Edit,
    Loader2,
    ListOrdered,
    PlusCircle,
    Users,
    FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [applicants, setApplicants] = useState({});
    const [loadingApplicants, setLoadingApplicants] = useState({});

    // Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me");
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    // Fetch my jobs
    const fetchMyJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/jobs/my-jobs");
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
            alert("Job deleted successfully.");
            setJobs(jobs.filter((job) => job._id !== jobId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete job");
        }
    };

    // Fetch applicants for a job
    const fetchApplicants = async (jobId) => {
        setLoadingApplicants((prev) => ({ ...prev, [jobId]: true }));
        try {
            const res = await axios.get(
                `http://localhost:5000/api/applications/job/${jobId}`
            );
            setApplicants((prev) => ({
                ...prev,
                [jobId]: res.data,
                expandedApplicant: null, // track which applicant details are expanded
            }));
        } catch (err) {
            console.error("Error fetching applicants:", err);
            alert(err.response?.data?.message || "Failed to load applicants");
        } finally {
            setLoadingApplicants((prev) => ({ ...prev, [jobId]: false }));
        }
    };

    // Handle status update
    const handleStatusChange = async (applicationId, jobId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/applications/${applicationId}/status`,
                { status: newStatus }
            );

            // Update state locally for smoother UX
            setApplicants((prev) => ({
                ...prev,
                [jobId]: prev[jobId].map((a) =>
                    a._id === applicationId ? { ...a, status: newStatus } : a
                ),
            }));
            alert("Status updated successfully.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    // Loading UI
    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-violet-600" size={48} />
                <p className="text-xl text-gray-700 mt-4">Fetching your posted jobs...</p>
            </div>
        );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} />

            <main className="flex-1 py-12 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
                <div className="container mx-auto">
                    {/* Heading */}
                    <div className="flex items-center justify-between mb-8 text-white">
                        <h2 className="text-4xl font-extrabold flex items-center">
                            <ListOrdered className="mr-3" size={32} />
                            My Posted Jobs
                        </h2>
                        <Link
                            to="/create-job"
                            className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        >
                            <PlusCircle size={18} className="mr-2" />
                            Post New Job
                        </Link>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl shadow-lg border-2 border-dashed border-violet-400">
                            <Briefcase className="mx-auto text-violet-500" size={48} />
                            <p className="text-xl mt-4 font-semibold text-gray-700">
                                No jobs posted yet.
                            </p>
                            <p className="text-gray-500 mt-2">
                                Time to create your first job post!
                            </p>
                            <Link
                                to="/create-job"
                                className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
                            >
                                Post a Job
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="p-6 bg-white rounded-xl shadow-xl border-l-4 border-violet-600 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {job.jobTitle}
                                        </h3>
                                        <p className="text-violet-600 font-medium mt-1 mb-3">
                                            {job.company}
                                        </p>

                                        <div className="space-y-2 text-gray-600 text-sm">
                                            <p className="flex items-center">
                                                <MapPin size={16} className="mr-2 text-violet-500" />
                                                {job.location}
                                            </p>
                                            <p className="flex items-center">
                                                <DollarSign size={16} className="mr-2 text-violet-500" />
                                                {job.salaryRange}
                                            </p>
                                            <p className="flex items-center">
                                                <Clock size={16} className="mr-2 text-violet-500" />
                                                <span className="font-semibold">{job.jobType}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                                        <Link
                                            to={`/edit-job/${job._id}`}
                                            className="flex-1 flex items-center justify-center text-center bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                                        >
                                            <Edit size={16} className="mr-1" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="flex-1 flex items-center justify-center text-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} className="mr-1" />
                                            Delete
                                        </button>
                                    </div>

                                    {/* View Applicants Section */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => {
                                                if (expandedJobId === job._id) {
                                                    setExpandedJobId(null);
                                                } else {
                                                    setExpandedJobId(job._id);
                                                    if (!applicants[job._id]) fetchApplicants(job._id);
                                                }
                                            }}
                                            className="w-full mt-3 flex items-center justify-center text-violet-700 font-semibold border border-violet-600 px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
                                        >
                                            <Users className="mr-2" size={18} />
                                            {expandedJobId === job._id
                                                ? "Hide Applicants"
                                                : "View Applicants"}
                                        </button>

                                        {expandedJobId === job._id && (
                                            <div className="mt-4 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                                                {loadingApplicants[job._id] ? (
                                                    <div className="flex justify-center py-6">
                                                        <Loader2 className="animate-spin text-violet-600" />
                                                    </div>
                                                ) : applicants[job._id]?.length === 0 ? (
                                                    <p className="text-center text-gray-500">
                                                        No applicants yet.
                                                    </p>
                                                ) : (
                                                    applicants[job._id]?.map((app) => (
                                                        <div
                                                            key={app._id}
                                                            className="p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="text-lg font-bold text-gray-800">
                                                                        {app.applicant.firstName}{" "}
                                                                        {app.applicant.lastName}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600">
                                                                        {app.applicant.email}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        📍 {app.applicant.location || "N/A"}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        🧠 {app.applicant.skills?.join(", ") || "N/A"}
                                                                    </p>
                                                                </div>

                                                                {/* Status Dropdown */}
                                                                <div>
                                                                    <select
                                                                        value={app.status}
                                                                        onChange={(e) =>
                                                                            handleStatusChange(
                                                                                app._id,
                                                                                job._id,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="border border-gray-300 text-gray-700 rounded-md px-2 py-1"
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="shortlisted">Shortlisted</option>
                                                                        <option value="rejected">Rejected</option>
                                                                        <option value="accepted">Accepted</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            {/* View Full Details */}
                                                            <div className="mt-3">
                                                                <button
                                                                    onClick={() =>
                                                                        setApplicants((prev) => ({
                                                                            ...prev,
                                                                            expandedApplicant:
                                                                                prev.expandedApplicant === app._id
                                                                                    ? null
                                                                                    : app._id,
                                                                        }))
                                                                    }
                                                                    className="text-sm text-violet-600 font-semibold hover:underline"
                                                                >
                                                                    {applicants.expandedApplicant === app._id
                                                                        ? "Hide Details"
                                                                        : "View Full Details"}
                                                                </button>
                                                            </div>

                                                            {applicants.expandedApplicant === app._id && (
                                                                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                                                                    <p>
                                                                        <span className="font-semibold">Phone:</span>{" "}
                                                                        {app.applicant.phone || "N/A"}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-semibold">Education:</span>{" "}
                                                                        {app.applicant.education || "N/A"}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-semibold">Experience:</span>{" "}
                                                                        {app.applicant.experience || "N/A"}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-semibold">About:</span>{" "}
                                                                        {app.applicant.bio || "N/A"}
                                                                    </p>
                                                                    {app.applicant.cvUrl && (
                                                                        <a
                                                                            href={app.applicant.cvUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center text-indigo-600 hover:underline font-medium"
                                                                        >
                                                                            <FileText size={16} className="mr-1" />
                                                                            View CV
                                                                        </a>
                                                                    )}

                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
