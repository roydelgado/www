var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require('mime'),
    port = 80,
    __appdir = '/var/www';

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = __appdir + path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.setHeader("Content-Type", mime.lookup(filename));
      response.writeHead(200);
      response.write(file, 'binary');
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://roydelgado.com:" + port );
