const express = require('express');
const morgan = require('morgan'); // 3rd party middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalError = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');


const app = express();
// 1) MIDDLEWARES
// Set security HTTP headers
app.use(helmet());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// 'dev' is a predefined format in morgan, it will log the request to the console, it will log the http method, the url, the status code and the response time
// app.use(morgan('tiny')); //middleware
// 'tiny' is another predefined format in morgan, it will log the http method, the url, the status code and the response time, but it will be more concise than 'dev' format

// app.use(express.json()); //middleware
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
app.use('/api/v1/reviews', reviewRouter);



app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail'
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // next(err);
})

app.use(globalError)

module.exports = app;
