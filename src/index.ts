import "module-alias/register";
import express, { Express, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; dotenv.config();
import { PasswordSecurity } from "@utils/hashPassword";

import { Middleware, ProtectedRoute, Signup, Login } from "@routes/api/auth.api";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("welcome to app");
})

app.post("/signup", Signup);
app.get("/protected", [Middleware, ProtectedRoute]);
app.post("/login", Login);

app.listen(process.env.PORT!);