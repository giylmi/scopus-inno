/**
 * Created by a.gilmullin on 19.08.2016.
 */
'use strict'

angular.module('scopus', ['constants']).factory('$scopus', ['$http', '$constants', function ($http, $constants) {
    var apiKey = $constants.apiKey;
    var affilId = $constants.affilId;

    return {
        getAuthor: function (id) {
            return new Promise((resolve, reject) => {
                $http({
                        method: 'get',
                        url: 'http://api.elsevier.com/content/author/author_id/' + id,
                        params: {apiKey: apiKey, view: 'ENHANCED'}
                    })
                    .success(function (response) {
                        var result = eval(response);
                        var scAuthors = result['author-retrieval-response'];
                        if (scAuthors && scAuthors.length > 0) {
                            var scAuthor = scAuthors[0];
                            var preferredName = scAuthor['author-profile']['preferred-name'];
                            var author = {
                                id: id,
                                documents: []
                            };
                            author.name = preferredName['given-name'] + ' ' + preferredName['surname'];

                            console.log(scAuthor);
                            console.log(author);

                            $http({
                                method: 'get',
                                url: 'http://api.elsevier.com/content/search/scopus',
                                params: {
                                    apiKey: "6476ffc5bf77cddd275cc28a3c71b2fe",
                                    query: 'au-id(' + id + ')',
                                    view: 'COMPLETE'
                                }
                            }).success(function (response) {
                                var result = eval(response);
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
                            }).error(function (response) {
                                resolve(author);
                            });
                        } else {
                            reject();
                        }
                    }).error(function (response) {
                        reject();
                    });
            });
        },
        getAllIUAuthors: function () {
            return new Promise((resolve, reject) => {
                $http({
                    method: 'get',
                    url: 'http://api.elsevier.com/content/search/author',
                    params: {
                        apiKey: apiKey,
                        query: 'af-id(' + affilId + ')'
                    }
                }).success(function (data) {
                    var result = eval(data);
                    var authors = [];
                    result['search-results']['entry'].forEach(function (item) {
                        authors.push({
                            id: item['dc:identifier'].split(':')[1],
                            name: item['preferred-name']['given-name'] + ' ' + item['preferred-name']['surname']
                        });
                    });
                    resolve(authors);
                }).error(function () {
                    reject();
                });
            });
        }
    }
}]);