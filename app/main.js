/**
 * Created by a.gilmullin on 15.08.2016.
 */
(function(app) {
    document.addEventListener('DOMContentLoaded', function() {
        ng.platformBrowserDynamic
            .platformBrowserDynamic()
            .bootstrapModule(app.AppModule);
    });
})(window.app || (window.app = {}));