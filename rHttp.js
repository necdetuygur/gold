module.exports = {
    "Start": Start,
    "SetMsg": (a) => { msg = a; },
    "PageCalled": (a) => { called = a; }
};
let http = require('http');
let msg = '';
let called = (req, res) => {};
function Start(){
    let hostname = process.env.IP || '0.0.0.0';
    let port = process.env.PORT || 6010;
    let server = http.createServer((req, res) => {
        called(req, res);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"><pre>' + msg + '</pre>');
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}