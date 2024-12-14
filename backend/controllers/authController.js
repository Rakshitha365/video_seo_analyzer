const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup controller
const signup = async (req, res) => {
  const { email, password } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,4}$/i;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,4}$/i;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    console.log("Login request received:", req.body);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };
