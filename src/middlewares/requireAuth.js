const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');


// for validation a user will send a token that was generated with our key and has a payload of their id and iat (issued at) 
// we should receive that token in an HTTP GET request with a Header of 'Authorization: "Bearer <token>"'
// so we want to validate the token inside HTTP GET Request Header here

module.exports = (req, res, next) => {
  // first we assign authorization from request header to a value:
  const { authorization } = req.headers;  
  // const authorization = req.headers.authorization => NOTE: express automatically converts all header keys to lowercase

  // if we find no auth inside the header we return this message:
  if (!authorization) return res.status(401).send('Failed to login.');
  // 401 semantically means "unauthorised",[33] the user does not have valid authentication credentials for the target resource.

  // then we remove the token from it and store it in a value:
  const token = authorization.replace('Bearer ', '');
  // we're simply replacing the Bearer (and its space) inside header with empty string

  // now we can do verification:
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {

    // in case of an error (payload being null) do this:
    if (err) return res.status(401).send('Failed to login.');

    // create a variable called userId and assign payload.userId to it:
    const { userId } = payload; 
          // wait for mongoose to search our User documents inside mongodb with that userId
    const user = await User.findById(userId);
    // if found store it inside user variable
    // then place it inside the user prop of every request object being sent from the client:
    req.user = user;
    // this helps other parts of our app to be able to still access the current user's data

    // then continue on with the rest of our middleware chain
    // or if there's no more middlewares return 
    next();
  });
}