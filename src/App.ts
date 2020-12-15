import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import dbConnect from './dbConnect';
import bodyParser from "body-parser";
import usersRouter from "./routes/users";

export type Tenv = {
  PORT: number;
  DATABASE_URL: string;
}

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(cors());
dbConnect(process.env.DATABASE_URL!);


app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.use("/user", usersRouter);

app.listen(process.env.PORT, () => {
  console.log("Server Started at Port, " + process.env.PORT);
});