import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");

    if (!formData.email.trim()) return toast.error("Email is required");

    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");

    if (!formData.password) return toast.error("Password is required");

    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
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

            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-500 text-sm">
              Get started with your free account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>

              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@gmail.com"
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
                  className="w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {isSigningUp ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with everyone"
      />
    </div>
  );
};

export default SignUpPage;