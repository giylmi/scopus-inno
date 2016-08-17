'use strict';

angular.module('scopusInnopolisApp').config(['$locationProvider', '$routeProvider', 'localStorageServiceProvider',
    function config($locationProvider, $routeProvider, localStorageServiceProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            template: '<app></app>'
        }).when('/add', {
            template: '<sc-author-form></sc-author-form>'
        }).otherwise('/');

        localStorageServiceProvider.setPrefix('scInnopolisApp');
        localStorageServiceProvider.setStorageCookie(0, '/');
    }
]);
