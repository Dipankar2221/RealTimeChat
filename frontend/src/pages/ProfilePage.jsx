import React, { useState } from "react";
import { Camera, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import defaultAvatar from "../assets/avatar.png";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [name, setName] = useState(authUser?.fullName || "");
  const [email] = useState(authUser?.email || "");
  const [preview, setPreview] = useState(authUser?.avatar || null);
  const [file, setFile] = useState(null);

  // IMAGE SELECT
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected); // store file

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // preview only
    };
    reader.readAsDataURL(selected);
  };

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", name);

    if (file) {
      formData.append("avatar", file);
    }

    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen bg-base-300 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-base-200 shadow-xl rounded-3xl p-8 space-y-6">

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-500 text-sm">
            Update your profile information
          </p>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={preview || authUser?.avatar || defaultAvatar}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
            />

            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Camera size={18} className="text-white" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-100 text-gray-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2 transition disabled:opacity-60"
          >
            {isUpdatingProfile ? (
              <>
                <Loader className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;