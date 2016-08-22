/**
 * Created by a.gilmullin on 15.08.2016.
 */
'use strict';

// Define the `phonecatApp` module
var app = angular.module('scopusInnopolisApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'LocalStorageModule',
    'constants',
    'scopus'
]).component('scAuthorLink', {
    templateUrl: 'components/author-link.html',
    bindings: {
        author: '<',
        isInno: "="
    }
}).component('scAuthor', {
    templateUrl: 'components/author.html',
    bindings: {
        author: '<'
    }
}).component('scAuthorsCollection', {
    templateUrl: 'components/authors-collection.html',
    controller: function () {
        var $ctrl = this;
        // $ctrl.authors =
    }
}).component('scPublication', {
    templateUrl: 'components/publication.html',
    bindings: {
        pub: '<'
    }
}).component('scPublicationsCollection', {
    templateUrl: 'components/publications-collection.html',
    controller: function ScPublicationsCollectionController($filter, localStorageService, $scopus) {
        var $ctrl = this;
        this.$onInit = function () {
            this.orderProp = 'cited';
            this.totalItems = 100;
            this.itemsPerPage = 5;
            this.publications = [];

            this.authors = {};
            if (localStorageService.isSupported) {
                this.authors = localStorageService.get('authors') || {};
                for (var id in this.authors) {
                    var pubs = this.authors[id].documents;
                    if (pubs && pubs.length) {
                        pubs.forEach(function (item) {
                            $ctrl.publications.push(item);
                        });
                    }
                }
            }
            $scopus.getAllIUAuthors().then(
                function (authors) {
                    for (var key in authors) {
                        var item = authors[key];
                        $ctrl.authors[item.id] = $ctrl.authors[item.id] || {};
                        for (var attrname in item) {
                            if (item.hasOwnProperty(attrname))
                                $ctrl.authors[item.id][attrname] = item[attrname];
                        }
                    }

                    localStorageService.set('authors', $ctrl.authors);
                    for (var id in $ctrl.authors) {
                        var pubs = $ctrl.authors[id].documents;
                        if (pubs && pubs.length) {
                            pubs.forEach(function (item) {
                                $ctrl.publications.push(item);
                            });
                        }
                    }
                }
            );

            // for (var i = 0; i < 100; i++) {
            //     this.publications.push({
            //         name: 'Innopolis',
            //         type: 'Conference Paper',
            //         authors: 'Kondratyev, D.a, Tormasov, A.a, Stanko, T.a, Jones, R.C.b, Taran, G.c',
            //         citations: i + 1,
            //     });
            // }

            this.reorderBy(this.orderProp);
        };

        this.setPage = function (pageNo) {
            this.currentPage = pageNo;
        };

        this.pageChanged = function () {
            var begin = ((this.currentPage - 1) * this.itemsPerPage)
                , end = begin + this.itemsPerPage;
            this.filteredPublications = this.publications.slice(begin, end);
        };

        this.reorderBy = function (field) {
            this.orderProp = field;
            this.publications = $filter('orderBy')(this.publications, this.orderProp, true);
            this.setPage(1);
            this.pageChanged();
        };
    }
}).component('scAuthorForm', {
    templateUrl: 'components/author-form.html',
    controller: function (localStorageService, $scopus) {

        var $ctrl = this;
        this.$onInit = function () {
            this.author = {};
            this.preview = null;
            this.authors = {};

            if (localStorageService.isSupported) {
                $ctrl.authors = localStorageService.get('authors') || {};
            }
            $scopus.getAllIUAuthors().then(
                function (authors) {
                    for (var key in authors) {
                        var item = authors[key];
                        $ctrl.authors[item.id] = $ctrl.authors[item.id] || {};
                        for (var attrname in item) {
                            if (item.hasOwnProperty(attrname))
                                $ctrl.authors[item.id][attrname] = item[attrname];
                        }
                    }

                    localStorageService.set('authors', $ctrl.authors);
                }
            );
        };

        function updateAuthor(oldA, newA) {
            for (var attrname in newA) {
                if (newA.hasOwnProperty(attrname))
                    oldA[attrname] = newA[attrname];
            }
        }

        this.getCitations = function (author) {
            var result = 0;
            if (author.documents)
                author.documents.forEach(function (item) {
                    if (item.cited)
                        result += parseInt(item.cited);
                });
            return result;
        };

        this.onIdUpdate = function () {
            $ctrl.preview = null;
            $ctrl.scopusLoading = true;
            $scopus.getAuthor($ctrl.author.id).then(
                function success(author) {
                    // create if not exists
                    $ctrl.authors[$ctrl.author.id] = $ctrl.authors[$ctrl.author.id] || {};
                    updateAuthor($ctrl.authors[$ctrl.author.id], author);

                    if (localStorageService.isSupported) {
                        localStorageService.set('authors', $ctrl.authors);
                    }
                    $ctrl.scopusLoading = false;
                    $ctrl.preview = $ctrl.authors[$ctrl.author.id];
                },
                function fail() {
                    $ctrl.preview = null;
                    $ctrl.scopusLoading = false;
                }
            );
        };
        this.save = function () {
            $ctrl.authors[$ctrl.author.id].photo = $ctrl.author.photo;
            // todo: add handlers
            $scopus.updateAuthor($ctrl.author.id, {
                id: $ctrl.author.id,
                photo: $ctrl.authors[$ctrl.author.id].photo
            });
            if (localStorageService.isSupported && ($ctrl.preview)) {
                if (localStorageService.isSupported) {
                    localStorageService.set('authors', $ctrl.authors);
                }
            }
            $ctrl.preview = null;
            $ctrl.author = null;
        };
    }
}).component('app', {
    templateUrl: 'components/app.html'
});
