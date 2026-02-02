import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

beforeEach(async () => {
    await prisma.chart.deleteMany({});
    await prisma.chartGroup.deleteMany({});
})


describe('CR chart', () => {
    it('should be empty at first', async () => {
        const resp1 = await request(app).get('/chart').expect(200);
        expect(resp1.body).toHaveLength(0);
    })

    it('should post one group', async () => {
        await request(app)
            .post('/chart/group')
            .send({ description: "Test group"})
            .expect(201)
        const resp1 = await request(app).get('/chart').expect(200)
        expect(resp1.body).toHaveLength(1)
        expect(resp1.body[0]).toHaveProperty("description", "Test group");
    })

    it('should post a chart in a group', async () => {
        const resp1 = await request(app)
            .post('/chart/group')
            .send({ description: "Test group"})
            .expect(201);
        expect(resp1.body).toHaveProperty("id");

        const resp2 = await request(app)
            .post("/chart")
            .send({ language: "GREEK", description: "First chart", groupId: resp1.body.id })
            .expect(201);
        
        const resp3 = await request(app).get("/chart").expect(200);
        expect(resp3.body).toHaveLength(1);
        expect(resp3.body[0]).toHaveProperty("description", "Test group")
        expect(resp3.body[0]).toHaveProperty("charts");
        expect(resp3.body[0].charts).toHaveLength(1);
        expect(resp3.body[0].charts[0]).toHaveProperty("description", "First chart");

    })

})

describe('UD chart', () => {
    it('should update a group', async () => {
        const resp1 = await request(app)
            .post('/chart/group')
            .send({ description: "Group 1"})
            .expect(201);
        expect(resp1.body).toHaveProperty("id");
        const resp2 = await request(app).get('/chart').expect(200);
        expect(resp2.body).toHaveLength(1);
        expect(resp2.body[0]).toHaveProperty("id", resp1.body.id);
        expect(resp2.body[0]).toHaveProperty("description", "Group 1");
        await request(app)
                .patch('/chart/group')
                .send({ id: resp1.body.id, description: "Second group" })
                .expect(200);
        const resp3 = await request(app).get('/chart').expect(200);
        expect(resp3.body).toHaveLength(1);
        expect(resp3.body[0]).toHaveProperty("description", "Second group");
    })
})
