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
                .patch(`/chart/group/${resp1.body.id}`)
                .send({ description: "Second group" })
                .expect(200);
        const resp3 = await request(app).get('/chart').expect(200);
        expect(resp3.body).toHaveLength(1);
        expect(resp3.body[0]).toHaveProperty("description", "Second group");
    })

    it('should update a chart', async () => {
        const resp1 = await request(app)
            .post('/chart/group')
            .send({ description: "Group A"})
            .expect(201);
        const resp2 = await request(app)
            .post('/chart/group')
            .send({ description: "Group B"})
            .expect(201);

        const resp3 = await request(app)
            .post('/chart')
            .send({
                description: "Tesf chart",
                language: "GREEK",
                groupId: resp1.body.id                
            })
            .expect(201)
        const resp4 = await request(app)
            .put(`/chart/${resp3.body.id}`)
            .send({                
                description: "Test chart",
                groupId: resp2.body.id
            })
            .expect(200);

        const resp5 = await request(app).get("/chart").expect(200)
        expect(resp5.body).toHaveLength(2);
        for (const group of resp5.body) {
            if (group.id === resp1.body.id) {
                expect(group.charts).toHaveLength(0);
            }
            else {
                expect(group.charts).toHaveLength(1);
                expect(group.charts[0]).toHaveProperty("description", "Test chart");
            }
        }

    })

    it('should delete a chart', async () => {
        const resp1 = await request(app)
            .post('/chart/group')
            .send({ description: "Test group"})
            .expect(201);
        const resp2 = await request(app)
            .post('/chart')
            .send({
                description: "Test chart",
                groupId: resp1.body.id,
                language: "GREEK"
            })
            .expect(201);
        const resp3 = await request(app).get('/chart').expect(200);
        expect(resp3.body).toHaveLength(1);
        expect(resp3.body[0]).toHaveProperty("charts");
        expect(resp3.body[0].charts).toHaveLength(1);
        await request(app).delete(`/chart/${resp2.body.id}`)
        const resp4 = await request(app).get('/chart').expect(200);
        expect(resp4.body).toHaveLength(1);
        expect(resp4.body[0]).toHaveProperty("charts");
        expect(resp4.body[0].charts).toHaveLength(0);

    })

    it('should delete a group', async () => {
        const resp1 = await request(app)
            .post('/chart/group')
            .send({ description: "Test group"})
            .expect(201);
        await request(app)
            .delete(`/chart/group/${resp1.body.id}`)
            .expect(200);
        const resp2 = await request(app).get('/chart').expect(200);
        expect(resp2.body).toHaveLength(0);
    })

})
