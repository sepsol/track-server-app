const mongoose = require('mongoose');


const pointSchema = new mongoose.Schema({
  // timestamps are stored as a long number which counts miliseconds passed from 1970 -- look at iat property inside the payload of a jwt token to see an example of this
  timestamp: Number,   //  timestamp: Number  ===  timestamp: { type: Number }  ===  timestamp: { type: mongoose.Schema.Types.Number }
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  }
});


const trackSchema = new mongoose.Schema({
  // the line below tells mongoose to go get the id which has a type of 'ObjectId' from 'User' model:
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      { type: String, default: ''},  //  type: String  ===  type: mongoose.Schema.Types.String
  locations: [pointSchema]  // we have to define pointSchema above this line of code
});


// NOTE: every new schema is assigned an _id when saved to mongodb servers
mongoose.model('Track', trackSchema);