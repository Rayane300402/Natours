const express = require('express');
const morgan = require('morgan'); // 3rd party middleware

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// 'dev' is a predefined format in morgan, it will log the request to the console, it will log the http method, the url, the status code and the response time
// app.use(morgan('tiny')); //middleware
// 'tiny' is another predefined format in morgan, it will log the http method, the url, the status code and the response time, but it will be more concise than 'dev' format

app.use(express.json()); //middleware
//function that modifies the incoming request data

app.use(express.static(`${__dirname}/public`)); //middleware

// create our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours )
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
//update a tour
// app.patch('/api/v1/tours/:id', updateTour)
//delete a tour
// app.delete('/api/v1/tours/:id', deleteTour )

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
