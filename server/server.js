/**
 * Created by a.gilmullin on 21.08.2016.
 */
var express = require('express'),
    app = express();

var process = require('process');

var log4js = require('log4js');
var logger = log4js.getLogger();

var config = require('./config');

var scopus = require('./scopus');
var bodyParser = require('body-parser');

var fs = require('fs');
var authorsMap = {};
var time = null;

try {
    logger.info('reading scopus backup');
    var parse = JSON.parse(fs.readFileSync(config.dbFile, 'utf8'));
    authorsMap = parse.authorsMap;
    time = parse.time;
    logger.info('scopus backup has been read');
} catch (ex) {
    logger.info('scopus backup read failed');
}

if (!time || (time + (config.syncInterval * 60 * 1000)) < Date.now()) {
    logger.info('retrieving initial scopus information');
    scopus.getAllIUAuthorsFullInformation().then(
        function (authors) {
            logger.info('initial scopus information retrieved');
            authors.forEach(function (item) {
                for (var attr in item) {
                    if (item.hasOwnProperty(attr)) {
                        if (!authorsMap[item.id])
                            authorsMap[item.id] = {};
                        authorsMap[item.id][attr] = item[attr];
                    }
                }
            });
            backup();
            setInterval(backup, config.backupInterval * 60 * 1000);
            setInterval(syncScopus, config.syncInterval * 60 * 1000);

            start();
        },
        function () {
            logger.error('error occurred trying to get scopus information');
        }
    );
} else {
    logger.info('backup is new enough to start without sync');
    setInterval(backup, config.backupInterval * 60 * 1000);
    setInterval(syncScopus, config.syncInterval * 60 * 1000);

    start();
}


function backup(callback) {
    logger.info('backup started');
    var backup = {
        authorsMap: authorsMap,
        time: Date.now()
    };
    var data = JSON.stringify(backup);
    fs.writeFile(config.dbFile, data, function () {
        logger.info('backup finished');
        if (callback)
            callback();
    });
}

function start() {
    var client_dir = '../client';

    var api = express();

    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({extended: true}));

    api.all('*', function (req, resp, next) {
        logger.info(req.method + ' ' + req.originalUrl + ' ' + req.protocol);
        next();
    });

    api.get('/author/:id', function (req, resp) {
        if (authorsMap[req.params.id]) {
            resp.status(200).send(authorsMap[req.params.id]);
        }
        else {
            resp.status(404).send();
        }
    });

    // update author information
    api.post('/author/:id', function (req, resp) {
        var author = req.body;
        if (author.id && author.id == req.params.id && authorsMap[author.id]) {
            logger.debug('saving author information, ' + JSON.stringify(author));
            for (var attr in author)
                if (author.hasOwnProperty(attr))
                    authorsMap[author.id][attr] = author[attr];
            resp.status(200).send();
        } else {
            resp.status(404).send();
        }
    });

    api.get('/iuauthors', function (req, resp) {
        resp.status(200).send(authorsMap);
    });

    app.use('/', express.static(client_dir));
    app.use('/api', api);

    app.listen(config.port);

    logger.info("Server is listening on port " + config.port);

    if (process.platform === "win32") {
        var rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
    }

    process.on("SIGINT", function () {
        logger.info('caught abort signal, doing backup');
        backup(function () {
            process.exit();
        });
    });
}

function syncScopus() {
    logger.info('retrieving scopus information');
    scopus.getAllIUAuthorsFullInformation().then(
        function (authors) {
            logger.info('scopus information retrieved');
            authors.forEach(function (item) {
                for (var attr in item) {
                    if (item.hasOwnProperty(attr)) {
                        if (!authorsMap[item.id])
                            authorsMap[item.id] = {};
                        authorsMap[item.id][attr] = item[attr];
                    }
                }
            });
        },
        function () {
            logger.error('error occurred trying to get scopus information');
        }
    );
}
