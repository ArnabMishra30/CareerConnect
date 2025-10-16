// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import JobCard from "../components/JobCard";

// axios.defaults.withCredentials = true;

// export default function AllJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUserAndJobs = async () => {
//       try {
//         const userRes = await axios.get("http://localhost:5000/api/auth/me");
//         setUser(userRes.data);

//         const jobsRes = await axios.get("http://localhost:5000/api/jobs");
//         setJobs(jobsRes.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUserAndJobs();
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar user={user} />

//       <main className="flex-1 container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {jobs.map(job => (
//           <JobCard key={job._id} job={job} role={user?.role} />
//         ))}
//       </main>

//       <Footer />
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { Loader2 } from "lucide-react";

axios.defaults.withCredentials = true;

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      setIsLoading(true);
      try {
        const userRes = await axios.get(`${API_URL}/api/auth/me`);
        setUser(userRes.data);

        const jobsRes = await axios.get(`${API_URL}/api/jobs`);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error("Error fetching user or jobs:", err);
        setUser(null);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndJobs();
  }, []);

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="animate-spin text-violet-600" size={48} />
            <p className="ml-4 text-xl text-gray-700 mt-4">Loading job listings...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar user={user} />

      {/* ----------------- */}
      {/* Hero Section - Consistent Vibrant Theme */}
      {/* ----------------- */}
      <section className="relative text-center bg-gradient-to-br from-indigo-800 to-violet-900 text-white px-6 py-20 overflow-hidden shadow-lg z-10">
        <motion.div
          className="absolute inset-0 -z-10 opacity-20"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 80%)' }}
        />

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md"
        >
          {user?.role === "job-poster"
            ? "Global Job Market Overview 🎯"
            : "Find Your Next Career Move 🚀"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-violet-200"
        >
          {user?.role === "job-poster"
            ? "View and manage all available job posts across the platform."
            : "Browse thousands of high-quality opportunities that match your skills."}
        </motion.p>
      </section>
      
      {/* ----------------- */}
      {/* Job Listings Grid - IMPROVED COLOR/LAYOUT */}
      {/* ----------------- */}
      <main className="flex-1 max-w-6xl mx-auto p-8 pt-10 w-full bg-white shadow-xl sm:rounded-xl -mt-16 mb-8 relative z-20">
        
        {/* Improved Heading and Border */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center sm:text-left border-b-2 border-violet-500 pb-4">
            Showing {jobs.length} Active Listings
        </h2>

        {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job, index) => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                        {/* Ensure JobCard uses clean backgrounds (e.g., bg-white) */}
                        <JobCard job={job} role={user?.role} />
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 border border-dashed border-gray-300 bg-gray-50 rounded-xl shadow-inner">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Active Jobs Found</h2>
                <p className="text-gray-500">Please check back later for new opportunities.</p>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
}