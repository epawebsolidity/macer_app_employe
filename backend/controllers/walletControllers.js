import db from "../config/database.js";

export const getWalletByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM wallet WHERE id_users = ?`, [id]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet data" });
  }
};

export const createWallet = async (req, res) => {
  const { id_users, address_wallet } = req.body;
  try {
    const [rows] = await db.query("INSERT INTO wallet (id_users, address_wallet) VALUES (?, ?)", [id_users, address_wallet]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating wallet" });
  }
};