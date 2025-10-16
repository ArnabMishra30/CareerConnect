// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";

// axios.defaults.withCredentials = true; // send cookies

// export default function Navbar() {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me");
//         setRole(res.data.role);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
//       <Link to="/home" className="text-xl font-bold">
//         Job Portal
//       </Link>
//       <div className="flex items-center space-x-4">
//         <Link to="/home" className="hover:underline">Home</Link>
//         <Link to="/all-jobs" className="hover:underline">
//           All Jobs
//         </Link>

//         {role === "job-poster" && (
//           <>
//             <Link to="/create-job" className="hover:underline">Create Job</Link>
//             <Link to="/myjobs" className="hover:underline">My Jobs</Link>
//           </>
//         )}

//         {role === "job-seeker" && (
//           <>
//             <Link to="/update-profile" className="hover:underline">Profile</Link>
//             <Link to="/my-applications" className="hover:underline">My Applications</Link>
//           </>
//         )}

//         <button
//           onClick={async () => {
//             await axios.post("http://localhost:5000/api/auth/logout");
//             window.location.href = "/";
//           }}
//           className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 hover:cursor-pointer"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Briefcase, User, Home, ListFilter } from "lucide-react"; // Imported more icons for flair

axios.defaults.withCredentials = true;

// Component to render a single navigation link with a focus on style
const NavLink = ({ to, children, icon: Icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-violet-700 hover:text-white group"
  >
    {Icon && <Icon size={20} className="text-violet-200 group-hover:text-white" />}
    <span className="font-medium">{children}</span>
  </Link>
);

export default function Navbar() {
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // NOTE: Ensure your backend is running at this address
        const res = await axios.get("http://localhost:5000/api/auth/me");
        setRole(res.data.role);
      } catch (err) {
        // Silently fail if not logged in/error, the role will remain null (logged out state)
        // console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    // Close mobile menu on logout
    setMenuOpen(false);
    window.location.href = "/";
  };

  const commonLinks = (
    <>
      <NavLink to="/home" icon={Home} onClick={() => setMenuOpen(false)}>Home</NavLink>
      <NavLink to="/all-jobs" icon={ListFilter} onClick={() => setMenuOpen(false)}>All Jobs</NavLink>
    </>
  );

  const jobPosterLinks = (
    <>
      <NavLink to="/create-job" icon={Briefcase} onClick={() => setMenuOpen(false)}>Create Job</NavLink>
      <NavLink to="/myjobs" icon={ListFilter} onClick={() => setMenuOpen(false)}>My Jobs</NavLink>
    </>
  );

  const jobSeekerLinks = (
    <>
      <NavLink to="/update-profile" icon={User} onClick={() => setMenuOpen(false)}>Profile</NavLink>
      <NavLink to="/my-applications" icon={Briefcase} onClick={() => setMenuOpen(false)}>My Applications</NavLink>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-indigo-800 to-violet-900 text-white p-4 flex justify-between items-center relative shadow-xl z-50">
      {/* Left side - Logo */}
      <Link to="/home" className="text-2xl font-extrabold tracking-wider text-violet-300 transition-colors duration-300 hover:text-white">
        Career Connect ✨
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-2 text-violet-200">
        {commonLinks}
        {role === "job-poster" && jobPosterLinks}
        {role === "job-seeker" && jobSeekerLinks}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-4 bg-white text-indigo-800 font-semibold px-4 py-1.5 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden focus:outline-none p-1 rounded-full hover:bg-violet-700 transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
      </button>

      {/* Mobile Dropdown Menu with Framer Motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            // Positioned fixed to prevent scroll issues, using top-[68px] to align below the navbar height
            className="fixed top-[68px] left-0 w-full bg-indigo-800 border-t border-violet-700 text-violet-200 flex flex-col p-4 md:hidden shadow-2xl z-40 origin-top"
          >
            <div className="flex flex-col space-y-2">
                {commonLinks}
                {role === "job-poster" && jobPosterLinks}
                {role === "job-seeker" && jobSeekerLinks}
            </div>

            <div className="mt-4 pt-4 border-t border-violet-700">
                <button
                onClick={handleLogout}
                className="w-full bg-white text-indigo-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                Logout
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}