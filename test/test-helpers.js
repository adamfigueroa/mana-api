const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeTestUsersArray() {
  return [
    {
      id: 1,
      first_name: 'demo-first-1',
      last_name: 'demo-last-1',
      user_name: 'test@test.com',
      password: 'Password!1',
      date_created: '2021-03-20T16:28:32.615Z',
    },
    {
      id: 2,
      first_name: 'demo-first-2',
      last_name: 'demo-last-2',
      user_name: 'test@tester.com',
      password: 'Password!2',
      date_created: '2021-03-19T16:28:32.615Z',
    },
    {
      id: 3,
      first_name: 'demo-first-3',
      last_name: 'demo-last-3',
      user_name: 'test@testerz.com',
      password: 'Password!3',
      date_created: '2021-03-15T16:28:32.615Z',
    },
    {
      id: 4,
      first_name: 'demo-first-4',
      last_name: 'demo-last-4',
      user_name: 'test@testies.com',
      password: 'Password!4',
      date_created: '2021-03-18T16:28:32.615Z',
    },
    {
      id: 5,
      first_name: 'demo-first-5',
      last_name: 'demo-last-5',
      user_name: 'test@testiod.com',
      password: 'Password!5',
      date_created: '2021-03-22T16:28:32.615Z',
    },
  ];
}

function makeTestPracticeArray() {
  return [
    {
      id: 1,
      practice_name: 'practice-1',
      days_to_track: 15,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week:
        '{Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}',
      user_id: 1,
    },
    {
      id: 2,
      practice_name: 'practice-2',
      days_to_track: 27,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Sunday, Monday, Tuesday, Wednesday, Thursday}',
      user_id: 2,
    },
    {
      id: 3,
      practice_name: 'practice-3',
      days_to_track: 30,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Monday, Wednesday, Friday}',
      user_id: 3,
    },
    {
      id: 4,
      practice_name: 'practice-4',
      days_to_track: 90,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week:
        '{Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}',
      user_id: 3,
    },
    {
      id: 5,
      practice_name: 'practice-5',
      days_to_track: 7,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Saturday}',
      user_id: 5,
    },
    {
      id: 6,
      practice_name: 'practice-6',
      days_to_track: 17,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Sunday, Thursday, Friday}',
      user_id: 1,
    },
    {
      id: 7,
      practice_name: 'practice-7',
      days_to_track: 32,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Sunday, Saturday}',
      user_id: 2,
    },
    {
      id: 8,
      practice_name: 'practice-8',
      days_to_track: 5,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Monday, Tuesday, Wednesday, Thursday, Friday}',
      user_id: 3,
    },
    {
      id: 9,
      practice_name: 'practice-9',
      days_to_track: 7,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week:
        '{Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}',
      user_id: 2,
    },
    {
      id: 10,
      practice_name: 'practice-10',
      days_to_track: 3,
      date_start: '2021-02-05T16:28:32.615Z',
      day_of_week: '{Sunday, Tuesday, Thursday}',
      user_id: 5,
    },
  ];
}

function makeTestSessionArray() {
  return [
    {
      id: 1,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 1,
      user_id: 1,
    },
    {
      id: 2,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 2,
      user_id: 1,
    },
    {
      id: 3,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 2,
      user_id: 2,
    },
    {
      id: 4,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 3,
      user_id: 3,
    },
    {
      id: 5,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 4,
      user_id: 3,
    },
    {
      id: 6,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 4,
      user_id: 3,
    },
    {
      id: 7,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 4,
      user_id: 3,
    },
    {
      id: 8,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 5,
      user_id: 5,
    },
    {
      id: 9,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 6,
      user_id: 1,
    },
    {
      id: 10,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 7,
      user_id: 2,
    },
    {
      id: 11,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 8,
      user_id: 3,
    },
    {
      id: 12,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 9,
      user_id: 2,
    },
    {
      id: 13,
      date: '2021-02-05T16:28:32.615Z',
      practice_id: 10,
      user_id: 5,
    },
  ];
}

function cleanTables(db) {
  return db.raw('TRUNCATE user_practice, mana_users RESTART IDENTITY CASCADE');
}

function makePracticeFixtures() {
  const testUsers = makeTestUsersArray();
  const testPractice = makeTestPracticeArray();
  const testSession = makeTestSessionArray();
  return { testUsers, testPractice, testSession };
}

function seedTestUsers(db, users) {
  const hashUserPasswords = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db
    .into('mana_users')
    .insert(hashUserPasswords)
    .then(() => {
      return db.raw(
        `SELECT setval('mana_users_id_seq', ?)`,
        users[users.length - 1].id
      );
    });
}

function seedTestPracticeTables(db, users, practice) {
  return seedTestUsers(db, users)
    .then(() => {
      return db.into('user_practice').insert(practice);
    })
    .then(() => {
      return db.raw(
        `SELECT setval('user_practice_id_seq', ?)`,
        practice[practice.length - 1].id
      );
    });
}
function seedTestSessionTables(db, users, practice, session) {
  return seedTestPracticeTables(db, users, practice)
    .then(() => {
      return db.into('sessions').insert(session);
    })
    .then(() => {
      return db.raw(
        `SELECT setval('sessions_id_seq', ?)`,
        session[session.length - 1].id
      );
    });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeTestUsersArray,
  makeAuthHeader,
  makeTestPracticeArray,
  seedTestUsers,
  seedTestPracticeTables,
  seedTestSessionTables,
  cleanTables,
  makePracticeFixtures,
};
