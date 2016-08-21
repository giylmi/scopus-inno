/**
 * Created by a.gilmullin on 21.08.2016.
 */
var express = require('express'),
    app = express();

var log4js = require('log4js');
var logger = log4js.getLogger();

var scopus = require('./scopus');
var authors_base = scopus.getAllIUAuthorsFullInformation()

var client_dir = '../client';

var api = express();

api.get('/author/:id', function (req, resp) {
    scopus.getAuthor(req.params.id)
        .then(
            function success(author) {
                resp.status(200).send(author);
            },
            function error() {
                resp.status(502).send();
            }
        );
});

api.get('/iuauthors', function (req, resp) {
    logger.debug('get iuauthors');
    scopus.getAllIUAuthors()
        .then(
            function success(authors) {
                resp.status(200).send(authors);
            },
            function error() {
                resp.status(502).send();
            }
        );
});

app.use('/', express.static(client_dir));
app.use('/api', api);

app.listen(8080);