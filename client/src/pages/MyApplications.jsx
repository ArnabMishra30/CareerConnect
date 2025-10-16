import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/applications/mine`, {
        withCredentials: true,
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            My Applications
          </h2>

          {applications.length === 0 ? (
            <p className="text-center text-white">
              You haven’t applied to any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {app.job?.jobTitle}
                  </h3>
                  <p className="text-gray-500 mb-2">{app.job?.company}</p>
                  <p className="text-sm font-medium">
                    Status:{" "}
                    <span
                      className={`${
                        app.status === "accepted"
                          ? "text-green-600"
                          : app.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
