// @ts-check
const jsonServer = require('json-server');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function SINGULAR_MIDDLEWARE(req, res, next) {
  const _send = res.send;
  res.send = function (body) {
    if (req.url.indexOf('singular') >= 0) {
      try {
        const json = JSON.parse(body);
        if (Array.isArray(json)) {
          if (json.length === 1) {
            return _send.call(this, JSON.stringify(json[0]));
          } else if (json.length === 0) {
            return _send.call(this, '{}', 404);
          }
        }
      } catch (e) {
        throw new Error('Problem unwrapping array');
      }
    }
    return _send.call(this, body);
  };
  next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
function addDateToPost(req, _res, next) {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
}

function setupAPI(server) {
  server.use('/api', SINGULAR_MIDDLEWARE, ...middlewares);
  server.use(jsonServer.bodyParser);

  server.use(addDateToPost);
  server.use(
    jsonServer.rewriter({
      '/api/teams': '/api/teams?_embed=channels',
      '/api/teams/:id': '/api/teams/:id?_embed=channels',
      '/api/teams/:id/channels': '/api/channels?teamId=:id',
      '/api/teams/:id/channels/:channelId':
        '/api/channels?id=:channelId&teamId=:id&singular=1',
      '/api/teams/:id/channels/:channelId/messages':
        '/api/messages?_expand=user&teamId=:id&channelId=:channelId',
    }),
  );

  server.use('/api', router);
  return server;
}

module.exports = { setupAPI };
