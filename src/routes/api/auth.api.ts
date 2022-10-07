import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { PasswordSecurity } from "@utils/hashPassword";
import { IUser, UserService } from "@services/user.service";

const verifySchema = (user: User | IUser) => {
    if (user.username && user.email && user.password) {
        return true;
    };
}

export const Middleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jwt.decode(token) as IUser;
        const user = await UserService.FindUserFromEmail(data.email);

        if (user) {
            jwt.verify(user.refreshToken, process.env.JWT_REFRESH_SECRET!, async err => {
                if (err && err.message === "jwt expired") {
                    const userInfo = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    };
                    
                    const refreshToken = jwt.sign(userInfo, process.env.JWT_REFRESH_SECRET!, {expiresIn: "5s"})
                    await UserService.UpdateRefreshToken(user.id, refreshToken);
                }
            })
        }

        jwt.verify(token, process.env.JWT_ACCESS_SECRET!, async (err, user) => {
            if (user) {
                (req as any).user = user;
                next();
            }

            if (err.message === "jwt expired") {
                const user = jwt.decode(token) as User;

                if (user && user.id && user.email && user.username) {
                    const userPayload = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                    };

                    const accessToken = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET!, {expiresIn: "20s"});
                    (req as any).token = accessToken;
                    next();
                } else {
                    return res.status(401).send("User not authenticated");
                }
                
            } else {
                return res.send("User not authenticated");
            }
        })
    }
}

export const ProtectedRoute = async (req: Request, res: Response) => {
    const token = (req as any).token;

    if (token) {
        jwt.verify(token as string, process.env.JWT_ACCESS_SECRET!, (err, user) => {
            if (err) {
                res.status(401).send("There was a problem trying to authenticate");
            } else {
                res.status(201).send("Everything is ok!");
            }
        })
    } else {
        res.status(201).send("There was no token provided");
    }
}

export const Signup = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    if (verifySchema(user)) {
        const hash = await PasswordSecurity.HashPassword(user.password);
        await UserService.Create({
            username: user.username,
            password: hash,
            email: user.email,
        });

        return res.status(201).send("Success");
    }
    return res.status(401).send("Please provide all user credentials");
}

export const Login = async (req: Request, res: Response) => {
    const user: IUser = req.body.user;

    if (verifySchema(user)) {
        const userObject = await UserService.FindUserFromEmail(user.email);
    
        if (!userObject) {
            return res.status(401).json({ message: "User does not exist!"});
        }
    
        if (userObject && userObject.email && userObject.password && userObject.username) {
            const match = await PasswordSecurity.ComparePassword(user.password, userObject.password);
        
            if (match) {
                const userInfo = {
                    id: userObject.id,
                    username: userObject.username,
                    email: userObject.email,
                };
        
                const accessToken = jwt.sign(userInfo, process.env.JWT_ACCESS_SECRET!, {expiresIn: "20s"});
                const refreshToken = jwt.sign(userInfo, process.env.JWT_REFRESH_SECRET!, {expiresIn: "5s"});

                await UserService.UpdateRefreshToken(userObject.id, refreshToken);

                res.status(201).json({
                    accessToken,
                    refreshToken,
                });
            } else {
                res.status(401).json({
                    message: "Failed",
                });
            }
        }
    } else {
        res.status(401).send("Please provide all user credentials");
    }
}