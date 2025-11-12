import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token harus ada di header
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Format bearer token: "Bearer token_value"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user ke req biar bisa diakses di route lain
    req.user = decoded;
    next(); // lanjut ke controller berikutnya
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
