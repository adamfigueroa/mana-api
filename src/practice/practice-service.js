const PracticeService = {
  getAllPractices(db) {
    return db.select('*').from('user_practice');
  },

  getUserPractices(db, submitted_id) {
    return db
      .select('*')
      .from('user_practice')
      .where({ user_id: submitted_id });
  },

  getById(db, id) {
    return db.select('*').from('user_practice').where({ id }).first();
  },

  insertPractice(db, newPractice) {
    return db
      .insert(newPractice)
      .into('user_practice')
      .returning('*')
      .then(([practice]) => practice)
      .then((practice) => PracticeService.getById(db, practice.id));
  },

  deletePractice(db, practice_id) {
    return db('user_practice')
      .where({
        id: practice_id,
      })
      .delete();
  },

  editPractice(db, practice, id) {
    return db('user_practice')
      .where({
        id: id,
      })
      .update(practice);
  },
};

module.exports = PracticeService;
