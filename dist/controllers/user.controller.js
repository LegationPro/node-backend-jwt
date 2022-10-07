"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
class UserController {
    static GetUserFromId(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.Prisma.user.findFirst({
                where: {
                    id: uuid,
                }
            });
            return user;
        });
    }
    static Create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.Prisma.user.create({
                data: {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                }
            });
            return newUser;
        });
    }
}
exports.UserController = UserController;
UserController.Prisma = new client_1.PrismaClient();
//# sourceMappingURL=user.controller.js.map