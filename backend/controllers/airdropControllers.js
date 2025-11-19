import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import tokenAbi from "../abi/tokenAbi.json" with { type: "json" };
import db from "../config/database.js";
import { educhainTestnet } from "../config/network.js";


export const claimAllowcationEmploye = async (req, res) => {
  try {
    const { address, salary } = req.body;

    if (!address || !salary) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    const client = createWalletClient({
      account,
      chain: educhainTestnet,
      transport: http(),
    });

    const tx = await client.writeContract({
      address: process.env.PHII_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "transfer",
      args: [address, BigInt(salary)],
    });

    res.json({ success: true, tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Claim failed" });
  }
};



export const createAllowcationEmploye = async (req, res) => {
  const { id_employe, salary, status_cleam } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM emp_salary WHERE id_employe = ?",
      [id_employe]
    );
    const current = existing[0];
    if (!current || current.status_cleam === "Claimed") {
      const [rows] = await db.query(
        "INSERT INTO emp_salary (id_employe, salary, status_cleam) VALUES (?, ?, ?)",
        [id_employe, salary, status_cleam]
      );

      return res.status(200).json({
        success: true,
        message: "Airdrop allocation created",
        data: rows,
      });
    }
    const newSalary = Number(current.salary) + Number(salary);

    await db.query(
      `UPDATE emp_salary 
       SET salary = ?, status_cleam = ?
       WHERE id_employe = ?`,
      [newSalary, status_cleam, id_employe]
    );

    return res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      data: {
        id_employe,
        salary: newSalary,
        status_cleam,
      },
    });

  } catch (error) {
    console.error("Error creating airdrop:", error);
    return res.status(500).json({ message: "Error creating airdrop" });
  }
};


export const getAllowcationEmploye = async (req, res) => {
    const {id_employe} = req.params;
    try {
        const [rows] = await db.query(`SELECT * FROM emp_salary WHERE id_employe = ?`, [id_employe]);
       const filtered = rows.filter(item => item.status_cleam !== "Claimed");

res.status(200).json({
  success: true,
  data: filtered,
});
    } catch (error) {
        res.status(500).json({ message: "Error fetching wallet data" });
    }
}