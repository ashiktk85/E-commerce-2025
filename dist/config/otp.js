import crypto from "crypto";
export function generateOTP(length = 5) {
    return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
}
//# sourceMappingURL=otp.js.map