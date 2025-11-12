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

    // Generate tokens
    const accessToken = jwt.sign(
      { id: data.id_users, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "30s" } // 30 detik
    );


    const refreshToken = jwt.sign(
      { id: data.id_users, email: data.email, role: data.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const token = await db.query("SELECT * FROM token WHERE id_users = ?", [data.id_users]);
    console.log(token);

    if(token){
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
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/", // hanya dikirim ke endpoint ini
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: data.id,
        name: data.name,
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
    // 🔒 Ambil refresh token dari cookie (BUKAN body)
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    // 🔎 Cek apakah refresh token ada di database
    const [result] = await db.query(
      "SELECT * FROM token WHERE refresh_token = ?",
      [refreshToken]
    );
    if (result.length === 0)
      return res.status(403).json({ message: "Invalid refresh token" });

    // 🧩 Decode refresh token lama
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 🔑 Buat access token baru
    const newAccessToken = jwt.sign(
      { id: decoded.id_users, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔁 Buat refresh token baru
    const newRefreshToken = jwt.sign(
      { id: decoded.id_users, email: decoded.email, role: decoded.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 💾 Update kedua token di database berdasarkan id_users
    await db.query(
      "UPDATE token SET access_token = ?, refresh_token = ? WHERE id_users = ?",
      [newAccessToken, newRefreshToken, decoded.id_users]
    );

    // 🍪 Set refresh token baru di cookie HttpOnly
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true jika pakai HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    // 📦 Kirim access token baru ke frontend
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


export const logoutController = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

  await db.query("UPDATE users SET refresh_token = NULL WHERE refresh_token = ?", [
    refreshToken,
  ]);

  return res.status(200).json({ message: "Logged out" });
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