/**
 * Created by a.gilmullin on 15.08.2016.
 */
(function (app) {
    app.AppAuthorComponent =
        ng.core.Component({
            selector: 'sc-author',
            templateUrl: '../components/author.html'
        })
            .Class({
                constructor: function () {
                }
            });
})(window.app || (window.app = {}));
