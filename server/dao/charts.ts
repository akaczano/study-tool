import { prisma } from "../lib/prisma";
import { Request, Response } from 'express';
import { handleError } from '../lib/response_helper';
import { Language } from "../generated/prisma/enums";

export const listGroups = async (req: Request, res: Response) => {    

    const language = req.query?.language?.toString() || "GREEK";
    

    try {
        const result = await prisma.chartGroup.findMany({
            include: { charts: true },
            where: {
                language: language as Language
            }
        });
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const fetchChart = async (req: Request, res: Response) => {    
    const { id }  = req.params;
    try {
        const result = await prisma.chart.findFirst({
            where: { id: parseInt(id.toString()) }
        })        
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const postGroup = async (req: Request, res: Response) => {
    
    const { description, language } = req.body;

    try {
        const result = await prisma.chartGroup.create({
            data: {
                description,
                language
            }
        });
        res.status(201).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const postChart = async (req: Request, res: Response) => {
    try {
        const {
            description,
            language,
            data,
            groupId
        } = req.body;
        const result = await prisma.chart.create({
            data: {
                description,
                language,
                data,
                group: {
                    connect: {
                        id: groupId
                    }
                }
            }
        });
        res.status(201).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    try {       
        const { id } = req.params; 
        const { description } = req.body;
        const result = await prisma.chartGroup.update({
            where: { id: parseInt(id.toString()) },
            data: { description }
        });
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }

}

export const putChart = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const {             
            groupId,
            description,
            data,
            language
        } = req.body;
        

        const result = await prisma.chart.update({
            where: { id: parseInt(id.toString()) },
            data: {
                description,
                language,
                data,
                group: {
                    connect: { id: groupId }                    
                }
            }
        })
        res.status(200).json(result);

    } catch (err) {
        handleError(res, err);
    }
}

export const removeGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.chartGroup.delete({
            where: { id: parseInt(id.toString()) }
        })
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const removeChart = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.chart.delete({
            where: { id: parseInt(id.toString()) }
        })
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }
}
