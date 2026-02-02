import request from 'supertest';
import app from '../app';

describe('GET /pos', () => {
  it('should return a 200 status and 6 parts of speech', async () => {
    const response = await request(app).get('/pos');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(7);
  });
});

describe('GET /language', () => {
  it('should return a 200 status and both greek and latin', async () => {
    const response = await request(app).get('/language');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe('GET /case', () => {
  it('should return a 200 status and all 6 cases', async () => {
    const response = await request(app).get('/case');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(6);
  });
});