export interface User {
    id: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: Date;
    lockoutEnabled: boolean;
    accessFailedCount: number;
}