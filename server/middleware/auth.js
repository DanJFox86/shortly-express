const models = require('../models');
const Promise = require('bluebird');
// return models.Sessions.get({hash: hash})
        //   .then((result) => {
        //     req.session.userId = result.userId;
        //     return result.userId;
        //   })
          // .then((userId)=> {
            // if (userId) {
module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then((data) => {
        var userId = data[0].insertId;
        var hash = data[1];
        req.session = { hash: hash, userId: userId, user: {}};
        res.cookies = { shortlyid: {value: hash} };
        return models.Users.get({id: userId})
          .then((user) => {
            if (user) {
              req.session.user = {username: user.username};
              next();
            }
          })
          .then(() => {
            next();
          })
          .catch((err) => {
            console.log(err);
          })
        })
  } else {
    var hash = req.cookies.shortlyid;
    req.session = { hash: hash };
    console.log(req.session);
    return models.Sessions.get({hash})
      .then((data) => {
        console.log('DATA', data);
        return models.Users.get({id: data.userId})
          .then((user) => {
            console.log('USER', user);
            req.session.user = {username: user.username};
            next();
          })
          .catch((err) => {
            console.log(err);
          })
        })
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

