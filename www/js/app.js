'use strict';

/* App Module */
var mediaApp = angular.module('mediaApp', ['ionic','ngResource','wu.masonry','firebase'])

mediaApp.constant('config', {
  host: 'http://morefunin.ph'
})

mediaApp.filter('thumb', function(config) {
  return function(src, size) {
    return config.host + '/' + src.replace('uploads/', 'thumbs/' + size + 'x' + size + '/')};
})

mediaApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "menu.html"

        })
        .state('menu.home', {
            url: "/home",
            views: {
                'menuContent' :{
                    templateUrl: "views/home.html",
                    controller: "HomeCtrl"
                }
            }
        })
        .state('menu.search', {
            url: "/search",
            views: {
                'menuContent' :{
                    templateUrl: "views/search.html",
                    controller: "SearchCtrl"
                }
            }
        })

        .state('menu.settings', {
            url: "/settings",
            views: {
                'menuContent' :{
                    templateUrl: "views/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        })
        .state('menu.mine', {
            url: "/mine",
            views: {
                'menuContent' :{
                    templateUrl: "views/mine.html",
                    controller: "SettingsCtrl"
                }
            }
        })
        .state('menu.gallery', {
            url: "/gallery",
            views: {
                'menuContent' :{
                    templateUrl: "views/gallery.html",
                    controller: "GalleryCtrl"
                }
            }
        })

        .state('menu.about', {
            url: "/about",
            views: {
                'menuContent' :{
                    templateUrl: "views/about.html",
                    controller: "AboutCtrl"
                }
            }
        });

    $urlRouterProvider.otherwise("/menu/home");
})