import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");

    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");

    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* LOGO */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md">
                <MessageSquare size={28} />
              </div>
            </div>

            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 text-sm">
              Login to continue your journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Login to chat with friends and explore new conversations."
      />
    </div>
  );
};

export default LoginPage;