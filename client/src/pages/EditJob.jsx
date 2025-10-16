// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function EditJob() {
//   const { id } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [user, setUser] = useState(null);

//   // Fetch job data
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true })
//       .then((res) => {
//         setFormData({
//           ...res.data,
//           skillsRequired: res.data.skillsRequired?.join(", ") || "",
//         });
//       })
//       .catch((err) => console.error(err));
//   }, [id]);

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
//       await axios.put(`http://localhost:5000/api/jobs/${id}`, payload, {
//         withCredentials: true,
//       });
//       alert("Job updated successfully!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update job");
//     }
//   };

//   if (!formData) return <p className="text-center mt-8">Loading...</p>;

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <Navbar user={user} />

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto p-6">
//         <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
//           <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="jobTitle"
//               placeholder="Job Title"
//               value={formData.jobTitle}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <input
//               type="text"
//               name="company"
//               placeholder="Company"
//               value={formData.company}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <input
//               type="text"
//               name="skillsRequired"
//               placeholder="Skills (comma-separated)"
//               value={formData.skillsRequired}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <input
//               type="text"
//               name="salaryRange"
//               placeholder="Salary Range"
//               value={formData.salaryRange}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <select
//               name="jobType"
//               value={formData.jobType}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Contract</option>
//               <option>Internship</option>
//             </select>
//             <button
//               type="submit"
//               className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//             >
//               Update Job
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
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, Building, MapPin, FileText, DollarSign, Code, Clock, Loader2, Edit } from "lucide-react";

axios.defaults.withCredentials = true;

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch job data
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true })
            .then((res) => {
                setFormData({
                    ...res.data,
                    // Convert array of skills back to a comma-separated string for the input field
                    skillsRequired: res.data.skillsRequired?.join(", ") || "",
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

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
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                // Convert skills string back to an array for the backend
                skillsRequired: formData.skillsRequired
                    .split(",")
                    .map((skill) => skill.trim()),
            };
            await axios.put(`http://localhost:5000/api/jobs/${id}`, payload, {
                withCredentials: true,
            });
            alert("Job updated successfully! 🎉");
            navigate("/myjobs");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update job");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !formData) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="animate-spin text-violet-600" size={48} />
            <p className="ml-4 text-xl text-gray-700 mt-4">Loading job details...</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} />

            {/* 💡 OUTER DIV: Dark Gradient Background for High Contrast */}
            <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
                
                {/* 💡 INNER DIV: Clean White Form Card with Theme Accent */}
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full border-t-8 border-violet-600">
                    
                    <div className="flex flex-col items-center mb-8">
                        <Edit className="text-violet-600 mb-4" size={40} />
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            Edit Job Post
                        </h2>
                        <p className="text-gray-500 mt-1">Make changes and update the job details below.</p>
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
                                placeholder="Job Title"
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
                                placeholder="Company"
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
                                placeholder="Location"
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
                                placeholder="Description"
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
                                placeholder="Skills (comma-separated)"
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
                                placeholder="Salary Range"
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
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.01]'
                                }`}
                        >
                            {isSubmitting && <Loader2 className="animate-spin mr-2" size={20} />}
                            <span>{isSubmitting ? "Updating Job..." : "Update Job"}</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}