const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const { expect } = require('chai');

describe('User Endpoints', function () {
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

  describe('POST /api/user', () => {
    context('User Validation', () => {
      beforeEach('Create tables and seed', () => {
        return helpers.seedTestPracticeTables(db, testUsers, testPractice);
      });
      const requiredFields = [
        'first_name',
        'last_name',
        'user_name',
        'password',
      ];

      requiredFields.forEach((field) => {
        const registerSubmit = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: 'Passwooord!!!!!1',
        };

        it(`responds with 400 when ${field} is missing`, () => {
          delete registerSubmit[field];
          return supertest(app)
            .post('/api/user')
            .send(registerSubmit)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      it('responds with 400 and "Your password needs to be at least 8 characters long"', () => {
        const shortPassword = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: 'Pass',
        };

        return supertest(app)
          .post('/api/user')
          .send(shortPassword)
          .expect(400, {
            error: 'Your password needs to be at least 8 characters long',
          });
      });

      it('responds with 400 and "Your password needs to be less than 100 characters"', () => {
        const longPassword = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: 'p'.repeat(101),
        };

        return supertest(app).post('/api/user').send(longPassword).expect(400, {
          error: 'Your password needs to be less than 100 characters',
        });
      });

      it('responds with 400 and "Password must not start or end with empty spaces"', () => {
        const spaceFrontPass = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: ' Passwooord!!!!!1',
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceFrontPass)
          .expect(400, {
            error: 'Password must not start or end with empty spaces',
          });
      });

      it('responds with 400 and "Password must not start or end with empty spaces"', () => {
        const spaceBackPass = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: 'Passwooord!!!!!1 ',
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceBackPass)
          .expect(400, {
            error: 'Password must not start or end with empty spaces',
          });
      });

      it('responds with 400 when password is too simple', () => {
        const simplePass = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: '12345678',
        };

        return supertest(app).post('/api/user').send(simplePass).expect(400, {
          error:
            'Your password needs to contain at least 1 upper and lower case letter, at least 1 number, and at least 1 special character',
        });
      });

      it('responds with 400 when username is taken', () => {
        const usernameTaken = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: testUser.user_name,
          password: 'Password!!!!1',
        };

        return supertest(app)
          .post('/api/user')
          .send(usernameTaken)
          .expect(400, { error: 'Email already registered' });
      });
    });

    context('Successful registration', () => {
      it('responds with 201, returns the user and hashed pass', () => {
        const newUser = {
          first_name: 'steve',
          last_name: 'stevens',
          user_name: 'stevieboi@test.com',
          password: 'Password!1!',
        };

        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property('id');
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body.last_name).to.eql(newUser.last_name);
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`);
          })
          .expect((res) => {
            db.from('mana_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.first_name).to.eql(newUser.first_name);
                expect(row.last_name).to.eql(newUser.last_name);
                expect(row.user_name).to.eql(newUser.user_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((isMatch) => {
                expect(isMatch).to.be.true;
              });
          });
      });
    });
  });
});
