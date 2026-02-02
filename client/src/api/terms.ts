import client from './client';

export type Term = {
    id?: number,
    term: string,
    definition: string,
    requiredCase?: string,
    partOfSpeech: string,
    language: string,
    tags: Tag[],
    notes?: string
}

export type Tag = {    
    description: string,
    _count?: { terms: number }
}

export type TermFetchParams = {
    language: string,
    page: number,
    count?: number,
    search?: string,
    searchField?: string,
    pos?: string,
    tag: string[],
    sort: string 
}

export const fetchTerms = async (ops: TermFetchParams) => {

    const params = {
        ...ops,        
        count: ops.count || 50,
    }

    const result = await client.get('term', { params, paramsSerializer: { indexes: null }});

    if (result.status >= 200 && result.status < 300) {
        return result.data;
    }
    else {
        throw Error(`Request to list terms yielded response ${result.data.message}`)
    }
}

export const countTerms = async (ops: TermFetchParams) => {
        const params = {
        ...ops,        
        count: ops.count || 50,
    }

    const result = await client.get('term/count', { params, paramsSerializer: { indexes: null } });

    if (result.status >= 200 && result.status < 300) {
        return result.data;
    }
    else {
        throw Error(`Request to list terms yielded response ${result.data.message}`)
    }
}

export const saveTerm = async (term: Term) => {
    
    let result = null;
    if (term.id) {
        result = await client.put(`/term/${term.id}`, term);
    }
    else {
        result = await client.post('/term', term);
    }    
    
    if (result.status == 200 || result.status == 201) {
        return result.data;
    }
    else {
        throw Error(`Failed to save term. Response: ${result.data.message}`)
    }
}

export const fetchTags = async (includeCounts=false) => {
    const result = await client.get('tag', { params: { includeCounts }});

    if (result.status == 200) {
        return result.data;
    }
    else {
        throw Error(`Request to list tags yielded response ${result.data.message}`)
    }
}

export const removeTerm = async (t: Term) => {    
    const result = await client.delete(`/term/${t.id}`)
    return result.data;
}

export const removeTag = async (t: Tag) => {
    const result = await client.delete(`/tag`, { params: { description: t.description }})
    return result.data;
}