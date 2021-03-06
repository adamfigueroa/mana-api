const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function () {
  let db;

  const { testUsers, testPractice } = helpers.makePracticeFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));
  after('disconnect from db', () => db.destroy());

  beforeEach('Create tables and seed', () => {
    return helpers.seedTestPracticeTables(db, testUsers, testPractice);
  });

  const protectedEndpoints = [
    {
      name: 'GET /api/practice',
      path: '/api/practice',
    },
    {
      name: 'GET /api/practice/:practiceId',
      path: `/api/practice/${1}`,
    },
  ];

  protectedEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it('responds with 401 "Missing bearer token" when there is no token', () => {
        return supertest(app)
          .get(endpoint.path)
          .expect(401, { error: 'Missing bearer token' });
      });

      it('responds with 401 unauthorized when there is a token but bad secret', () => {
        const badSecret = 'bad-secret';
        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(testUser, badSecret))
          .expect(401, { error: 'Unauthorized request' });
      });

      it('responds with 401 unauthorized when there is a secret but bad username', () => {
        const badUser = {
          user_name: 'trojan',
          id: 1,
        };
        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(badUser))
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });
});
