import db from "../config/database.js";

export const getEmployees = async (req, res) => {
  try {
    const [employees] = await db.query("SELECT * FROM employe");
    return res.status(200).json({
      message: "Success",
      data: employees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJoinEmployeByUserId = async (req, res) => {
  const { id_users } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM employe WHERE id_users = ?`, [id_users]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet data" });
  }
};
