import RootController from './controllers/root.controller.js';

import D3Factory from './factories/d3Factory.js';

import GridSystem from './directives/gridSystem.directive.js';
//import CustomShape from './directives/customShape.directive.js';
//import CustomRectangle from './directives/customRectangle.directive.js';

export default function Register() {
    angular
        .module('app')
        .factory('d3Factory', D3Factory)
        .controller('root.controller', RootController)
        .directive('gridSystem', GridSystem);
        //.directive('customShape', CustomShape)
        //.directive('customRectangle', CustomRectangle);
}
