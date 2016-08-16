/**
 * Created by a.gilmullin on 12.08.2016.
 */
(function (app) {
    app.AppComponent =
        ng.core.Component({
            selector: 'sc-app',
            templateUrl: '../components/app.html',
            entryComponents: [app.AppAuthorComponent,
                app.AppAuthorsCollectionComponent,
                app.AppPublicationComponent,
                app.AppPublicationCollectionComponent,
            ]
        })
            .Class({
                constructor: function () {
                }
            });
})(window.app || (window.app = {}));