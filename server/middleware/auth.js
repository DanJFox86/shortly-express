const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then((data)=> {
        return models.Sessions.get({id: data.insertId})
          .then((hashRow) => {
            req.session = {hash: hashRow.hash};
            res.cookie('shortlyid', hashRow.hash);
            next();
          })
      })
  } else {
    var hash = req.cookies.shortlyid;
    req.session = {hash: hash};
    return models.Sessions.get({hash: hash})
      .then((hashRow) => {
        if (hashRow === undefined) {
          return models.Sessions.create()
              .then((data) => {
                return models.Sessions.get({id: data.insertId})
                  .then((hashRow2) => {
                    res.cookie('shortlyid', hashRow2.hash);
                    next();
                  })
              })
        }
        req.session.userId = hashRow.userId;
        return models.Users.get({id: hashRow.userId})
        .then((user) => {
          if (user) {
            req.session.user = {username: user.username};
          }
          next();
        })
      })
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

