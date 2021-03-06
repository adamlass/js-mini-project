const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
const graphqlHTTP = require("express-graphql")
const { ApolloServer } = require('apollo-server-express')

var app = express();

// graphql
const { schema, typeDefs, resolvers } = require("./graphql/schema")

//mongoose connection
const connect = require("./dbConnect");
connect(require("./settings").DEV_DB_URI);

//router imports
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// apollo server
const server = new ApolloServer({ typeDefs, resolvers })
const apolloPath = "/apollo"
server.applyMiddleware({app, path: apolloPath})

//graphql
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true,
}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
