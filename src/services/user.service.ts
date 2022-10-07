import { UserController } from "@controllers/user.controller";
import { User } from "@prisma/client";

export interface IUser {
    username: string;
    email: string;
    password: string;
}

export class UserService {
    public static async FindUserFromId(uuid: string): Promise<User | undefined> {
        return await UserController.FindUserFromId(uuid);
    }

    public static async Create(user: IUser): Promise<User> {
        return await UserController.Create(user as User);
    }

    public static async FindUserFromUsername(username: string): Promise<User | undefined> {
        return await UserController.FindUserFromUsername(username);
    }

    public static async FindUserFromEmail(email: string): Promise<User | undefined> {
        return await UserController.FindUserFromEmail(email);
    }

    public static async UpdateRefreshToken(id: string, refresh: string): Promise<User | undefined> {
        return await UserController.UpdateRefreshToken(id, refresh);
    }
}