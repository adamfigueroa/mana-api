const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Practice Endpoints', function () {
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

  describe('GET /api/practice', () => {
    beforeEach('Create tables and seed', () => {
      return helpers.seedTestPracticeTables(db, testUsers, testPractice);
    });

    context('Successful Login', () => {
      it('responds with 200 and empty array when user has no practice', () => {
        return supertest(app)
          .get('/api/practice')
          .set('Authorization', helpers.makeAuthHeader(testUsers[3]))
          .expect(200, []);
      });

      it('responds with 200 and user practice', () => {
        const expectedPractice = [
          {
            id: 1,
            practice_name: 'practice-1',
            days_to_track: 15,
            date_start: '2021-02-05T16:28:32.615Z',
            day_of_week: [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
            user_id: 1,
          },
          {
            id: 6,
            practice_name: 'practice-6',
            days_to_track: 17,
            date_start: '2021-02-05T16:28:32.615Z',
            day_of_week: ['Sunday', 'Thursday', 'Friday'],
            user_id: 1,
          },
        ];

        return supertest(app)
          .get('/api/practice')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedPractice);
      });
    });
  });

  describe('POST /api/practice', () => {
    beforeEach('Create tables and seed', () => {
      return helpers.seedTestPracticeTables(db, testUsers, testPractice);
    });

    it('responds with 400 and "Missing practice_name in request body" if practice name is not included', () => {
      const badPractice = {
        practice_name: null,
        days_to_track: 5,
        date_start: testPractice[0].date_start,
        day_of_week: ['Sunday', 'Thursday', 'Friday'],
        user_id: 1,
      };
      return supertest(app)
        .post('/api/practice')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(badPractice)
        .expect(400, {
          error: "Missing 'practice_name' in request body",
        });
    });
  });
});
