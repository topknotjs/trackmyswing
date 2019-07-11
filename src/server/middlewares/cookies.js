class CookiesHandler {
  constructor(req, res) {
    this.request = req;
    this.response = res;
  }
  hasCookie(cookie) {
    return (
      this.request.cookies[cookie] !== undefined &&
      this.request.cookies[cookie] !== null
    );
  }
  setCookie(cookie, value, timeout = new Date()) {
    this.response.cookie(cookie, value, { expire: timeout });
  }
  getCookie(cookie) {
    return this.request.cookies[cookie];
  }
  checkOrSetCookie(cookie, value, timeout) {
    if (!this.hasCookie(cookie) || this.getCookie(cookie) !== value) {
      this.setCookie(cookie, value, timeout);
    }
  }
}

CookiesHandler.DefaultExpire = 1000 * 60 * 60 * 24;

function handleCookies(req, res, next) {
  res['cookieHandler'] = new CookiesHandler(req, res);
  next();
}

module.exports = {
  handleCookies,
  CookiesHandler,
};
