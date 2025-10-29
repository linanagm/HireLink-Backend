import { userRegister, userLogin } from "../Services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { user, token } = await userRegister(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({ message: "User registered successfully ✅", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await userLogin(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Login successful ✅", user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully 🚪" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while logging out 😢" });
  }
};
