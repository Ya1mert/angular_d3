import 'bootstrap/dist/css/bootstrap.css';

import { angular as ng } from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-bootstrap';

import uiValidate from 'angular-ui-validate';

import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngCookies from 'angular-cookies';

import rootTemplate from './views/root.jade';

import Register from './register.js';

angular
    .module('app',
        ['ui.router',
        'ui.bootstrap',
        'ui.validate',
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngCookies'])
    .config(['$locationProvider', '$urlRouterProvider', '$stateProvider',
        ($locationProvider, $urlRouterProvider, $stateProvider) => {
          //$locationProvider.hashPrefix('!').html5Mode(true);

          $stateProvider
            .state('root', {
              url: '/',
              template: rootTemplate,
              controller: 'root.controller'
            });

          $urlRouterProvider.otherwise('/');
        }
    ])
    .run(['$rootScope',
      ($rootScope) => { }
    ]);

Register();
