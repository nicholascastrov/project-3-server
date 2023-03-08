var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const { createProxyMiddleware } = require('http-proxy-middleware');

var mongoose = require('mongoose')
var cors = require('cors');


var usersRouter = require('./routes/users');
var recipesRouter = require('./routes/recipes')
var authRouter = require('./routes/auth')

var app = express();

app.set('trust proxy', 1);
app.enable('trust proxy');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  
cors()

);

// app.use(
// cors(
//         {
//             origin: [process.env.FRONTEND_URI]  // <== URL of our future React app
//         }
//     )
// );

// app.use('/api', createProxyMiddleware({
// target: 'https://api.spoonacular.com',
// changeOrigin: true,
// // pathRewrite: {
// //     '^/api': ''
// // },
// }));

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.log(`An error occurred while connecting to the Database: ${err}`);
  });


module.exports = app;
