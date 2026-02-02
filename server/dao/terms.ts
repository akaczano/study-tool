import { PartOfSpeech, Prisma } from '../generated/prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { handleError } from '../lib/response_helper';
import { TermOrderByWithRelationInput, TermWhereInput } from '../generated/prisma/models/Term';


export const postTerm = async (req: Request, res: Response) => {
        const {
            term,
            definition,
            partOfSpeech,
            language,
            requiredCase,
            notes,
            tags
        } = req.body;

        const tagsData = tags?.map((tag: Prisma.TagCreateInput) => {
            return {
                where: { description: tag?.description },
                create: { description: tag?.description }
            }
        })

        try {
            const result = await prisma.term.create({
                data: {
                    term,                
                    definition,
                    partOfSpeech,
                    language,
                    requiredCase,
                    notes,
                    tags: {                        
                        connectOrCreate: tagsData
                    }
                },
                include: { tags: true }
            });
            res.status(201).json(result);
        } catch (err) {
            handleError(res, err);
        }
}


export const updateTerm =  async (req: Request, res: Response) => {
    try {    
        const { id } = req.params;

        const data = {
            term: req.body.term || undefined,
            definition: req.body.definition || undefined,
            language: req.body.language || undefined,
            partOfSpeech: req.body.partOfSpeech || undefined,
            requiredCase: req.body.requiredCase || undefined,
            notes: req.body.notes || undefined
        }

        const tags = req.body.tags

        const tagsData = tags?.map((t: { description: string }) => {
            return {
                where: { description: t.description },
                create: { description: t.description }
            }
        })

        const result = await prisma.term.update({
            where: {id: parseInt(id.toString())},
            data: {
                ...data,
                tags: {
                    set: [],
                    connectOrCreate: tagsData
                }
            }     
        })
        res.json(result);
    } catch(err) {
        handleError(res, err);
    }
}

function buildSearch (query: any) {
    const { pos, search, searchField, tag, language } = query;
    const conditions: TermWhereInput[] = []

    if (language) {
        conditions.push({ language: language });
    }    
    if (!!pos) {
        conditions.push({ partOfSpeech: PartOfSpeech[pos.toString() as keyof typeof PartOfSpeech]});
    }
    if (search?.length) {                
        if (searchField === 'term') {            
            conditions.push({ term: { contains: search.toString() } })
        }
        else if (searchField === 'definition') {
            conditions.push({ definition: { contains: search.toString() }});
        }
        else if (searchField === 'notes') {
            conditions.push({ notes: { contains: search.toString() }});
        }
    }

    if (tag) {
        const tagConditions: TermWhereInput[] = []
        const pushTag = (t: string) => {
            tagConditions.push({
                tags: {
                    some: {
                        description: t
                    }
                }
            })
        } 
        if (Array.isArray(tag)) {
            tag.forEach(pushTag)
        }
        else {
            pushTag(tag)
        }
        if (tagConditions.length > 0) {
            conditions.push({ OR: tagConditions })
        }
    }
    

    if (conditions.length > 0) {
        return { where: { AND: conditions }}
    }
    else {
        return null;
    }    
}

function buildSort(query: any) {
    const { sort } = query;
    const sorting: TermOrderByWithRelationInput[] = []

    if (sort === 'term') {
        sorting.push({ term: 'asc' })
    }
    else if (sort === 'pos') {
        sorting.push({ partOfSpeech: 'asc'})
    }    
    return sorting;
}

export const countTerms = async (req: Request, res: Response) => {
    try {
        const result = await prisma.term.count({
            ...buildSearch(req.query)          
        })
        res.json(result);

    } catch (err: unknown) {
        handleError(res, err);
    }
}

export const listTerms = async (req: Request, res: Response) => {
    try {                
        const pageStr = req.query.page?.toString()
        const countStr = req.query.count?.toString()
        let pageArgs = null
        if (pageStr && countStr) {
            pageArgs = {
                skip: parseInt(pageStr) * parseInt(countStr),
                take: parseInt(countStr)
            }
        }        
        const result = await prisma.term.findMany({
            ...buildSearch(req.query),
            orderBy: buildSort(req.query),
            ...pageArgs,
            include: {
                tags: true
            }
        });
        res.json(result);
    } catch (err: unknown) {
        handleError(res, err);
    }   
}

export const listTags = async (req: Request, res: Response) => {
    const { includeCounts } = req.query;
    try {
        let result = null;
        if (includeCounts === "true") {
            result = await prisma.tag.findMany({
                include: {
                    _count: {
                        select: { terms: true }
                    }
                }
            })
        }
        else {
            result = await prisma.tag.findMany();
        }
        
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}


export const deleteTerm = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.term.delete({
            where: { id: parseInt(id.toString()) }
        })
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export const deleteTag = async (req: Request, res: Response) => {
    try {
        const { description } = req.query;
        const result = await prisma.tag.delete({
            where: { description: description?.toString() }
        })
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}