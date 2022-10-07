import bcrypt from "bcrypt";

export namespace PasswordSecurity {
    export async function HashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 16);
    };

    export async function ComparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
};