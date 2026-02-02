import { Prisma } from '../generated/prisma/client';
import { prisma } from "../lib/prisma";
import { Request, Response } from 'express';
import { handleError } from '../lib/response_helper';

export const listGroups = async (req: Request, res: Response) => {
    try {
        const result = await prisma.chartGroup.findMany({
            include: { charts: true }
        });
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const postGroup = async (req: Request, res: Response) => {
    
    const { description } = req.body;

    try {
        const result = await prisma.chartGroup.create({
            data: {
                description
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
        const { id, description } = req.body;
        const result = await prisma.chartGroup.update({
            where: { id },
            data: { description }
        });
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err);
    }

}

export const putChart = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        handleError(res, err);
    }
}

export const removeGroup = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        handleError(res, err);
    }
}

export const removeChart = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        handleError(res, err);
    }
}
