/**
 * Created by a.gilmullin on 19.08.2016.
 */
angular.module('scopusInnopolisApp').filter('orderMapValuesBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for(var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function(a, b){
            if(a[attribute] < b[attribute]) return -1;
            if(a[attribute] > b[attribute]) return 1;
            return 0;
        });
        return array;
    }
});