  const googleStrategy = require('./src/strategy/googleStrategy');
  const githubStrategy = require('./src/strategy/githubStrategy');

  const passport = require('passport');
  const express = require('express');
  const cors = require('cors');
  const app = express();

  const commentRouter = require('./src/routes/commentRouter');
  const reviewRouter = require('./src/routes/reviewRouter');
  const userRouter = require('./src/routes/userRouter');
  const authRouter = require('./src/routes/authRouter');
  const apiRouter = require('./src/routes/apiRouter');

  require('dotenv').config();

  const sequelize = require('./database');

  app.use(cors({ origin: '*' }));
  app.use(passport.initialize());
  app.use(express.json());

  passport.use(googleStrategy());
  passport.use(githubStrategy());

  app.use('/comment', commentRouter);
  app.use('/review', reviewRouter);
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/api', apiRouter);

  const PORT = process.env.PORT || 3301;

  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Running on port: ${PORT}`);
    });
  }).catch(error => {
    console.error('Database sync error:', error);
  });
