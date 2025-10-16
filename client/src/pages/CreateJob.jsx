// import { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function CreateJob() {
//   const [formData, setFormData] = useState({
//     jobTitle: "",
//     company: "",
//     location: "",
//     description: "",
//     skillsRequired: "",
//     salaryRange: "",
//     jobType: "Full-time",
//   });

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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...formData,
//         skillsRequired: formData.skillsRequired
//           .split(",")
//           .map((skill) => skill.trim()),
//       };
//       await axios.post("http://localhost:5000/api/jobs", payload, {
//         withCredentials: true,
//       });
//       alert("Job created successfully!");
//       setFormData({
//         jobTitle: "",
//         company: "",
//         location: "",
//         description: "",
//         skillsRequired: "",
//         salaryRange: "",
//         jobType: "Full-time",
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create job");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <Navbar user={user} />

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
//           <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
//             Create Job
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="jobTitle"
//               placeholder="Job Title"
//               value={formData.jobTitle}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <input
//               type="text"
//               name="company"
//               placeholder="Company"
//               value={formData.company}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <input
//               type="text"
//               name="skillsRequired"
//               placeholder="Skills (comma-separated)"
//               value={formData.skillsRequired}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <input
//               type="text"
//               name="salaryRange"
//               placeholder="Salary Range"
//               value={formData.salaryRange}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//             <select
//               name="jobType"
//               value={formData.jobType}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//             >
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Contract</option>
//               <option>Internship</option>
//             </select>
//             <button
//               type="submit"
//               className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
//             >
//               Create Job
//             </button>
//           </form>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, Building, MapPin, FileText, DollarSign, Code, Clock, Loader2, PlusCircle } from "lucide-react"; // Import necessary icons

axios.defaults.withCredentials = true;

export default function CreateJob() {
    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        location: "",
        description: "",
        skillsRequired: "",
        salaryRange: "",
        jobType: "Full-time",
    });

    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Added for submit loading state
    const navigate = useNavigate();

    // Fetch logged-in user for Navbar
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me", {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Set loading state
        try {
            const payload = {
                ...formData,
                // Split skills and trim whitespace
                skillsRequired: formData.skillsRequired
                    .split(",")
                    .map((skill) => skill.trim()),
            };
            
            await axios.post("http://localhost:5000/api/jobs", payload, {
                withCredentials: true,
            });

            alert("Job created successfully! 🚀");
            navigate("/myjobs");
            // Reset form after successful submission
            setFormData({
                jobTitle: "",
                company: "",
                location: "",
                description: "",
                skillsRequired: "",
                salaryRange: "",
                jobType: "Full-time",
            });
        } catch (err) {
            console.error("Job creation failed:", err);
            alert(err.response?.data?.message || "Failed to create job");
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} />

            {/* 💡 OUTER DIV: Dark Gradient Background for High Contrast */}
            <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
                
                {/* 💡 INNER DIV: Clean White Form Card with Theme Accent */}
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full border-t-8 border-violet-600">
                    
                    <div className="flex flex-col items-center mb-8">
                        <PlusCircle className="text-violet-600 mb-4" size={40} />
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            Post a New Job
                        </h2>
                        <p className="text-gray-500 mt-1">Fill out the details to list your new job opening.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Job Title */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Briefcase size={16} className="inline mr-2 text-violet-500" />
                                Job Title
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="e.g., Senior Frontend Developer"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Building size={16} className="inline mr-2 text-violet-500" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="company"
                                placeholder="e.g., Tech Innovations Inc."
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <MapPin size={16} className="inline mr-2 text-violet-500" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g., Remote or New York, NY"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                        
                        {/* Description */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <FileText size={16} className="inline mr-2 text-violet-500" />
                                Job Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Detailed description of the role and responsibilities..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Skills Required */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Code size={16} className="inline mr-2 text-violet-500" />
                                Skills Required (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="skillsRequired"
                                placeholder="e.g., React, Node.js, AWS"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <DollarSign size={16} className="inline mr-2 text-violet-500" />
                                Salary Range
                            </label>
                            <input
                                type="text"
                                name="salaryRange"
                                placeholder="e.g., $100,000 - $120,000"
                                value={formData.salaryRange}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                        
                        {/* Job Type Select */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Clock size={16} className="inline mr-2 text-violet-500" />
                                Job Type
                            </label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>

                        {/* Submit Button with Gradient and Loading State */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 
                                ${isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 transform hover:scale-[1.01]'
                                }`}
                        >
                            {isSubmitting && <Loader2 className="animate-spin mr-2" size={20} />}
                            <span>{isSubmitting ? "Posting Job..." : "Create Job Post"}</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}