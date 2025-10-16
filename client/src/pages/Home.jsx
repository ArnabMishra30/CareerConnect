// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import JobCard from "../components/JobCard";

// axios.defaults.withCredentials = true;

// export default function Home() {
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
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Search, BriefcaseBusiness, UserRoundPlus, ListChecks, UserCog, Loader2 } from "lucide-react";

axios.defaults.withCredentials = true;

// Component for the animated features section (no changes)
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: delay }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center"
  >
    <Icon size={40} className="text-violet-600 mb-3" />
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

// Define BASE_BUTTON_STYLE for reuse
const BASE_BUTTON_STYLE = "flex items-center justify-center space-x-2 w-full px-8 py-3 rounded-full font-bold shadow-xl transition-all duration-300 transform hover:scale-[1.02]";

export default function Home() {
  const [user, setUser] = useState(null);
  // 💡 NEW STATE: Introduce a loading state
  const [isLoading, setIsLoading] = useState(true); 
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        // 💡 IMPORTANT: Set loading to false once the check is complete
        setIsLoading(false); 
      }
    };
    fetchUser();
  }, []);

  // 1. --- LOADING SCREEN RETURN ---
  // If the user data is still being fetched, display a simple loader over the whole screen.
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="animate-spin text-violet-600" size={48} />
            <p className="ml-4 text-xl text-gray-700">Loading user data...</p>
        </div>
    );
  }

  // 🧠 Dynamic content based on user role 
  const getHeroContent = () => {
    // --- Unauthenticated User (if user is null after loading) ---
    if (!user) {
      return {
        heading: "Unlock Your Career Potential",
        paragraph:
          "Your one-stop destination for connecting job seekers and employers. Explore opportunities, post jobs, and grow your career — all in one place.",
        buttons: [
          {
            to: "/all-jobs",
            label: "🔍 Browse All Jobs",
            style: "bg-white text-indigo-700 hover:bg-gray-100 border border-transparent hover:border-violet-400",
            icon: Search
          },
        ],
        subtitle: "Join thousands of successful professionals today!",
      };
    }

    // --- Job Seeker ---
    if (user.role === "job-seeker") {
      return {
        heading: `Welcome back, ${user.firstName || "Job Seeker"}! 👋`,
        paragraph:
          "Ready for your next adventure? Discover the latest job openings tailored for your skills and interests. Apply easily and take the next step.",
        buttons: [
          {
            to: "/all-jobs",
            label: "🔍 Explore New Jobs",
            style: "bg-white text-indigo-700 hover:bg-gray-100 border border-transparent hover:border-violet-400",
            icon: Search
          },
          {
            to: "/update-profile",
            label: "📝 Update Your Profile",
            style: "bg-violet-600 text-white hover:bg-violet-700",
            icon: UserCog
          },
        ],
        subtitle: "The perfect role is just a click away.",
      };
    }

    // --- Job Poster ---
    if (user.role === "job-poster") {
      return {
        heading: `Hello, ${user.firstName || "Recruiter"}! 🎯`,
        paragraph:
          "Find the perfect candidates for your company with our powerful tools. Post jobs, manage applications, and streamline your hiring process effortlessly.",
        buttons: [
          {
            to: "/create-job",
            label: "💼 Post a New Job",
            style: "bg-white text-indigo-700 hover:bg-gray-100 border border-transparent hover:border-violet-400",
            icon: BriefcaseBusiness
          },
          {
            to: "/myjobs",
            label: "👀 Manage Your Listings",
            style: "bg-violet-600 text-white hover:bg-violet-700",
            icon: ListChecks
          },
        ],
        subtitle: "Tap into a pool of top talent now.",
      };
    }

    return getHeroContent();
  };

  const hero = getHeroContent();


  // 2. --- MAIN COMPONENT RENDER (Only runs after loading is false) ---
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center flex-grow text-center bg-gradient-to-br from-indigo-800 to-violet-900 text-white px-6 py-32 md:py-40 overflow-hidden shadow-inner z-10">
        
        {/* Abstract Background Effect */}
        <motion.div
          className="absolute inset-0 -z-10 opacity-20"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 80%)' }}
        />

        {/* Dynamic Heading & Paragraph */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg"
        >
          {hero.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg md:text-xl max-w-3xl mb-4 leading-relaxed text-violet-200"
        >
          {hero.paragraph}
        </motion.p>
        
        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6, duration: 0.5 }}
           className="text-base font-medium mb-8 text-violet-300 italic"
        >
          {hero.subtitle}
        </motion.p>


        {/* Dynamic Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm sm:max-w-xl"
        >
          {hero.buttons.map((btn, i) => (
            <motion.div key={i} variants={itemVariants} className="w-full">
                <Link
                to={btn.to}
                className={`${BASE_BUTTON_STYLE} ${btn.style}`}
                >
                {btn.icon && <btn.icon size={20} />}
                <span>{btn.label}</span>
                </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features and CTA sections */}
      <section className="py-20 px-6 bg-gray-50 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800"
          >
            Why Choose Career Connect?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Search}
              title="Smart Search"
              description="Find filtered job listings instantly based on your skills, location, and preferred role."
              delay={0.1}
            />
            <FeatureCard
              icon={BriefcaseBusiness}
              title="Verified Employers"
              description="Connect only with legitimate and high-quality companies committed to growth."
              delay={0.3}
            />
            <FeatureCard
              icon={UserRoundPlus}
              title="Profile Builder"
              description="Create a standout professional profile to attract top recruiters actively looking for talent."
              delay={0.5}
            />
          </div>
        </div>
      </section>
      
       <section className="bg-white py-16 px-6 shadow-t-lg z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">Whether you are hiring or seeking, we have the tools to make your connection seamless.</p>
            <Link
                to={user ? "/all-jobs" : "/login"}
                className="inline-flex items-center justify-center space-x-2 bg-violet-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-violet-700"
            >
                {user ? "Explore Opportunities" : "Get Started Today"}
            </Link>
          </div>
       </section>

      <Footer />
    </div>
  );
}