  const googleStrategy = require('./src/strategy/googleStrategy');
  const githubStrategy = require('./src/strategy/githubStrategy');

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

app.use(
  cors({
    origin: ['https://itransition-course-project-frontend.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);  app.use(
  session({
    secret: '12345', 
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, 
      sameSite: 'none',
      maxAge: 100 * 24 * 60 * 60,
    },
  })
);
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
