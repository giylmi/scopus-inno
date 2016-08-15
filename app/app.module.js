/**
 * Created by a.gilmullin on 15.08.2016.
 */
(function(app) {
    app.AppModule =
        ng.core.NgModule({
            imports: [ ng.platformBrowser.BrowserModule ],
            declarations: [ app.AppAuthorComponent, app.AppAuthorsCollectionComponent,  ],
            bootstrap: [ app.AppAuthorsCollectionComponent ]
        })
            .Class({
                constructor: function() {}
            });
})(window.app || (window.app = {}));