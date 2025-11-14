import jwt from "jsonwebtoken";
import db from "../config/database.js";

export const authController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }
    const data = user[0];
    if (data.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { id: data.id_users, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "30s" } 
    );
    const refreshToken = jwt.sign(
      { id: data.id_users, email: data.email, role: data.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    const [token] = await db.query("SELECT * FROM token WHERE id_users = ?", [data.id_users]);
    if (token.length > 0) {
      await db.query(
        "UPDATE token SET access_token = ?, refresh_token = ? WHERE id_users = ?",
      [accessToken, refreshToken, data.id_users]
      );
    } else {
      await db.query(
        "INSERT INTO token (id_users, access_token, refresh_token) VALUES (?, ?, ?)",
      [data.id_users, accessToken, refreshToken]
      );
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: data.id_users,
        email: data.email,
        role: data.role,
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const [result] = await db.query(
      "SELECT * FROM token WHERE refresh_token = ?",
      [refreshToken]
    );
    if (result.length === 0)
      return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "30s" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await db.query(
      "UPDATE token SET access_token = ?, refresh_token = ? WHERE id_users = ?",
      [newAccessToken, newRefreshToken, decoded.id]
    );

     res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


export const logoutController = async (req, res) => {
  try {
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict", secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: true });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error", error });
  }
};



export const checkAuthUsers = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid access token" });
  }
};  