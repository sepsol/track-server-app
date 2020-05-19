// our document imports:
require('dotenv').config(); // we use this to store our sensitive information during development in environment variables
require('./models/User'); // our mongoose document collection - schema model
const express = require('express');
const authRouter = require('./routes/authentication');
const mongoose = require('mongoose');


const app = express();   // this creates our express app

app.use(express.json()); // this parses requests to json format  -- this is called middleware
app.use(authRouter);     // our request handler functions are here

const mongoUri = process.env.MONGODB_ADMIN;

// we add the options below so that we don't see any errors in our console.
// mongoose === MongoClient
mongoose.connect (mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// these functions allow us to know when we connect or encounter an error
mongoose.connection.on('connected', () => console.log('Connected to mongo instance.'));
mongoose.connection.on('error', err => console.error('Error connecting to mongo.', err));

app.get('/', (req, res) => res.send('Hello, world!'));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));