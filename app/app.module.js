/**
 * Created by a.gilmullin on 15.08.2016.
 */
'use strict';

// Define the `phonecatApp` module
var app = angular.module('scopusInnopolisApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'LocalStorageModule'
]).component('scAuthor', {
    templateUrl: 'components/author.html'
}).component('scAuthorsCollection', {
    templateUrl: 'components/authors-collection.html'
}).component('scPublication', {
    templateUrl: 'components/publication.html',
    bindings: {
        pub: '<'
    }
}).component('scPublicationsCollection', {
    templateUrl: 'components/publications-collection.html',
    controller: function ScPublicationsCollectionController($filter) {
        this.$onInit = function () {
            this.orderProp = 'citations';
            this.totalItems = 100;
            this.itemsPerPage = 5;
            this.publications = [];
            for (var i = 0; i < 100; i++) {
                this.publications.push({
                    name: 'Innopolis',
                    type: 'Conference Paper',
                    authors: 'Kondratyev, D.a, Tormasov, A.a, Stanko, T.a, Jones, R.C.b, Taran, G.c',
                    citations: i + 1,
                    lastCited: 1
                });
            }

            this.reorderBy(this.orderProp);
            // this.publications = [
            //     {
            //         name: 'Innopolis',
            //         type: 'Conference Paper',
            //         authors: 'Kondratyev, D.a, Tormasov, A.a, Stanko, T.a, Jones, R.C.b, Taran, G.c',
            //         citations: 10,
            //         lastCited: 1
            //     },
            //     {
            //         name: 'Univercity',
            //         type: 'Conference Paper',
            //         authors: 'Kondratyev, D.a, Tormasov',
            //         citations: 5,
            //         lastCited: 2
            //     },
            //     {
            //         name: 'IT',
            //         type: 'Conference Paper',
            //         authors: 'Stanko, T.a, Jones, R.C.b, Taran, G.c',
            //         citations: 6,
            //         lastCited: 0
            //     },
            // ];
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
    controller: function ($http, localStorageService) {
        var $ctrl = this;
        this.author = {};
        this.scAuthor = null;

        if (localStorageService.isSupported) {
            $ctrl.authors = localStorageService.get('authors') || {};
        }

        this.onIdUpdate = function () {
            $http(
                {
                    method: 'get',
                    url: 'http://api.elsevier.com/content/author/author_id/' + $ctrl.author.id,
                    params: {apiKey: '6476ffc5bf77cddd275cc28a3c71b2fe', 'self-citation': 'include', 'view' : 'ENHANCED'}
                })
                .then(function (response) {
                        var result = eval(response.data);
                        var scAuthors = result['author-retrieval-response'];
                        if (scAuthors && scAuthors.length > 0) {
                            var scAuthor = scAuthors[0];
                            var preferredName = scAuthor['author-profile']['preferred-name'];
                            $ctrl.scAuthor = {
                                name: preferredName['given-name'] + ' ' + preferredName['surname']
                            };
                            console.log(scAuthor);
                            console.log($ctrl.scAuthor);
                        } else {
                            $ctrl.scAuthor = null;
                        }
                    }
                );
        }
        ;
        this.save = function () {
            if (localStorageService.isSupported && ($ctrl.scAuthor)) {
                if ($ctrl.scAuthor) {
                    $ctrl.scAuthor.photo = $ctrl.author.photo;
                    $ctrl.authors[$ctrl.author.id] = $ctrl.scAuthor;
                }
                localStorageService.set('authors', $ctrl.authors);
                console.log($ctrl.authors);
                $ctrl.scAuthor = null;
            }
        };
    }
}).component('app', {
    templateUrl: 'components/app.html'
});
