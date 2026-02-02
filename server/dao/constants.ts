import { Request, Response } from "express";
import { Language, PartOfSpeech, Case } from '../generated/prisma/client';


export const languages = async (_: Request, res: Response) => {
    res.json(Object.values(Language));
}

export const partsOfSpeech = async (_: Request, res: Response) => {
    res.json(Object.values(PartOfSpeech));
}

export const cases = async (_: Request, res: Response) => {
    res.json(Object.values(Case));
}
