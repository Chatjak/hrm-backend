import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./router/authRouter";
import connectDB from "./database/db";
import swipingRouter from "./router/swipingRouter";
import employeeRouter from "./router/employeeRouter";
import { setupSwagger } from "./swagger";
import departmentRouter from "./router/departmentRouter";
const app: Express = express();
const port = 8080;

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Setup Swagger
setupSwagger(app);

app.use("/api", authRouter);
app.use("/api", swipingRouter);
app.use("/api", employeeRouter);
app.use("/api", departmentRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
