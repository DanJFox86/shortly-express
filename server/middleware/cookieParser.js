const parseCookies = (req, res, next) => {
  if (req.headers.cookie !== undefined) {
    var allCookies = req.headers.cookie.split(';');
    for (var i = 0; i < allCookies.length; i++) {
      allCookies[i] = allCookies[i].split('=');
    }
    req.cookies = {};
    for (var i = 0; i < allCookies.length; i++) {
      req.cookies[allCookies[i][0].trim()] = allCookies[i][1].trim();
    }
  };
  next();
};

module.exports = parseCookies;