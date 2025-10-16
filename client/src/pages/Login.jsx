// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate(); // ✅ for navigation  
//   const onSubmit = async (data) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", 
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);

//       // ✅ Confirm login by calling /me
//       const meRes = await fetch("http://localhost:5000/api/auth/me", {
//         credentials: "include",
//       });

//       if (!meRes.ok) throw new Error("Authentication failed after login.");

//       alert("Login successful");
//       navigate("/home");
//     } catch (err) {
//       alert(err.message);
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label>Email</label>
//             <input
//               type="email"
//               {...register("email", { required: "Email is required" })}
//               className="w-full px-4 py-2 border rounded-lg"
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>

//           <div className="mb-4">
//             <label>Password</label>
//             <input
//               type="password"
//               {...register("password", { required: "Password is required" })}
//               className="w-full px-4 py-2 border rounded-lg"
//             />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//           </div>

//           <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg">
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-indigo-500 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, User } from "lucide-react";
import { motion } from "framer-motion"; // Import motion

export default function Login() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();
    
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            const meRes = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include",
            });

            if (!meRes.ok) throw new Error("Authentication failed after login.");

            alert("Login successful");
            navigate("/home");
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
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
                delay: i * 0.15 + 0.3, // Stagger animation
            },
        }),
    };


    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-800 to-violet-900">
            
            {/* Animated Card Wrapper */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-sm w-full border-t-8 border-violet-600"
            >
                
                <div className="flex flex-col items-center mb-8">
                    <User className="text-violet-600 mb-4" size={40} />
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Email Input (Animated) */}
                    <motion.div variants={itemVariants} custom={0}>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                                }`}
                                placeholder="name@example.com"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </motion.div>

                    {/* Password Input (Animated) */}
                    <motion.div variants={itemVariants} custom={1}>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                                }`}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </motion.div>

                    {/* Submit Button (Animated) */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        variants={itemVariants} custom={2}
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 
                            ${isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 transform hover:scale-[1.01]'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Logging In...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Login</span>
                            </>
                        )}
                    </motion.button>
                </form>

                <motion.p 
                    variants={itemVariants} custom={3}
                    className="mt-6 text-center text-sm text-gray-600"
                >
                    Don't have an account?{" "}
                    <Link to="/register" className="text-violet-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}