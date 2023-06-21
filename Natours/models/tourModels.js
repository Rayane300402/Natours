const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    }
  })
  
//To create a model out of the schema + add data in the collection, will always run everytime you reload the server
const Tour = mongoose.model('Tour', toursSchema);

//for testing
// const testTour = new Tour({
//   name: 'The Mixers',
//   price: 967
// })

// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('ERROR: ', err);
// })

module.exports = Tour;