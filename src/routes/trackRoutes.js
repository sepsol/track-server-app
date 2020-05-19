const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');
const router = express.Router();

// this line runs our requireAuth(orization)
router.use(requireAuth);
// this makes sure that every request after it is handled after the requireAuth function is run
// so we're essentially making sure that eveery other route that we attach to trackRouter, will want the user to be signed in


// remember, in requireAuth we attach the user to our request object
router.get('/tracks', async (req, res) => {
  // here we'll first issue a query search inside our Track model to find the user id
  // this is a request from mongoose to mongodb, so this is async
  const tracks = await Track.find({ userId: req.user._id });
  res.send(tracks);
});


module.exports = router;