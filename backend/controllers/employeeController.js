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
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        e.id_employe,
        e.name AS employee_name,
        e.position,
        u.id_users,
        u.username,
        u.email
      FROM employe e
      JOIN users u ON e.id_users = u.id_users
      WHERE u.id_users = ?
    `, [id]);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee data" });
  }
};
