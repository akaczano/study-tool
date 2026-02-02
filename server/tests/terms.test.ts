import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import { createTerms } from './helper/term-datasets';

beforeEach(async () => {
    await prisma.term.deleteMany({});
    await prisma.tag.deleteMany({});
})

describe('GET /term', () => {
    it('should be empty at first', async () => {
        const response = await request(app).get('/term');        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);        
    })

    it('should be full now', async () => {
        const n = 15;
        await createTerms(n);   
        const response = await request(app).get('/term');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(n);
    })

    it('should filter', async () => {
        const terms = [
            {
                term: "apple", 
                definition: "round red fruit", 
                partOfSpeech: "NOUN",
                language: "LATIN",
                tags: [ { description: "yummy" }]                
            },
                        {
                term: "banana", 
                definition: "long yellow fruit", 
                partOfSpeech: "NOUN",
                language: "LATIN",
                tags: [{ description: "yummy" }]                
            },
                        {
                term: "orange", 
                definition: "round orange fruit", 
                partOfSpeech: "NOUN",
                language: "LATIN",
                tags: [{ description: "vitamin C"}]                
            },
            {
                term: "eat", 
                definition: "consume food", 
                partOfSpeech: "VERB",
                language: "LATIN",
                tags: []                
            },
        ]
        for (const t of terms) {
            await request(app).post('/term').send(t).expect(201);
        }

        const resp1 = await request(app).get('/term').expect(200);
        expect(resp1.body).toHaveLength(4);

        const resp2 = await request(app).get('/term?search=apple&searchField=term').expect(200)
        expect(resp2.body).toHaveLength(1)

        const resp3 = await request(app).get('/term?search=apple&searchField=definition').expect(200)
        expect(resp3.body).toHaveLength(0)
        
        const resp4 = await request(app).get('/term?search=round&searchField=definition').expect(200)
        expect(resp4.body).toHaveLength(2)
        
        const resp5 = await request(app).get('/term?pos=VERB').expect(200)
        expect(resp5.body).toHaveLength(1)

        const resp6 = await request(app).get('/term?search=or&searchField=term&pos=NOUN').expect(200)
        expect(resp6.body).toHaveLength(1)

        const resp7 = await request(app).get('/term?tag=yummy').expect(200)
        expect(resp7.body).toHaveLength(2)

        const resp8 = await request(app).get('/term?tag=yummy&tag=vitamin%20C')
        expect(resp8.body).toHaveLength(3)

        const resp9 = await request(app).get('/term/count?tag=yummy').expect(200);
        expect(resp9.body).toEqual(2);

    })

    it('should paginate', async () => {
        const n = 200;
        await createTerms(n);
        const response = await request(app).get('/term?count=10&page=0').expect(200);
        expect(response.body).toHaveLength(10);
    })

})

describe('GET /tag', () => {
    it('should be empty at first', async () => {
        const response = await request(app).get('/tag').expect(200);
        expect(response.body).toHaveLength(0)
    })
})

describe('POST /term', () => {
    it('should successfully post a term', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN"            
        }
        const response = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(response.body).toHaveProperty('term', 'test1');
        expect(response.body).toHaveProperty('definition', item.definition);        

        const persisted = await request(app).get('/term').expect(200);
        expect(persisted.body).toHaveLength(1);
        expect(persisted.body[0]).toHaveProperty('term', 'test1');
        expect(persisted.body[0]).toHaveProperty('definition', item.definition);
    })

    it('should post a term with tags', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN",
            tags: [
                { description: "Key nouns" },
                { description: "Test terms" }
            ]            
        }
        const response = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(response.body).toHaveProperty('tags');
        expect(response.body.tags).toHaveLength(2);

        const tagsList = await request(app).get('/tag').expect(200);
        expect(tagsList.body).toHaveLength(2);

        const termsList = await request(app).get('/term').expect(200);
        expect(termsList.body).toHaveLength(1);
        expect(termsList.body[0]).toHaveProperty('tags');
        expect(termsList.body[0].tags).toHaveLength(2);
        expect(termsList.body[0].tags[0]).toHaveProperty('description', 'Key nouns');

    })

    it('should post two terms with the same tags', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN",
            tags: [
                { description: "Key nouns" },
                { description: "Test terms" }
            ]            
        }
        const response = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(response.body).toHaveProperty('tags');
        expect(response.body.tags).toHaveLength(2);

        const tagsList = await request(app).get('/tag').expect(200);
        expect(tagsList.body).toHaveLength(2);

        const termsList = await request(app).get('/term').expect(200);
        expect(termsList.body).toHaveLength(1);
        expect(termsList.body[0]).toHaveProperty('tags');
        expect(termsList.body[0].tags).toHaveLength(2);
        expect(termsList.body[0].tags[0]).toHaveProperty('description', 'Key nouns');
        const item2 = {
            term: 'test2',
            definition: 'the second test term',
            language: "GREEK",
            partOfSpeech: "NOUN",
            tags: [
                { description: "Key nouns" }                
            ]            
        }
        const response2 = await request(app)
            .post('/term')
            .send(item2)
            .expect(201);            
    })

    it('should handle missing fields', async () => {
        const item = {
            term: 'test1',
            language: "GREEK",
            partOfSpeech: "NOUN",
            tags: [
                { description: "Key nouns" },
                { description: "Test terms" }
            ]            
        }
        const response = await request(app)
            .post('/term')
            .send(item)
            .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain("Argument `definition` is missing")
        const termsList = await request(app).get('/term').expect(200);
        expect(termsList.body).toHaveLength(0);
    })

})

describe('PUT /term', () => {

    it('should update a simple term', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN"            
        }
        const postResponse = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(postResponse.body).toHaveProperty('id');
       
        const list1 = await request(app).get('/term').expect(200);
        expect(list1.body).toHaveLength(1);
        expect(list1.body[0]).toHaveProperty('term', 'test1');
        expect(list1.body[0]).toHaveProperty('definition', item.definition);
    
        const newDef = 'Maybe the first test term';
        const putResponse = await request(app)
            .put(`/term/${postResponse.body.id}`)
            .send({ definition: newDef })
            .expect(200);
        expect(putResponse.body).toHaveProperty('definition', newDef);

        const list2 = await request(app).get('/term').expect(200);
        expect(list2.body).toHaveLength(1);
        expect(list2.body[0]).toHaveProperty('definition', newDef);
        expect(list2.body[0]).toHaveProperty('id', postResponse.body.id);

    })

    it('should update a term with tags', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN",
            tags: [
                { description: "Test terms" },
                { description: "Test nouns" },
                { description: "All nouns" } 
            ]            
        }
        const postResponse = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(postResponse.body).toHaveProperty('id');
        expect(postResponse.body).toHaveProperty('tags');
        expect(postResponse.body.tags).toHaveLength(3);

        const newLanguage = "LATIN";
        const putResponse = await request(app)
            .put(`/term/${postResponse.body.id}`)
            .send({
                language: newLanguage,
                tags: [
                    { description: "Test terms" },
                    { description: "Test Nouns" }                    
                ]
            })
            .expect(200);
        
        const list2 = await request(app).get('/term').expect(200);
        expect(list2.body).toHaveLength(1);
        expect(list2.body[0]).toHaveProperty('id', postResponse.body.id);
        expect(list2.body[0]).toHaveProperty('language', newLanguage);
        expect(list2.body[0]).toHaveProperty('tags');
        expect(list2.body[0].tags).toHaveLength(2);
        expect(list2.body[0].tags[0]).toHaveProperty('description', 'Test terms')
        expect(list2.body[0].tags[1]).toHaveProperty('description', 'Test Nouns')

    })    
})

describe('DELETE /term', () => {
    it('should delete a simple term', async () => {
        const item = {
            term: 'test1',
            definition: 'the first test term',
            language: "GREEK",
            partOfSpeech: "NOUN"            
        }
        const postResponse = await request(app)
            .post('/term')
            .send(item)
            .expect(201);
        expect(postResponse.body).toHaveProperty('id');
       
        const list1 = await request(app).get('/term').expect(200);
        expect(list1.body).toHaveLength(1);
        expect(list1.body[0]).toHaveProperty('term', 'test1');
        expect(list1.body[0]).toHaveProperty('definition', item.definition);

        const response = await request(app).delete(`/term/${postResponse.body.id}`).expect(200);
        
        const list2 = await request(app).get('/term').expect(200);
        expect(list2.body).toHaveLength(0);

    })
})
