const express = require('express');
const path = require('path');
const SessionService = require('./session-service');
const { requireAuth } = require('../middleware/jwt-auth');

const sessionRouter = express.Router();
const jsonParser = express.json();

const serializeSession = (session) => ({
  id: session.id,
  date: session.date,
  practice_id: session.practice_id,
});

async function validateSession(req, res, next) {
  try {
    const session = await SessionService.getById(
      req.app.get('db'),
      req.params.session_id
    );

    if (!session) {
      return res.status(404).json({
        error: `${session} not found`,
      });
    }
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
}

sessionRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    SessionService.getUserSessions(req.app.get('db'), req.user.id)
      .then((sessions) => {
        return res.json(sessions.map(serializeSession));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { date, practice_id } = req.body;
    const newSession = {
      date,
      practice_id,
    };

    for (const [key, value] of Object.entries(newSession)) {
      if (value === null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
      }
    }

    SessionService.insertSession(req.app.get('db'), newSession)
      .then((session) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${session.id}`))
          .json(serializeSession(session));
      })
      .catch(next);
  });

sessionRouter
  .route('/:session_id')
  .all(requireAuth)
  .all(validateSession)
  .get((req, res, next) => {
    return res.status(200).json(serializeSession(req.session));
  })
  .delete((req, res, next) => {
    SessionService.deleteSession(req.app.get('db'), req.params.session_id)
      .then((rowsAffected) => {
        return res.status(204).json({
          message: `The following item has been deleted: ${rowsAffected}`,
        });
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    let { date, practice_id } = req.body;

    if (!date) {
      return res.status(400).json({
        error: 'Please submit completed date',
      });
    }
    if (!practice_id) {
      return res.status(400).json({
        error: 'Please submit practice_id',
      });
    }

    const editedSession = {
      date,
      practice_id,
    };

    SessionService.editSession(req.app.get('db'), editedSession, req.session.id)
      .then((session) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${session.id}`))
          .json(serializeSession(session));
      })
      .catch(next);
  });

module.exports = sessionRouter;
