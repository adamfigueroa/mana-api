const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter.post('/', jsonBodyParser, async (req, res, next) => {
  const { first_name, last_name, user_name, password } = req.body;

  for (const field of ['first_name', 'last_name', 'user_name', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  try {
    const passwordError = UserService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUsername = await UserService.hasUserWithUsername(
      req.app.get('db'),
      user_name
    );

    if (hasUserWithUsername)
      return res.status(400).json({ error: `Email already registered` });

    const hashedPassword = await UserService.hashPassword(password);

    const newUser = {
      first_name,
      last_name,
      user_name,
      password: hashedPassword,
    };

    const user = await UserService.insertUser(req.app.get('db'), newUser);

    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(UserService.serializeUser(user));
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
