// const fs = require('fs');
const Tour = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price'; // - means descending order
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// testing purposes
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next(); //if the id is valid, call the next middleware
// }

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     //if the name or price is not there
//     return res.status(400).json({
//       //400 means bad request
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next(); //if the name and price are there, call the next middleware
// }

// class APIFEATURES {
//   comstructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryObj = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach(el => delete queryObj[el]); // deletes the fields if it's there

//     // console.log(req.query);

//     // 1B) Advanced filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the gte, gt, lte, lt with $gte, $gt, $lte, $lt so mongoose can understand it

//     this.query.find(JSON.parse(queryStr));
//   }

//   sort() {
//     if (req.query.sort) { // if we have a sort query
//       const sortBy = req.query.sort.split(',').join(' '); //split the query by comma and join it by space
//       query = query.sort(sortBy);
//     } else{
//       query = query.sort('-createdAt'); // default sort by createdAt
//     }

//     // 3) Field limiting
//     if (req.query.fields) { // if we have a fields query
//       const fields = req.query.fields.split(',').join(' '); //split the query by comma and join it by space
//       query = query.select(fields);
//     } else{
//       query = query.select('-__v'); // default select everything except __v cz - means exclude
//     }
//   }

//   paginate() {
//     if(req.query.page) {
//       const page = req.query.page * 1 || 1; //convert to number or default to 1
//       const limit = req.query.limit * 1 || 100; //convert to number or default to 100
//       const skip = (page - 1) * limit;

//       query = query.skip(skip).limit(limit);

//       if(req.query.page) {
//         const numTours = await Tour.countDocuments();
//         if(skip >= numTours) throw new Error('This page does not exist');
//       }
//     } else {
//       query = query.skip(0).limit(100);
//     }
//   }
// }

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   //   console.log(req.requestTime);
//     // BUILD QUERY
//     // 1A) Filtering
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach(el => delete queryObj[el]); // deletes the fields if it's there

//     // console.log(req.query);

//     // // 1B) Advanced filtering
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the gte, gt, lte, lt with $gte, $gt, $lte, $lt so mongoose can understand it

//     // let query = Tour.find(JSON.parse(queryStr));

//     // 2) Sorting
//     // if (req.query.sort) { // if we have a sort query
//     //   const sortBy = req.query.sort.split(',').join(' '); //split the query by comma and join it by space
//     //   query = query.sort(sortBy);
//     // } else{
//     //   query = query.sort('-createdAt'); // default sort by createdAt
//     // }

//     // // 3) Field limiting
//     // if (req.query.fields) { // if we have a fields query
//     //   const fields = req.query.fields.split(',').join(' '); //split the query by comma and join it by space
//     //   query = query.select(fields);
//     // } else{
//     //   query = query.select('-__v'); // default select everything except __v cz - means exclude
//     // }

//     // 4) Pagination
//     // if(req.query.page) {
//     //   const page = req.query.page * 1 || 1; //convert to number or default to 1
//     //   const limit = req.query.limit * 1 || 100; //convert to number or default to 100
//     //   const skip = (page - 1) * limit;

//     //   query = query.skip(skip).limit(limit);

//     //   if(req.query.page) {
//     //     const numTours = await Tour.countDocuments();
//     //     if(skip >= numTours) throw new Error('This page does not exist');
//     //   }
//     // } else {
//     //   query = query.skip(0).limit(100);
//     // }

//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await features.query;

//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy',
//     // });

//     // --> it's similar to req.query so...
//     // const tours =  await Tour.find(req.query);

//     // more advanced filtering and better filtering
//     // const tours = await Tour.find(queryObj)

//     // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       // requestedAt: req.requestTime, //number of tours
//       data: {
//         tours, //: tours //tours array
//       },
//     });
 
// });

// exports.getTour = catchAsync(async (req, res, next) => {

//     const tour = await Tour.findById(req.params.id);
//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }
//     // Tour.findOne({ _id: req.params.id }) <- another way to do it
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour, //: tours //tours array
//       },
//     });

//   // console.log(req.params);
//   // //convert string to number
//   // const id = req.params.id * 1; //multiply by 1 to convert to number

//   // const tour = tours.find((el) => el.id === id); //find the tour with the id that matches the id in the url

//   //make sure to return a 404 error if the id is greater than the length of the array
//   // if(id > tours.length) {
//   // if (!tour) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid ID',
//   //   });
//   // }

//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour, //: tours //tours array
//   //   },
//   // });
// });

// const catchAsync = fn => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   }
// }

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   }); // 201 stands for created, created a new resource on the server


//   // try {
//   // } catch (err) {
//   //   // console.log(err);
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
//   // console.log(req.body);

//   // create a fictional db cz we dont have one
//   // const newID = tours[tours.length - 1].id + 1; //last id + 1
//   // const newTour = Object.assign({ id: newID }, req.body); //create a new object with the id and the body

//   // tours.push(newTour); //push the new tour to the tours array
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     }); // 201 stands for created, created a new resource on the server
//   //   }
//   // );

//   // res.send('You can post to this endpoint...');
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, //return the new object
//       runValidators: true, //run the validators again
//     });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });

// });

// exports.deleteTour = catchAsync(async (req, res, next) => {

//     const tour = await Tour.findByIdAndDelete(req.params.id); //no need to save it to a variable cz we dont need to send anything back to the client

//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
  
// });

exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, //match all the tours that have a rating greater than or equal to 4.5
      },
      {
        $group: {
          // _id: null,
          _id: { $toUpper: '$difficulty' }, //group by difficulty
          numTours: { $sum: 1 }, //add 1 for each tour
          numRatings: { $sum: '$ratingsQuantity' }, //add the number of ratings for each tour
          avgRating: { $avg: '$ratingsAverage' }, //calculate the average rating for each tour
          avgPrice: { $avg: '$price' }, //calculate the average price for each tour
          minPrice: { $min: '$price' }, //calculate the minimum price for each tour
          maxPrice: { $max: '$price' }, //calculate the maximum price for each tour
        },
      },
      {
        $sort: { avgPrice: 1 }, //sort by average price in ascending order
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
 
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
