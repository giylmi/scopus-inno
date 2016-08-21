/**
 * Created by a.gilmullin on 21.08.2016.
 */
var config = require('./config');
var request = require('request');

var log4js = require('log4js');
var logger = log4js.getLogger();

var scopusRequest = request.defaults({
    baseUrl: "http://api.elsevier.com/",
    headers: {
        "X-ELS-APIKey": config.apiKey,
        "Accept": "application/json"
    }
});

var allIUAuthors = function () {
    return new Promise((resolve, reject) => {
        logger.debug('getAllIUAuthors');
        scopusRequest.get({
            method: 'get',
            uri: 'content/search/author',
            qs: {
                query: encodeURI('af-id(' + config.affilId + ')')
            }
        }, function (error, response, data) {
            logger.debug(response.statusCode
                + ' ' + response.statusMessage + '\n' + response.rawHeaders);
            if (response.statusCode == 200) {
                var result = JSON.parse(data);
                var authors = [];
                result['search-results']['entry'].forEach(function (item) {
                    authors.push({
                        id: item['dc:identifier'].split(':')[1],
                        name: item['preferred-name']['given-name'] + ' ' + item['preferred-name']['surname']
                    });
                });
                resolve(authors);
            }
            else {
                logger.error('failed to load iu authors, ' + response.statusCode
                    + ' ' + response.statusMessage);
                reject();
            }
        });
    });
};
var author = function (id) {
    return new Promise((resolve, reject) => {
        scopusRequest({
            uri: 'content/author/author_id/' + id,
            qs: {view: 'ENHANCED'}
        }, function (error, response, body) {
            logger.debug(response.statusCode
                + ' ' + response.statusMessage + '\n' + response.rawHeaders);
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                var scAuthors = result['author-retrieval-response'];
                if (scAuthors && scAuthors.length > 0) {
                    var scAuthor = scAuthors[0];
                    var preferredName = scAuthor['author-profile']['preferred-name'];
                    var author = {
                        id: id,
                        documents: []
                    };
                    author.name = preferredName['given-name'] + ' ' + preferredName['surname'];

                    scopusRequest({
                        url: 'content/search/scopus',
                        params: {
                            query: encodeURI('au-id(' + id + ')'),
                            view: 'COMPLETE'
                        }
                    }, function (error, response, body) {
                        logger.debug(response.statusCode
                            + ' ' + response.statusMessage + '\n' + response.rawHeaders);
                        if (response.statusCode == 200) {
                            var result = JSON.parse(body);
                            var pubs = result['search-results']['entry'];
                            if (pubs && pubs.length > 0) {
                                pubs.forEach(function (item, i, arr) {
                                    author.documents.push({
                                        eid: item.eid,
                                        title: item['dc:title'],
                                        description: item['dc:description'],
                                        cited: item['cited-by-count'],
                                        date: item['prism:coverDate'],
                                        authors: item['author'].map(function (item, i, arr) {
                                            return {
                                                id: item.authid,
                                                name: item['given-name'] + ' ' + item.surname
                                            }
                                        })
                                    });
                                });
                            }
                            resolve(author);
                        }
                        else {
                            logger.error('failed to get documents by author(' + id + '), ' + response.statusCode
                                + ' ' + response.statusMessage);
                            resolve(author);
                        }
                    });
                } else {
                    reject();
                }
            }
            else {
                logger.error('failed to get author(' + id + '), ' + response.statusCode
                    + ' ' + response.statusMessage);
                reject();
            }
        });
    });
};
module.exports = {
    getAuthor: author,
    getAllIUAuthors: allIUAuthors,
    getAllIUAuthorsFullInformation: function () {
        return new Promise(resolve, reject => {
            allIUAuthors().then(
                function (authors) {
                    authors.forEach(function (item) {
                        author(item.id).then(
                            function (author) {
                                for (var attr in author)
                                    if (author.hasOwnProperty(attr))
                                        item[attr] = author[attr];
                            },
                            reject
                        );
                    });
                },
                reject
            );
        });
    }
};