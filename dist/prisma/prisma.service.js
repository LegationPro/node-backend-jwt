"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
class PrismaService {
    static Get() { return this.Prisma; }
}
exports.PrismaService = PrismaService;
PrismaService.Prisma = new client_1.PrismaClient();
//# sourceMappingURL=prisma.service.js.map