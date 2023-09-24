  const githubStrategy = require('./src/strategy/githubStrategy');
  const googleStrategy = require('./src/strategy/googleStrategy');

  const passport = require('passport');
  const express = require('express');
  const cors = require('cors');
  const app = express();
  const session = require('express-session')

  const commentRouter = require('./src/routes/commentRouter');
  const reviewRouter = require('./src/routes/reviewRouter');
  const userRouter = require('./src/routes/userRouter');
  const authRouter = require('./src/routes/authRouter');
  const apiRouter = require('./src/routes/apiRouter');

  require('dotenv').config();

  const sequelize = require('./database');

  app.use(cors({ origin: 'https://itransition-course-project-frontend.vercel.app', credentials: true }));
  app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: 'true' , sameSite:'none', httpOnly: false },
    resave: false,
    saveUninitialized: false,
  }))
  app.use(passport.initialize());
  app.use(passport.session())
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
