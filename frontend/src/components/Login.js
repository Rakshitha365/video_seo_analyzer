import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // React Router hook for navigation
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      window.alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/keyword-strategy-builder");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid login credentials";

      window.alert(`Login Failed: ${errorMsg}`);
    }
  };
  return (
    <div className="flex h-screen">
      {/* Left Section - Welcome Text and Illustration */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-gradient-to-b from-blue-500 to-indigo-600 text-white">
        <div className="text-center px-8">
          <h2 className="text-lg font-medium mb-2">Help Us 24/7</h2>
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-sm mb-6">
            Access your account. Unlock powerful tools to optimize your video
            content and boost your SEO rankings effortlessly!
          </p>
          {/* Local Image */}
          <img
            src="images/signup.png"
            alt="Login Illustration"
            className="max-w-full mx-auto"
          />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 bg-white">
        <div className="w-full max-w-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Username / Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your Password"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute right-3 top-2 cursor-pointer text-gray-500 text-lg"
              >
                {showPassword ? "👁️" : "🙈"}
                {isHovering && (
                  <span className="absolute top-1 right-7 bg-black text-white text-xs rounded py-1 px-2 shadow">
                    {showPassword ? "Hide Password" : "Show Password"}
                  </span>
                )}
              </span>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberMe"
                className="text-blue-500 border-collapse bg-gray-200 focus:ring-blue-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-gray-600 font-medium"
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>

            {/* Additional Links */}
             <div className="mt-6 text-center">
              <a
                href="#"
                className="text-gray-400 hover:underline text-sm block mb-2"
              >
                Forgot password?
              </a>

              <p className="text-gray-400 text-sm mt-2">
                Don't have an account yet?{" "}
                <a href="/signup" className="text-indigo-500 hover:underline">
                  Signup
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;