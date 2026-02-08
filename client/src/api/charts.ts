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

export const fetchGroups = async (language="GREEK") => {
    const result = await client.get(`/chart?language=${language}`);
    if (result.status === 200) {
        return result.data;
    }   
    else {
        throw Error(`Request to list chart groups yielded response ${result.data.message}`)
    } 
}

export const fetchChart = async (chartId: number) => {
    const result = await client.get(`/chart/${chartId}`);
    if (result.status === 200) {
        return result.data;
    }
    else {
        throw Error(`Request to fetch chart with ID ${chartId} failed: ${result.data.message}`);
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

export const createChart = async (chart: Chart) => {
    const result = await client.post('/chart', chart);
    if (result.status === 201) {
        return result.data;
    } 
    else {
        throw Error("Failed to create chart " + result.data.message);
    }
}

export const removeChart = async (chart: Chart) => {
    const result = await client.delete(`/chart/${chart.id}`);
    if (result.status === 200) {
        return result.data;
    }
    else {
        throw Error("Failed to delete chart " + result.data.message);
    }
}

export const updateChart = async (chart: Chart) => {
    const result = await client.put(`/chart/${chart.id}`, chart);
    if (result.status === 200) {
        return result.data;
    }
    else {
        throw Error("Failed to update chart " + result.data.message);
    }
}