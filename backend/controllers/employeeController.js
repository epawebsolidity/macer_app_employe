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
