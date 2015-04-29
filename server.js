var http    = require('http'),
    url     = require('url'),
    path    = require('path'),
    fs      = require('fs');
		
var	defaults = {
	port: 4001,
	index: 'index.html',
	root: 'public',
	noCache: true,
	contentTypeDef: {
		'Content-Type' : 'text/plain' 
	},
	contentType : {
		html    : 'text/html',
		css     : 'text/css',
		js      : 'text/javascript',
		json    : 'application/json',
		txt     : 'text/plain',
		jpeg    : 'image/jpeg',
		jpg     : 'image/jpeg',
		png     : 'image/png',
		gif     : 'image/gif',
		ico     : 'image/x-icon',
		appcache: 'text/cache-manifest'
	},
	errors: {
		404: 'Not Found',
		415: 'Unsupported Media Type',
		500: 'Internal Server Error '
	}
}, server = http.createServer(
	requestReceived
);

function requestReceived(request, response) {
	var uri = url.parse(request.url), hostname = [];
	uri = uri.pathname, root = defaults.root;
	
	if (uri === '/')
		uri = '/' + defaults.index;		

	var filename = path.join(
		root,
		uri
	);

	fs.exists(filename, function (exists){
		serveFile(filename, exists, response);
	});
};

function alterResponse(response, body, status, headers, encoding) {
	if (!status)
		status = 200;

	if (!headers)
		headers = defaults.contentTypeDef;
	
	if(!encoding)
		encoding='utf8';

	response.writeHead(
		status,
		headers
	);
	response.write(body, encoding);
	response.end();
	return;
}

function serveFile(filename, exists, response) {
	
	var contentType = path.extname(filename).slice(1);

	if (!exists) {
		alterResponse(response, defaults.errors['404'], 404, defaults.contentTypeDef);
		return;
	}
	
	if (!defaults.contentType[contentType]) {
		alterResponse(response, defaults.errors['415'], 415, defaults.contentTypeDef);
		return;
	}

	fs.readFile(
		filename,
		'binary',
		function(err, file) {
			if (err) {
				alterResponse(response, defaults.errors['500'] + err, 500, defaults.contentTypeDef);
				return;
			}

			var headers = {
				'Content-Type' : defaults.contentType[contentType]
			};

			if (defaults.noCache)
				headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';

			alterResponse(response, file, 200, headers, 'binary');

			return;
		}
	);
}

server.listen(defaults.port, function() {
		console.log('### UI Server listening on port ' + defaults.port + ' ###\n');       
	}
);

