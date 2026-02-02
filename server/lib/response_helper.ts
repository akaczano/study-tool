import { PrismaClientValidationError } from "@prisma/client/runtime/client";
import { Response } from "express";

export const handleError = (res: Response, e: unknown) => {
    console.log(e);
    let message = 'Unknown error: ' + e;
    let status = 500;
    if (e instanceof Error) {
        if (e instanceof PrismaClientValidationError || e instanceof TypeError) {
            status = 400;
        }
        message = e.message;
    } 
    res.status(status).json({ message });
}