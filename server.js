var handler = function(req, res) {

    var request = url.parse(req.url, true);
    var action = request.pathname;
     
    if (action == '/getUserMedia.js') {
        var img = fs.readFileSync('./getUserMedia.js');
        res.writeHead(200, {'Content-Type': 'text/javascript' });
        res.end(img, 'binary');
    }
    else if (action == '/dataConnection.js') {
        var img = fs.readFileSync('./dataConnection.js');
        res.writeHead(200, {'Content-Type': 'text/javascript' });
        res.end(img, 'binary');
    }
    else if (action == '/jquery.js') {
        var img = fs.readFileSync('./jquery.js');
        res.writeHead(200, {'Content-Type': 'text/javascript' });
        res.end(img, 'binary');
    }
    else if (action == '/wb1.js') {
        var img = fs.readFileSync('./wb1.js');
        res.writeHead(200, {'Content-Type': 'text/javascript' });
        res.end(img, 'binary');
    }
    else if (action == '/wb.css') {
        var img = fs.readFileSync('./wb.css');
        res.writeHead(200, {'Content-Type': 'text/css' });
        res.end(img, 'binary');
    }
    else { 
        fs.readFile('./wb.html', function (err, data) {
            if(err){
                throw err;
            }
            res.writeHead(200);
            res.end(data);
        });    
    }
}

var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io').listen(app);

var port = process.env.PORT || 3000;
 
app.listen(port);

io.sockets.on('connection', function (socket) {

    socket.on("move", function(mousePos){
        io.sockets.emit('draw', mousePos);
    });

});