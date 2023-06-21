const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log('DB connection successful!');
});



app.listen(3000, () => {
  console.log('App running on port 3000...');
});


