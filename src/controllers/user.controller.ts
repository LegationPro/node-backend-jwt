import { PrismaClient, User } from "@prisma/client";

export class UserController {
    private static Prisma: PrismaClient = new PrismaClient();
    
    public static async FindUserFromId(uuid: string): Promise<User | undefined> {
       const user = await this.Prisma.user.findFirst({
        where: {
            id: uuid,
        }
       });

       return user;
    }

    public static async FindUserFromUsername(username: string): Promise<User | undefined> {
        const user = await this.Prisma.user.findFirst({
            where: {
                username
            }
        });

        return user;
    }

    public static async FindUserFromEmail(email: string): Promise<User | undefined> {
        const user = await this.Prisma.user.findFirst({
            where: {
                email,
            }
        });

        return user;
    }

    public static async Create(user: User): Promise<User> {
        const newUser = await this.Prisma.user.create({
            data: {
                username: user.username,
                password: user.password,
                email: user.email,
            }
        });

        return newUser;
    }

    public static async UpdateRefreshToken(id: string, refresh: string): Promise<User> {
        const user = await this.Prisma.user.update({
            where: {
                id: id,
            },

            data: {
                refreshToken: refresh,
            }
        });

        return user;
    }
}