/**
 * Created by a.gilmullin on 16.08.2016.
 */
(function (app) {
    app.AppPublicationCollectionComponent =
        ng.core.Component({
            selector: 'sc-publications-collection',
            templateUrl: '../components/publications-collection.html'
        })
            .Class({
                constructor: function () {
                }
            });
})(window.app || (window.app = {}));
