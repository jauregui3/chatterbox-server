var urlParser = require('url');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var responseResults = {
  results: []
};
var objectIdCounter = 1;

var requestHandler = function(request, response) {
  var statusCode;
  var url = urlParser.parse(request.url).pathname;

  if (request.method === 'POST') {
    statusCode = 201;

    request.on('data', function(chunk) {
      var message = JSON.parse(chunk.toString());
      message.objectId = ++objectIdCounter;
      responseResults.results.push(message);
    });
    request.on('end', function() {
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(responseResults));
    });
  } else if (request.method === 'GET' && url === '/classes/messages' ) {
    statusCode = 200;

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(responseResults));
  } else if (request.method === 'OPTIONS' && url === '/classes/messages') {
    statusCode = 201;

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(null));
  } else {
    statusCode = 404;

    response.writeHead(statusCode, headers);
    response.end();
  }

};

module.exports.requestHandler = requestHandler;