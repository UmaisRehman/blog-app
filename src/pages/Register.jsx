import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const register = async (e) => {
    e.preventDefault();

    const passwordValue = password.current.value;
    const emailValue = email.current.value;

    // Check if passwords match
    if (passwordValue !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match.");
      return;
    }
    try {
      // Create a new user
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
      toast.success("User registered successfully!");

      // Store username details in Firestore
      await addDoc(collection(db, "fullname"), {
        Fullname: fullName.current.value,
        email: email.current.value,
        uid: auth.currentUser.uid,
      });

      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please use a different email.");
        toast.error("Email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format. Please check your email.");
        toast.error("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
        toast.error("Weak password.");
      } else {
        setError("Error registering user. Please try again.");
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl mt-10">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={register}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full max-w-xs"
                ref={fullName}
                required
              />
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                ref={email}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            <div className="form-control w-full max-w-xs mt-4 relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full max-w-xs"
                ref={password}
                required
              />
              <span
                className="absolute right-2 top-10 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input input-bordered w-full max-w-xs"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button type="submit" className="btn btn-primary w-full mt-6">
              Register
            </button>
            <div className="mt-4 text-center">
              <h1>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login Here
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
