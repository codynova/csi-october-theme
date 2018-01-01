'use strict';

var app = angular.module('csiApp', ['ngRoute', 'ngAnimate']);

app.constant('WORK_LOAD_VALUES', { increment: 3, interval: 1000 });

app.run(['$rootScope', '$location',
    function ($rootScope, $location) {
        $rootScope.isActiveTab = function (path) {
            if ($location.path().substr(0, path.length) === path) {
                if (path === '/' && $location.path() === '/') return true;
                else if (path === '/') return false;
                else return true;
            }
        };
    }
]);

app.config(['$routeProvider', '$locationProvider', '$interpolateProvider',
    function ($routeProvider, $locationProvider, $interpolateProvider) {
        $locationProvider.html5Mode(true);
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
        $routeProvider
            .when('/', {
                templateUrl: 'gallery.html'
            })
            .when('/work/:workId', {
                templateUrl: 'work.html'
            })
            .when('/about', {
                templateUrl: 'about.html'
            })
            .when('/contact', {
                templateUrl: 'contact.html'
            })
            .when('/404', {
                templateUrl: '404.html'
            })
            .otherwise({
                redirectTo: '/404'
                // redirectTo: function (obj, requestedPath) {
                //     window.location.href = '/404';
                // }
            });
    }
]);

app.service('dataService', [
    '$http', '$interval', '$location', 'WORK_LOAD_VALUES',
    function ($http, $interval, $location, WORK_LOAD_VALUES) {
        this.fetchWork = function ($scope) {
            $http({
                method: 'GET',
                url: 'api/workitems',
                cache: true
            })
            .success(function (response) {
                $scope.workList = response.map(function(workItem) {
                    workItem.filters = workItem.filtertags.split(',');
                    return workItem;
                }).sort(function(a, b) {
                    return parseInt(b.order) - parseInt(a.order);
                });
                $scope.loadIncrement = WORK_LOAD_VALUES.increment;
                $interval(function () {
                    $scope.loadIncrement += WORK_LOAD_VALUES.increment;
                    if ($scope.loadIncrement >= $scope.workList.length) $interval.cancel();
                }, WORK_LOAD_VALUES.interval);
            })
            .catch(function (err) {
                console.warn('ERROR - dataService.fetchWork failed to retrieve WorkItem data from plugin', err);
                $location.path('/404');
            })
            .finally(function () {
                console.log('WorkItem plugin data loaded');
            });
        };
        this.fetchNav = function ($scope) {
            $http({
                method: 'GET',
                url: 'api/navigation',
                cache: true
            })
            .success(function (response) {
                $scope.navCategories = response;
            })
            .catch(function (err) {
                console.warn('ERROR dataService.fetchNav failed to retrieve Navigation data from plugin', err);
                $location.path('/404');
            })
            .finally(function () {
                console.log('Navigation plugin data loaded');
            });
        };
    }
]);

app.service('scrollService', [
    '$location', '$timeout',
    function($location, $timeout) {
        this.scrollToWork = function ($scope) {
            var scroll = function() {
                var topScrollPos = document.documentElement.scrollTop;
                var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                var scrollValue = viewportHeight - topScrollPos;
                window.scrollBy({ 
                    top: scrollValue,
                    left: 0, 
                    behavior: 'smooth' 
                });    
            }
            if ($location.path() === '/') {
                scroll();
            } else {
                $location.path('/');
                var eventScrollFn = $scope.$on('$routeChangeSuccess', function($event, next, current) { 
                    $timeout(function() {
                        scroll();
                    }, 700 );
                    eventScrollFn();
                });
            }

        }
    }
]);

app.service('mobileMenuService', function() {
    this.animateHamburger = function () {
        var menu = document.querySelector('.hamburger');
        var iconElements = document.querySelectorAll('.hamburger span');
        menu.addEventListener('click', function() {
            for (var i = 0; i < iconElements.length; i++) {
                if (iconElements[i].classList.contains('open')) iconElements[i].classList.remove('open');
                else iconElements[i].classList.add('open');
            }
        });
    }
});

app.controller('primaryController', [
    '$scope', '$document', '$location', '$routeParams', 'dataService', 'scrollService',
    function ($scope, $document, $location, $routeParams, dataService, scrollService) {
        
        // Navigation variables
        $scope.showNavCategories = true;
        $scope.filterQuery = '';
                
        // JSON data for work and navigation items
        dataService.fetchNav($scope);
        dataService.fetchWork($scope);
        
        $scope.selectedWork = null;
        
        // Function to open work detail view
        $scope.openWorkDetailPage = function(selectedWorkData) {
            $scope.selectedWork = selectedWorkData;
            $location.path('/'+selectedWorkData.pageurl);
        };
        
        $scope.closeWorkDetailPage = function() {
            $location.path('/');
            $scope.selectedWork = null;
        };
        
        $scope.scrollToWork = function() {
            scrollService.scrollToWork($scope);
        };
        
        // Dynamically load header intro content and animations
        // $document.ready(function () {
        //     mobileMenuService.animateHamburger();
        // });
    }
]);