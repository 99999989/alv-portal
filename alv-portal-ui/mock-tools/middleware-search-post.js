/**
 * json-server can't use POST for the search requests, so we convert them to GET
 * @param req {Request}
 * @param res {Response}
 * @param next
 *
 */
module.exports = function replacePostByGetForSearchRequests(req, res, next) {
  console.log(req.url);
  if (req.method === 'POST' && req.url.startsWith('/_search')) {
    console.log('converting POST to GET');
    req.method = 'GET';
    req.query = req.body;
  }
  next();
};
