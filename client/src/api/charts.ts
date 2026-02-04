import client from './client';

export type Chart = {
    id?: number,
    description: string,
    language: string,
    data?: string,
    groupId: number
}

export type ChartGroup = {
    id: number,
    description: string,
    charts: Chart[]
}

export const fetchGroups = async () => {
    const result = await client.get('/chart');
    if (result.status === 200) {
        return result.data;
    }   
    else {
        throw Error(`Request to list chart groups yielded response ${result.data.message}`)
    } 
}

export const createGroup = async (description: string) => {
    const result = await client.post('/chart/group', { description })
    if (result.status === 201) {
        return result.data
    }
    else {
        throw Error("Failed to create group " + result.data.message);
    }
}