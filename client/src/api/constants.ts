import client from './client';

export const fetchLanguages = async () => {
    const result = await client.get('/language');
    return result.data;
}


export const fetchPOS = async () => {
    const result = await client.get('/pos')
    return result.data;
}

export const fetchCases = async () => {
    const result = await client.get('/case');
    return result.data;
}