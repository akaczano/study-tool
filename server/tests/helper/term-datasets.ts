import { Case, Language, PartOfSpeech } from '../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

export const generateTerm = () => {
    const rand1 = Math.floor(Math.random() * 10000);
    return {
        term: `term_rand_${rand1}`,
        definition: `random term number ${rand1}`,
        language: Object.values(Language)[rand1 % Object.values(Language).length],
        partOfSpeech: Object.values(PartOfSpeech)[rand1 % Object.values(PartOfSpeech).length],
        requiredCase: Object.values(Case)[rand1 % Object.values(Case).length],
        notes: ""
    }

}


export const createTerms = async (n: number) => {

    for (let i = 0; i < n; i++) {
        await prisma.term.create({
            data: generateTerm()
        })
    } 

}