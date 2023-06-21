// const fs = require('fs');
const Tour = require('./../models/tourModels');

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

exports.getAllTours = async (req, res) => {
  //   console.log(req.requestTime);
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      // requestedAt: req.requestTime, //number of tours
      data: {
        tours, //: tours //tours array
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id }) <- another way to do it
    res.status(200).json({
      status: 'success',
      data: {
        tour, //: tours //tours array
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // console.log(req.params);
  // //convert string to number
  // const id = req.params.id * 1; //multiply by 1 to convert to number

  // const tour = tours.find((el) => el.id === id); //find the tour with the id that matches the id in the url

  //make sure to return a 404 error if the id is greater than the length of the array
  // if(id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour, //: tours //tours array
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    }); // 201 stands for created, created a new resource on the server
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
  // console.log(req.body);

  // create a fictional db cz we dont have one
  // const newID = tours[tours.length - 1].id + 1; //last id + 1
  // const newTour = Object.assign({ id: newID }, req.body); //create a new object with the id and the body

  // tours.push(newTour); //push the new tour to the tours array
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     }); // 201 stands for created, created a new resource on the server
  //   }
  // );

  // res.send('You can post to this endpoint...');
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return the new object
      runValidators: true, //run the validators again
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); //no need to save it to a variable cz we dont need to send anything back to the client

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
