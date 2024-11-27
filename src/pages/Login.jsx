import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loginUser } from "../config/firebase/firebasemethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); 
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({
      email: email.current.value,
      password: password.current.value,
    })
      .then(() => {
        toast.success("Logged in successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Login failed:", err.message);
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please try again.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full max-w-xs"
                ref={email}
                required
              />
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full max-w-xs"
                ref={password}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button type="submit" className="btn btn-accent w-full mt-6">
              Login
            </button>
            <div className="mt-4 text-center">
              <h1>
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register Here
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

export default Login;
