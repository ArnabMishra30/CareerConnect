// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function UpdateProfile() {
//     const [loading, setLoading] = useState(true);
//     const [userId, setUserId] = useState(null);
//     const [user, setUser] = useState(null);
//     const { register, handleSubmit, reset } = useForm();
//     const navigate = useNavigate();

//     // ✅ Fetch current user info
//     useEffect(() => {
//         axios
//             .get("http://localhost:5000/api/auth/me", { withCredentials: true })
//             .then((res) => {
//                 setUserId(res.data.id);
//                 return axios.get(`http://localhost:5000/api/auth/user/${res.data.id}`, {
//                     withCredentials: true,
//                 });
//             })
//             .then((res) => {
//                 reset(res.data); // pre-fill form
//             })
//             .catch((err) => {
//                 console.error(err);
//                 navigate("/"); // redirect if not logged in
//             })
//             .finally(() => setLoading(false));
//     }, [reset, navigate]);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/auth/me");
//                 setUser(res.data);
//             } catch (err) {
//                 console.error("Error fetching user:", err);
//             }
//         };
//         fetchUser();
//     }, []);

//     // ✅ Handle form submit
//     const onSubmit = async (data) => {
//         try {
//             const formData = new FormData();
//             Object.keys(data).forEach((key) => {
//                 if (key === "cv" && data.cv[0]) {
//                     formData.append("cv", data.cv[0]); // file
//                 } else {
//                     formData.append(key, data[key]);
//                 }
//             });

//             await axios.put(
//                 "http://localhost:5000/api/auth/update-profile",
//                 formData,
//                 {
//                     withCredentials: true,
//                     headers: { "Content-Type": "multipart/form-data" },
//                 }
//             );

//             alert("Profile updated successfully");
//             navigate("/home");
//         } catch (err) {
//             console.error(err);
//             alert(err.response?.data?.message || "Error updating profile");
//         }
//     };

//     if (loading) return <p>Loading...</p>;

//     return (
//         <div className="flex flex-col min-h-screen">
//             <Navbar user={user} />
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
//                 <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
//                     <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
//                         Update Profile
//                     </h2>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div>
//                             <label className="block mb-1 font-medium">Phone</label>
//                             <input
//                                 {...register("phone")}
//                                 placeholder="Phone"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">Location</label>
//                             <input
//                                 {...register("location")}
//                                 placeholder="Location"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">Education</label>
//                             <input
//                                 {...register("education")}
//                                 placeholder="Education"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">Experience</label>
//                             <input
//                                 {...register("experience")}
//                                 placeholder="Experience"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">Skills</label>
//                             <input
//                                 {...register("skills")}
//                                 placeholder="Skills (comma separated)"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">GitHub Profile Link</label>
//                             <input
//                                 {...register("githubLink")}
//                                 placeholder="GitHub Profile Link"
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-medium">Upload CV</label>
//                             <input
//                                 type="file"
//                                 {...register("cv")}
//                                 className="w-full px-4 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
//                         >
//                             Save Changes
//                         </button>
//                     </form>
//                 </div>
//             </div>
//             <Footer />
//         </div >
//     );
// }



import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, MapPin, GraduationCap, Briefcase, Code, Github, FileText, UserCog, Loader2 } from "lucide-react";

axios.defaults.withCredentials = true;

export default function UpdateProfile() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const meRes = await axios.get(`${API_URL}/api/auth/me`);
                const userId = meRes.data.id;
                setUser(meRes.data);

                const profileRes = await axios.get(`${API_URL}/api/auth/user/${userId}`);
                reset(profileRes.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [reset, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            Object.keys(data).forEach((key) => {
                if (key === "cv" && data.cv[0]) {
                    formData.append("cv", data.cv[0]);
                } else if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            await axios.put(
                `${API_URL}/api/auth/update-profile`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("Profile updated successfully! ✨");
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error updating profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="animate-spin text-violet-600" size={48} />
            <p className="ml-4 text-xl text-gray-700 mt-4">Loading profile data...</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} />
            
            {/* 💡 OUTER DIV: Dark Gradient Background for high contrast with white form card */}
            <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
                
                {/* 💡 INNER DIV: Clean White Form Card */}
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-500 hover:shadow-3xl border-t-8 border-violet-600">
                    
                    <div className="flex flex-col items-center mb-8">
                        <UserCog className="text-violet-600 mb-4" size={40} />
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            Update Your Profile
                        </h2>
                        <p className="text-gray-500 mt-1">Complete the fields below to improve your job prospects.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Input Group: Phone */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Phone size={16} className="inline mr-2 text-violet-500" />
                                Phone
                            </label>
                            <input
                                {...register("phone")}
                                placeholder="e.g., +1 555 123 4567"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: Location */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <MapPin size={16} className="inline mr-2 text-violet-500" />
                                Location
                            </label>
                            <input
                                {...register("location")}
                                placeholder="e.g., San Francisco, CA"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: Education */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <GraduationCap size={16} className="inline mr-2 text-violet-500" />
                                Education
                            </label>
                            <input
                                {...register("education")}
                                placeholder="e.g., Master's in Computer Science"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: Experience */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Briefcase size={16} className="inline mr-2 text-violet-500" />
                                Experience
                            </label>
                            <input
                                {...register("experience")}
                                placeholder="e.g., 5 years in Frontend Development"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: Skills */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Code size={16} className="inline mr-2 text-violet-500" />
                                Skills
                            </label>
                            <input
                                {...register("skills")}
                                placeholder="e.g., React, Node, SQL, AWS (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: GitHub Link */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <Github size={16} className="inline mr-2 text-violet-500" />
                                GitHub Profile Link
                            </label>
                            <input
                                {...register("githubLink")}
                                placeholder="e.g., https://github.com/your-username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Input Group: CV Upload */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                <FileText size={16} className="inline mr-2 text-violet-500" />
                                Upload CV (PDF/DOCX)
                            </label>
                            <input
                                type="file"
                                {...register("cv")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>

                        {/* Submit Button */}
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
                            <span>{isSubmitting ? "Saving Profile..." : "Save Changes"}</span>
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div >
    );
}