const express = require('express');
const app = express();

const mongoose = require('mongoose');
const mongoUri = 'mongodb+srv://admin:mypassword@track-server-db-ixu0w.mongodb.net/test?retryWrites=true&w=majority';

// we add the options below so that we don't see any errors in our console.
// mongoose === MongoClient
mongoose.connect(mongoUri, {
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