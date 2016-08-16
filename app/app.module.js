/**
 * Created by a.gilmullin on 15.08.2016.
 */
'use strict';

// Define the `phonecatApp` module
var app = angular.module('scopusInnopolisApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap'
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
    controller: function ScPublicationsCollectionController() {
        this.$onInit = function () {
            this.orderProp = 'citations';
            this.totalItems = 100;
            this.numPerPage = 5;
            this.currentPage = 6;
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

        this.pageChanged = function() {
            var begin = ((this.currentPage - 1) * this.numPerPage)
                , end = begin + this.numPerPage;
            this.filteredPublications = this.publications.slice(begin, end);
        };

        this.reorderBy = function(field) {
            this.orderProp = field;
            this.publications = orderBy(this.publications, this.orderProp, true);
            this.pageChanged();
        };
    }
}).component('app', {
    templateUrl: 'components/app.html'
});
