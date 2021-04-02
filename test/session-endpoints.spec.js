const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Session Endpoints', function () {
  let db;

  const {
    testUsers,
    testPractice,
    testSession,
  } = helpers.makePracticeFixtures();
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

  describe('GET /api/session', () => {
    beforeEach('Create tables and seed', () => {
      return helpers.seedTestSessionTables(
        db,
        testUsers,
        testPractice,
        testSession
      );
    });

    context('Successful Login', () => {
      it('responds with 200 and empty array when user has no sessions', () => {
        return supertest(app)
          .get('/api/session')
          .set('Authorization', helpers.makeAuthHeader(testUsers[3]))
          .expect(200, []);
      });

      it('responds with 200 and user practice', () => {
        const expectedSession = [
          {
            id: 1,
            date: '2021-02-05T16:28:32.615Z',
            user_id: 1,
          },
          {
            id: 2,
            date: '2021-02-05T16:28:32.615Z',
            user_id: 1,
          },
        ];

        return supertest(app)
          .get('/api/session')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedSession);
      });
    });
  });

  describe('POST /api/session', () => {
    beforeEach('Create tables and seed', () => {
      return helpers.seedTestSessionTables(
        db,
        testUsers,
        testPractice,
        testSession
      );
    });

    it('responds with 400 and "Missing date in request body" if session date is not included', () => {
      const badSession = {
        date: null,
        user_id: 1,
      };
      return supertest(app)
        .post('/api/session')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(badSession)
        .expect(400, {
          error: "Missing 'date' in request body",
        });
    });

    it('responds with 201 and the edited session', () => {
      const goodSession = {
        date: testPractice[0].date,
        user_id: 1,
      };
      return supertest(app)
        .post('/api/session')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(goodSession)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body.date).to.eql(goodPractice.date);
          expect(res.headers.location).to.equal(`/api/session/${res.body.id}`);
        });
    });
  });
});
