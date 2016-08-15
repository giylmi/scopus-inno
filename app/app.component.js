/**
 * Created by a.gilmullin on 12.08.2016.
 */
(function(app) {
    app.AppComponent =
        ng.core.Component({
            selector: 'my-app',
            template: '<h1>My Lol Angular 2 App</h1>'
        })
            .Class({
                constructor: function() {}
            });
})(window.app || (window.app = {}));