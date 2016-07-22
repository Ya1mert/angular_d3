import d3_ from 'd3';

class D3Factory {
    constructor($document, $window, $q, $rootScope) {
        return $q(function (resolve, reject) {
            if ($window.d3) {
                resolve($window.d3);
            } else {
                reject('Error!');
            }
        });
    }

    static createInstance($document, $window, $q, $rootScope) {
        return new D3Factory($document, $window, $q, $rootScope);
    }
}

D3Factory.createInstance.$inject = ['$document', '$window', '$q', '$rootScope'];

export default D3Factory.createInstance;
