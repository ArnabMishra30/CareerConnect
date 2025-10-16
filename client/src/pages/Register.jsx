// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";

// export default function Register() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate(); 
//   const onSubmit = async (data) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();
//       console.log(result);
//       if (!res.ok) throw new Error(result.message);
//       alert("Registration successful");
//       navigate("/");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label>First Name</label>
//               <input {...register("firstName", { required: "First name is required" })} className="w-full px-4 py-2 border rounded-lg" />
//               {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
//             </div>
//             <div>
//               <label>Last Name</label>
//               <input {...register("lastName", { required: "Last name is required" })} className="w-full px-4 py-2 border rounded-lg" />
//               {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
//             </div>
//           </div>

//           <div className="mt-4">
//             <label>Email</label>
//             <input type="email" {...register("email", { required: "Email is required" })} className="w-full px-4 py-2 border rounded-lg" />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>

//           <div className="mt-4">
//             <label>Password</label>
//             <input type="password" {...register("password", { required: "Password is required" })} className="w-full px-4 py-2 border rounded-lg" />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//           </div>

//           <div className="mt-4">
//             <label>Role</label>
//             <select {...register("role")} className="w-full px-4 py-2 border rounded-lg">
//               <option value="job-seeker">Job Seeker</option>
//               <option value="job-poster">Job Poster</option>
//             </select>
//           </div>

//           <button type="submit" className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg">
//             Register
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm">
//           Already have an account?{" "}
//           <Link to="/" className="text-indigo-500 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Briefcase, UserPlus, Loader2 } from "lucide-react"; // Import icons

export default function Register() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    
    const navigate = useNavigate(); 
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading

    const onSubmit = async (data) => {
        setIsSubmitting(true); // Start loading
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            
            alert("Registration successful! You can now log in.");
            navigate("/"); // Redirect to the login page
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false); // End loading
        }
    };

    // Framer Motion Variants
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 100, 
                damping: 10,
                delay: 0.1
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1 + 0.3, // Stagger animation
            },
        }),
    };

    return (
        // 💡 OUTER DIV: High-contrast Dark Gradient Background
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
            
            {/* Animated Card Wrapper */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full border-t-8 border-violet-600"
            >
                
                <div className="flex flex-col items-center mb-8">
                    <UserPlus className="text-violet-600 mb-4" size={40} />
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500 mt-1">Join us as a seeker or poster</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Name Fields (Animated Group) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} custom={0}>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    {...register("firstName", { required: "First name is required" })} 
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="John"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                        </motion.div>
                        
                        <motion.div variants={itemVariants} custom={1}>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    {...register("lastName", { required: "Last name is required" })} 
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Doe"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                        </motion.div>
                    </div>

                    {/* Email Input (Animated) */}
                    <motion.div variants={itemVariants} custom={2} className="mt-6">
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" 
                                {...register("email", { required: "Email is required" })} 
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="name@example.com"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </motion.div>

                    {/* Password Input (Animated) */}
                    <motion.div variants={itemVariants} custom={3} className="mt-6">
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password" 
                                {...register("password", { required: "Password is required" })} 
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </motion.div>

                    {/* Role Select (Animated) */}
                    <motion.div variants={itemVariants} custom={4} className="mt-6">
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Register as</label>
                        <div className="relative">
                            <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select 
                                {...register("role")} 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                disabled={isSubmitting}
                            >
                                <option value="job-seeker">Job Seeker</option>
                                <option value="job-poster">Job Poster</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Submit Button (Animated) */}
                    <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        variants={itemVariants} custom={5}
                        className={`mt-8 w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 
                            ${isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 transform hover:scale-[1.01]'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                <span>Create Account</span>
                            </>
                        )}
                    </motion.button>
                </form>

                <motion.p 
                    variants={itemVariants} custom={6}
                    className="mt-6 text-center text-sm text-gray-600"
                >
                    Already have an account?{" "}
                    <Link to="/" className="text-violet-600 font-semibold hover:underline">
                        Login
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}