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


router.post('/tracks', async (req, res) => {
  const { name, locations } = req.body;
  if (!name || !locations) return res.status(422).send('You have to provide a name and locations.');
  // 1  check to see if the values are provided (above)
  // 2  check and see if the values provided are valid against our model
  // 3  save the entry to mongodb or show an error
  
  // steps 2 & 3 are done while we do a save() on our new entry
  // so error could be the result of step 2 doing its job :)
  try {
    const track = new Track({ userId: req.user._id, name, locations });  // { ..., name: name, locations: locations }
    await track.save();
    res.send({ track });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});


module.exports = router;