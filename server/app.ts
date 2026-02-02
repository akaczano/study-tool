import express from 'express'
import cors from 'cors';

import { cases, languages, partsOfSpeech } from './dao/constants';
import { postTerm, updateTerm, listTerms, listTags, deleteTerm, countTerms, deleteTag } from './dao/terms';
import { listGroups, postGroup, postChart, putChart, updateGroup, removeChart, removeGroup } from './dao/charts'; 

const app = express();

app.use(cors())
app.use(express.json());

// Term routes
app.get('/term', listTerms);
app.get('/term/count', countTerms);
app.get('/tag', listTags);
app.delete('/tag', deleteTag);
app.post('/term', postTerm);
app.put('/term/:id', updateTerm);
app.delete('/term/:id', deleteTerm);

// Chart routse
app.get('/chart', listGroups);
app.post('/chart/group', postGroup);
app.post('/chart', postChart);
app.put('/chart/:id', putChart);
app.patch('/chart/group/:id', updateGroup);
app.delete('/chart/:id', removeChart);
app.delete('/chart/group/:id', removeGroup);

// Enum routes
app.get('/language', languages);
app.get('/pos', partsOfSpeech);
app.get('/case', cases);



export default app;