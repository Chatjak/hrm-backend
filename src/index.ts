import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./router/authRouter";
import connectDB from "./database/db";
import swipingRouter from "./router/swipingRouter";

const app = express();

const port = 8080;
connectDB();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", authRouter);
app.use("/api", swipingRouter);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
