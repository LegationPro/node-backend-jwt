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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hashPassword_1 = require("./utils/hashPassword");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const verifySchema = (user) => {
    if (user.id && user.username && user.email) {
        return true;
    }
    ;
};
const middleware = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        token = token.replace("Bearer ", "");
        // jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, token) => {
        //     if (err) {
        //     }
        // })
    }
    res.status(401).send("Not authorized");
};
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (user.password) {
        delete user.password;
    }
    if (verifySchema(user)) {
        const accessToken = jsonwebtoken_1.default.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "20s" });
        const refreshToken = jsonwebtoken_1.default.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        const hash = yield hashPassword_1.PasswordSecurity.HashPassword(req.body.password);
        if (accessToken && refreshToken) {
            res.status(201).json({
                "tokens": {
                    accessToken,
                    refreshToken,
                }
            });
        }
    }
}));
app.post("/protected", middleware, (req, res) => {
    console.log("yes");
});
app.get("/", (req, res) => {
    res.send("welcome to app");
});
app.listen(process.env.PORT);
//# sourceMappingURL=index.js.map