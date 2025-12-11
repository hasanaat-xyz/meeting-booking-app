import React, { useState } from "react";
import api from "../components/Services/api"; // Assuming your API service handles the base URL

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sends data to the /api/auth/register route
      const res = await api.post("/auth/register", form);

      if (res.data.user) {
        alert("Registration Successful! Please log in.");
        // Redirect to the login page after successful registration
        window.location.href = "/login"; 
      }
    } catch (error) {
      // Displays the specific error message from the backend (e.g., "Email already registered")
      alert(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in here.</a>
        </p>
      </div>
    </div>
  );
};

export default Register;