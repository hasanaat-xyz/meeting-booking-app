import React, { useState } from "react";
import api from "../components/Services/api";
import '../index.css';
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      if (res.data && res.data.message === "Login successful") {
        alert("Login Successful");
        window.location.href = "/dashboard";
      } else {
        alert(res.data?.message || "Login failed due to unexpected response.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    // Reverted to the original vibrant gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      
      {/* Container Card with Glassmorphism Effect */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">
        
        {/* Header/Title - Optimized for contrast against the background */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
                Welcome Back
            </h1>
            <p className="text-md text-white/90 mt-1 drop-shadow">
                Sign in to access your account.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input Group */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-white mb-1 drop-shadow"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              // Glassmorphic Input Style
              className="w-full px-4 py-2 bg-white/70 border border-white/50 rounded-xl shadow-inner placeholder-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 text-gray-800 transition-all"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input Group */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-white mb-1 drop-shadow"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              // Glassmorphic Input Style
              className="w-full px-4 py-2 bg-white/70 border border-white/50 rounded-xl shadow-inner placeholder-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 text-gray-800 transition-all"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button - Used a contrasting bright color (Yellow) for high visibility */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 mt-4 rounded-xl shadow-lg text-lg font-bold text-gray-900 
                       bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 
                       disabled:opacity-50 disabled:cursor-wait transition-all duration-200 transform hover:scale-[1.01]"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-white/90 mt-6 text-sm drop-shadow">
          Don’t have an account?{" "}
          <a 
            href="/register" 
            className="underline font-bold text-yellow-200 hover:text-white transition-colors"
          >
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;