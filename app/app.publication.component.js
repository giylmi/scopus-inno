/**
 * Created by a.gilmullin on 16.08.2016.
 */
(function (app) {
    app.AppPublicationComponent =
        ng.core.Component({
            selector: 'sc-publication',
            templateUrl: '../components/publication.html'
        })
            .Class({
                constructor: function () {
                }
            });
})(window.app || (window.app = {}));