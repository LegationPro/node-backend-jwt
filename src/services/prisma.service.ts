import { PrismaClient } from "@prisma/client";

export class PrismaService {
    private static Prisma: PrismaClient = new PrismaClient();
    
    public static Get(): PrismaClient { return this.Prisma }
}