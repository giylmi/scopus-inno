/**
 * Created by a.gilmullin on 19.08.2016.
 */
'use strict'

angular.module('scopus', ['constants']).factory('$scopus', ['$http', '$constants', '$q', function ($http, $constants, $q) {
    return {
        getAuthor: function (id) {
            return $q((resolve, reject) => {
                $http({
                    method: 'get',
                    url: 'api/author/' + id
                }).success(function (response) {
                    var author = eval(response);
                    resolve(author);
                }).error(function (response) {
                    reject();
                });
            });
        },
        getAllIUAuthors: function () {
            return $q((resolve, reject) => {
                $http({
                    method: 'get',
                    url: 'api/iuauthors'
                }).success(function (data) {
                    var authors = eval(data);
                    resolve(authors);
                }).error(function () {
                    reject();
                });
            });
        },
        updateAuthor: function (id, author) {
            return $q((resolve, reject) => {
                $http({
                    method: 'post',
                    url: 'api/author/' + id,
                    data: author,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (response) {
                    resolve();
                }).error(function (response) {
                    reject();
                });
            });
        }
    }
}]);