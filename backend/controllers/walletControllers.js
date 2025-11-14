import db from "../config/database.js";

export const getWalletByUserId = async (req, res) => {
  const { id_users } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM wallet_users WHERE id_users = ?`, [id_users]);
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
  console.log(id_users, address_wallet);
  try {
    const [rows] = await db.query("INSERT INTO wallet_users (id_users, address_wallet) VALUES (?, ?)", [id_users, address_wallet]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating wallet" });
  }
};


export const deleteWalletUsers = async (req, res) => {
  const { id_users } = req.params;
  try {
    const [rows] = await db.query("DELETE FROM wallet_users WHERE id_users = ?", [id_users]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting wallet" });
  }
}
