const appdata = [{ complete: "false", content: "Love my cat!" }];

const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library used in the following line of code
    mime = require("mime"),
    dir = "public",
    port = 3000;

const server = http.createServer(function (request, response) {
  switch( request.url ) {
    case '/':
      sendFile( response, 'index.html' )
      break
    case '/index.html':
      sendFile( response, 'index.html' )
      break
    case '/style.css':
      sendFile( response, 'css/style.css' )
      break
    case '/script.js':
      sendFile( response, 'js/script.js' )
      break
    default:
      response.end( '404 Error: File Not Found' )
  }

  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  if (request.url === "/submit") {
    request.on("end", function () {
      console.log(JSON.parse(dataString).DOB);
      let data1 = JSON.parse(dataString);
      // state = data1.complete,
      // inputs = data1.content;

      console.log(data1);
      // appdata.push(data1);

      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.write(JSON.stringify(appdata));
      console.log(appdata);
      response.end();
    });
  } else if (request.url === "/delete") {
    request.on("end", function () {
      let data2 = JSON.parse(dataString);
      // state = data2.complete,
      // inputs = data2.content;

      console.log(data2);
      // appdata.remove(inputs);

      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.write(JSON.stringify(appdata));
      console.log(appdata);
      response.end();
    });
  }
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
