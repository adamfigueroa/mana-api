const express = require('express');
const path = require('path');
const PracticeService = require('./practice-service');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');

const practiceRouter = express.Router();
const jsonParser = express.json();

const serializePractice = (practice) => ({
  id: practice.id,
  practice_name: xss(practice.practice_name),
  days_to_track: practice.days_to_track,
  date_start: practice.date_start,
  dates_complete: practice.dates_complete,
  dates_incomplete: practice.dates_incomplete,
  day_of_week: practice.day_of_week,
  user_id: practice.user_id,
});

async function validatePractice(req, res, next) {
  try {
    const practice = await PracticeService.getById(
      req.app.get('db'),
      req.params.practice_id
    );

    if (!practice) {
      return res.status(404).json({
        error: `${practice} not found`,
      });
    }
    req.practice = practice;
    next();
  } catch (error) {
    next(error);
  }
}

practiceRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PracticeService.getUserPractices(req.app.get('db'), req.user.id)
      .then((practices) => {
        return res.json(practices.map(serializePractice));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const {
      practice_name,
      days_to_track,
      days_left,
      date_start,
      dates_complete,
      dates_incomplete,
      day_of_week,
      user_id,
    } = req.body;
    const newPractice = {
      practice_name,
      days_to_track,
      days_left,
      date_start,
      dates_complete,
      dates_incomplete,
      day_of_week,
      user_id: req.user.id,
    };

    for (const [key, value] of Object.entries(newPractice)) {
      if (value === null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
      }
    }

    PracticeService.insertPractice(req.app.get('db'), newPractice)
      .then((practice) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${practice.id}`))
          .json(serializePractice(practice));
      })
      .catch(next);
  });

practiceRouter
  .route('/:practice_id')
  .all(requireAuth)
  .all(validatePractice)
  .get((req, res, next) => {
    return res.status(200).json(serializePractice(req.practice));
  })
  .delete((req, res, next) => {
    PracticeService.deletePractice(req.app.get('db'), req.params.practice_id)
      .then((rowsAffected) => {
        return res.status(204).json({
          message: `The following item has been deleted: ${rowsAffected}`,
        });
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    let {
      practice_name,
      days_to_track,
      days_left,
      date_start,
      dates_complete,
      dates_incomplete,
      day_of_week,
      user_id,
    } = req.body;

    if (!practice_name) {
      return res.status(400).json({
        error: 'Please submit practice_name',
      });
    }
    if (!days_to_track) {
      return res.status(400).json({
        error: 'Please submit days_to_track',
      });
    }
    if (!date_start) {
      return res.status(400).json({
        error: 'Please submit date_start',
      });
    }
    if (!day_of_week) {
      return res.status(400).json({
        error: 'Please submit day_of_week',
      });
    }
    if (!user_id) {
      return res.status(400).json({
        error: 'Please submit user_id',
      });
    }

    const editPractice = {
      practice_name,
      days_to_track,
      days_left,
      date_start,
      dates_complete,
      dates_incomplete,
      day_of_week,
      user_id,
    };

    PracticeService.editPractice(
      req.app.get('db'),
      editPractice,
      req.practice.id
    )
      .then((practice) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${practice.id}`))
          .json(serializePractice(practice));
      })
      .catch(next);
  });

module.exports = practiceRouter;
