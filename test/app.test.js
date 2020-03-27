const app = require('../app');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Express app', () => {
  describe('GET /movie endpoint', () => {
    it('should return 200 with JSON array of movies', () => {
      supertest(app)
        .get('/movie')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
        })
    });
  });
});