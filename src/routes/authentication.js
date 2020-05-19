// our imports:
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');  // we require our user constructor model and save it in a variable
const router = express.Router();    // instead of creating an app with express() we create a router object with express.Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body; // e.g. email === req.body.email 
  try {           // email: email, password: password
    const user = new User({ email, password }); // we construct a new user and put our retrieved email and password inside an object in it -- so from now on user is an instance from mongoose
    await user.save();  // we then have to tell mongoose to save this new user on mongodb servers - which is a server put request and therefor is an async function -- the the user from mongoose is connected with mongodb
    const token = jwt.sign({userId: user._id}, process.env.JWT_KEY);
    res.send({ token }); // { token: token }
  } catch (err) {
    res.status(422).send(err.message);
    // 422 HTTP Status Code:
    // The request was well-formed 
    // but was unable to be followed due to semantic errors.
  }
});

module.exports = router;  // we then export this router module so that we can import it somewhere else