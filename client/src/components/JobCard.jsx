// import axios from "axios";

// export default function JobCard({ job, role, onApplied }) {
//   const handleApply = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/applications/${job._id}`,
//         {},
//         { withCredentials: true }
//       );
//       alert(res.data.message || "Applied successfully");
//       if (onApplied) onApplied(job._id); // optional callback to refresh UI
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to apply");
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-5 border hover:shadow-xl transition">
//       <h3 className="text-xl font-bold">{job.jobTitle}</h3>
//       <p className="text-gray-500">
//         {job.company} - {job.location}
//       </p>
//       <p className="mt-2">{job.description}</p>
//       <p className="mt-2 text-sm text-gray-600">
//         Skills: {job.skillsRequired?.join(", ")}
//       </p>
//       <p className="mt-2 text-green-600 font-bold">
//         Salary: {job.salaryRange}
//       </p>
//       <p className="mt-2 text-sm">{job.jobType}</p>

//       {role === "job-seeker" && (
//         <button
//           onClick={handleApply}
//           className="mt-4 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
//         >
//           Apply
//         </button>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios"; // 💡 FIX 1: Ensure axios is imported
import { Clock, MapPin, DollarSign, Briefcase, Zap, Loader2 } from "lucide-react"; // Import necessary icons

// Setting withCredentials globally in the main app is sufficient, but good to ensure
// axios.defaults.withCredentials = true; 

export default function JobCard({ job, role, onApplied }) {
  // 💡 NEW STATE: Track application status for loading and disabling
  const [isApplying, setIsApplying] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  
  // Optional: State to show application success (if not using onApplied to manage it)
  // const [isApplied, setIsApplied] = useState(false); 

  const handleApply = async () => {
    setIsApplying(true); // Start loading
    try {
      const res = await axios.post(
        `${API_URL}/api/applications/${job._id}`,
        {},
        { withCredentials: true }
      );
      
      // Use a more user-friendly notification than alert in a production app
      alert(res.data.message || "Applied successfully! 🎉");
      
      if (onApplied) onApplied(job._id); // Notify parent component to update UI (e.g., mark as applied)
      
    } catch (err) {
      // Handle 409 Conflict (Already Applied) or other errors
      const errorMessage = err.response?.data?.message || "Failed to apply. Please check your network.";
      alert(errorMessage);
    } finally {
      setIsApplying(false); // Stop loading
    }
  };

  // Determine if the job is marked as already applied in the parent state (if applicable)
  // For simplicity here, we assume the parent handles the `onApplied` logic to refresh the view.
  // If the job object had an `isApplied` property, you would use that here.
  const isCurrentlyApplied = job.isApplied; 

  return (
    // 💡 AESTHETIC FIX: Clean, rounded card with subtle hover and shadow
    <div className="bg-white shadow-lg rounded-xl p-6 h-full flex flex-col border border-gray-100 hover:shadow-2xl transition-all duration-300">
      
      {/* Header Info */}
      <h3 className="text-2xl font-extrabold text-gray-900 mb-1 leading-snug">
        {job.jobTitle}
      </h3>
      <p className="text-lg font-semibold text-violet-600 mb-3 flex items-center space-x-2">
        <Briefcase size={18} className="text-violet-500" />
        <span>{job.company}</span>
      </p>

      {/* Meta Data Grid */}
      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <p className="flex items-center space-x-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{job.location}</span>
        </p>
        <p className="flex items-center space-x-2 font-medium">
          <Zap size={16} className="text-violet-500" />
          <span>{job.jobType}</span>
        </p>
        <p className="flex items-center space-x-2 font-bold text-green-700">
          <DollarSign size={16} className="text-green-500" />
          <span>{job.salaryRange}</span>
        </p>
        <p className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-400" />
          <span>Posted: 1d ago</span> {/* Placeholder for time */}
        </p>
      </div>

      {/* Description and Skills */}
      <p className="mt-0 text-gray-700 flex-1 mb-4 line-clamp-3">
        {job.description}
      </p>
      
      <div className="mt-auto mb-4">
        <p className="text-sm font-semibold text-gray-600">
          Key Skills:
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {/* Display skills as nice tags */}
          {job.skillsRequired?.map((skill, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {role === "job-seeker" && (
        <button
          onClick={handleApply}
          disabled={isApplying || isCurrentlyApplied} // Disable while loading or if already applied
          // 💡 AESTHETIC FIX: Use Violet theme for the button
          className={`mt-4 w-full py-3 rounded-lg font-bold shadow-md transition-colors duration-200 
            ${isApplying || isCurrentlyApplied
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Disabled state
              : 'bg-violet-600 text-white hover:bg-violet-800' // Active state
            } flex items-center justify-center space-x-2 hover:cursor-pointer
          `}
        >
          {isApplying && <Loader2 className="animate-spin" size={20} />}
          {!isApplying && isCurrentlyApplied && (
            <span>Applied ✅</span>
          )}
          {!isApplying && !isCurrentlyApplied && (
            <span>Apply Now</span>
          )}
        </button>
      )}
      
    </div>
  );
}