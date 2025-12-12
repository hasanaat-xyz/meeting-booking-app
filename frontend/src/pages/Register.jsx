import React, { useState } from "react";
import api from "../components/Services/api";

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
      const res = await api.post("/auth/register", form);

      if (res.data.user) {
        alert("Registration Successful! Please log in.");
        window.location.href = "/login"; 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-peach-100 via-lavender-50 to-mint-100 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-peach-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-lavender-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mint-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 md:p-10 border border-white/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-peach-300 to-lavender-300 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Join us and start scheduling meetings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-peach-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-white/60 border-2 border-peach-200 rounded-xl 
                           placeholder-gray-400 text-gray-800 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-peach-300 
                           hover:border-peach-300 focus:bg-white"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-lavender-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/60 border-2 border-lavender-200 rounded-xl 
                           placeholder-gray-400 text-gray-800 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-lavender-300 
                           hover:border-lavender-300 focus:bg-white"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/60 border-2 border-mint-200 rounded-xl 
                           placeholder-gray-400 text-gray-800 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300 
                           hover:border-mint-300 focus:bg-white"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 mt-6 rounded-xl 
                       bg-gradient-to-r from-peach-400 via-lavender-400 to-mint-400 
                       text-white font-semibold text-base shadow-lg shadow-peach-200/50
                       hover:shadow-xl hover:shadow-peach-300/50 
                       focus:outline-none focus:ring-4 focus:ring-peach-300/50 
                       disabled:opacity-50 disabled:cursor-wait 
                       transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        
        {/* Footer Link */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <a 
            href="/login" 
            className="font-semibold text-peach-500 hover:text-peach-600 transition-colors underline decoration-2 underline-offset-2"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;