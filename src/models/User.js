const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});



// this function is called pre-save function -- this will work when the user is setting their password (e.g. signup page)
// we use regular function expression instead of fat arrow function for the callback -- the value of 'this' is set to the user we're currently working on
// because we want to assign the 'this' keyword to the scope of this callback and not to the context object
// also next is for when we want to move on with the rest of the code -- google it to find out more
userSchema.pre('save', function(next) {
  // 0  who is current user?
  const user = this;

  // 1  look for password modifications:
  if (!user.isModified('password')) return next();
  // if the user hasn't changed their password do nothing and jump out

  // 2  salt and hash the password:
  bcrypt.genSalt(10, (err, salt) => {
    // 10 is the method that bcrypt should use to generate the random salt (string of characters)

    if (err) return next(err);
    // if for any reason bcrypt could not return a salt and returned an error, give up and jump out

    // if salt was generated successfully, then hash the user's password along with it:
    bcrypt.hash(user.password, salt, (err, hash) => {
      // hash is actually the hashed salted password that we want to store on our database
      
      if (err) return next(err);
      // same error checking logic as before

      // finally we store the hashed salted password over our previous password property for user object of the request body which was set in the middlewares folder
      user.password = hash;
      next();
      // then we jump out and move on with our code
      // now we need to authenticate a user against that hash
    });
  });
});



// now we need a function to determine how we're going to authenticate users against this hash:
// we create a new method inside our schema 
// the goal is to compare the user's candidatePassword which is entered at login page to the previous hashed salted password stored inside the user's object
// again as with previous function, notice the regular 'function' expression used here (this => current user)
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  // we're creating a new promise in our return statement, because...
  // bcrypt is old and uses the old callback syntax for its '.compare' method
  // we're returning a promise, so that we're able to use the newer JS syntax
  return new Promise((resolve, reject) => {
    // a promise is an object -- it can have only one of these states: pending / reject / resolve
    // we'll reject when we encounter an error and resolve when we find a match
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      // here we compare the entered candidate password and the hashed salted user.password
      // the callback will then return either an error or a value as the answer
      // the value is a boolean, so it's either TRUE or FALSE
      
      if (err) return reject(err);
      // if for any reason the bcrypt's compare failed to work, we jump out with a reject

      if (!isMatch) return reject(err);
      // if it didn't fail, but the boolean value for comparison was NOT TRUE (FALSE) we would also reject

      resolve(true);
      // otherwise, the user has entered the correct password and we'll resolve with a value of true
    });
  });
}




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