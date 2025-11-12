import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./router/AuthRouter.js";
import employeeRouter from "./router/employeeRouter.js";
dotenv.config();
const app = express();


app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],            
}));

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/employee", employeeRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
