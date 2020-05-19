// our imports:
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');

const User = mongoose.model('User');  // we require our user constructor model and save it in a variable
const router = express.Router();    // instead of creating an app with express() we create a router object with express.Router()



// FOR SIGN UP:
router.post('/signup', async (req, res) => {
  const { email, password } = req.body; // e.g. email === req.body.email 

  try {           // email: email, password: password
    
    const user = new User({ email, password }); // we construct a new user and put our retrieved email and password inside an object in it -- so from now on user is an instance from mongoose
    await user.save();  // we then have to tell mongoose to save this new user on mongodb servers - which is a server put request and therefor is an async function -- the the user from mongoose is connected with mongodb

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY); // go to jwt.io to generate it by your own
    res.send({ token }); // { token: token }
    
  } catch (err) {
    res.status(422).send({ error: err.message });
    // 422 HTTP Status Code:
    // The request was well-formed 
    // but was unable to be followed due to semantic errors.
  }
});


// FOR SIGN IN:
router.post('/signin', async (req, res) => {
  // const { email: email, password: password } = req.body  =>  const email = req.body.email
  const { email, password } = req.body;  

  // we'll first check to see if email and password are provided
  if (!email || !password) return res.status(422).send({ error: 'You must provide your email and password.' });

  // if the email was provided, we'll check to see if there's any match with our mongodb documents
  // we'll use a mongoose method called findOne on mongoose's User model
  // since this requires a request to be sent to our mongodb database, we have to use await for this line
  // the expected result is to either find a user object with that email in our database, or return null for the user

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: 'User does not exist.' });

  // we've now successfully validated user's email, now it's time to validate his/her password:

  // here we'll use our comparePassword function which was created inside mongoose User model file as a method
  // as it'll return a promise, and promises have a default state of <pending> we would make this function async
  // now promises can also return resolve or reject, so we'll use try-catch block to capture that response:

  // (remember, our promise either returned an error inside reject or true inside resolve)
  try {
    await user.comparePassword(password);
    // run the code above and if we didn't jump into the catch block, do the following:
    // give the user a new token so that after authentication, he'll be authorized to use private routes in our app
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);   // arguments: (payload or body of the token , our secret JWT key)
    res.send({ token });
  } catch (err) {
    res.status(422).send({ error: 'Invalid email or password.' });
  }
});



module.exports = router;  // we then export this router module so that we can import it somewhere else