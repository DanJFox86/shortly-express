const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then((hash) => {
        req.session = {hash: hash};
        res.cookies = {shortlyid: {value: hash}};
        return models.Sessions.get({hash})
          .then((result) => {
            req.session.userId = result.userId;
            return result.userId;
          })
          .then((userId)=> {
            if (userId) {
              return models.Users.get({id: userId})
                .then((user) => {
                  if (user) {
                    // req.session.user = {"username": user.username};
                    next();
                  }
                })
              }
          })
          .then(() => {
            next();
          })
    })
  } else {
    return models.Sessions.get({hash: req.cookies.shortlyid})
      .then((data) => {
        req.session = {hash: hash};
      })
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

