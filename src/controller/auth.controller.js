const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/*    
 auth register controller
 POST/api/auth/register

*/
const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isExist = await userModel.findOne({ email: email });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await userModel.create({ name, email, password });
    // create JWT token and send cookie + user data (without password)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email},
        token
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// usere login controller
// POST/api/auth/login
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user and explicitly include password
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { userRegisterController, userLoginController} 
