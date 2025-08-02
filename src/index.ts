import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import bodyParser from 'body-parser'

import userRoutes from "./routes/userRoutes";
import errorHandler from "./middlewares/errorHandler";
import groupRoutes from "./routes/groupRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.use('/api', userRoutes)
app.use("/api", groupRoutes)
app.use("/api", transactionRoutes)
app.use("/api", chatRoutes)

app.use(errorHandler)

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
