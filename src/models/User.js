const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    require: true
  }
});

mongoose.model('User', userSchema);

// schema => for definig the shape of data in mongodb
// mongoose model => associates a mongodb schema with a mongodb collection item with mongoose
// mongodb collection => it's the actual database which is essentially a collection of documents - it's somewhat like an array of objects

// Models are fancy constructors compiled from Schema definitions. 
// An instance of a model is called a document. 
// Models are responsible for creating and reading documents from the underlying MongoDB database.

// the string in the first argument should be singular
// mongoose goes into our mongodb and finds the plural collection name for this model
// so for singular User model in mongoose, there should be plural collection in mongodb called Users


// EXECUTION:

// this line is like unnamed exporting, we need to require it somewhere else
// when we require a mongoose model it gets executed
// mongoose only allows a particular model to be executed once in a single project, otherwise you'll see an error
// the model gets defined actually at the exact time that we require and therefor execute the mongoose.model() line

// we can't define a model several times
// so we should have unique models and we should only require them once so that they only execute once
// therefor it's better to execute them at the root or somewhere high level
// also because we can't execute them more than once, there's no reason to assign each require statement to a variable

// then if we wanted to access the model in somewhere low and deep in our document we could do these:
// first we should import or require mongoose in our desired document
// then we should mongoose.model('User') in there and assign it to a variable