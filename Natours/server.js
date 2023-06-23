const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoose = require('mongoose');



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log('DB connection successful!');
})//.catch(err => console.log(err)); -> cant globaly handle rejections



app.listen(3000, () => {
  console.log('App running on port 3000...');
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // 0 = success, 1 = uncaught exception
  });
})

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! (not rejection) Shutting down...');
  console.log(err.name, err.message);
  process.exit(1); 
})