const SessionService = {
    getUserSessions(db, submitted_id) {
      return db
        .select('*')
        .from('sessions')
        .where({ user_id: submitted_id });
    },
  
    getById(db, id) {
      return db
      .select('*')
      .from('sessions')
      .where({ id })
      .first();
    },
  
    insertSession(db, newSession) {
      return db
        .insert(newSession)
        .into('sessions')
        .returning('*')
        .then(([session]) => session)
        .then((session) => SessionService.getById(db, session.id));
    },
  
    deleteSession(db, session_id) {
      return db('sessions')
        .where({
          id: session_id,
        })
        .delete();
    },
  
    editSession(db, session, id) {
      return db('sessions')
        .where({
          id: id,
        })
        .update(session);
    },
  };
  
  module.exports = SessionService;
  