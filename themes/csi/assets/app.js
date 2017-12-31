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

app.service('scrollService', function() {
   this.smoothScroll = function (destination) {
       var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
       var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
       var callback = arguments[3];
       var easings = {
           linear: function linear(t) {
               return t;
           },
           easeInCubic: function easeInCubic(t) {
               return t * t * t;
           },
           easeOutCubic: function easeOutCubic(t) {
               return --t * t * t + 1;
           },
           easeInOutCubic: function easeInOutCubic(t) {
               return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
           }
       };
       var start = window.pageYOffset;
       var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
       var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
       var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
       var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
       var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
       if ('requestAnimationFrame' in window === false) {
           window.scroll(0, destinationOffsetToScroll);
           if (callback) {
               callback();
           }
           return;
       }
       function scroll() {
           var now = 'now' in window.performance ? performance.now() : new Date().getTime();
           var time = Math.min(1, (now - startTime) / duration);
           var timeFunction = easings[easing](time);
           window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

           if (window.pageYOffset === destinationOffsetToScroll) {
               if (callback) {
                   callback();
               }
               return;
           }
           requestAnimationFrame(scroll);
       }
       scroll();
   }
});

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

app.service('navigationService', [
    'scrollService',
    function(scrollService) {
        this.init = function () {
            var navLink = document.querySelector('.fade-content-work');
            navLink.addEventListener('click', function(e) {
                if (e.target.classList.contains('active')) {
                    if (window.innerWidth > 960 && window.pageYOffset < 700) {
                        // Smoothly scroll to 700px over 200ms
                        scrollService.smoothScroll(700, 200, 'easeInCubic');
                    }
                }
            });
    
            // (function() {
            //     var tabFadeObjects = [
            //         {
            //             class: 'fade-content-work',
            //             posClass: 'intro-basic',
            //             html: "<h2>When you're ready for <br><span class='purple'>a different breed of event.</span></h2>"
            //         },
            //         {
            //             class: 'fade-content-about',
            //             posClass: 'intro-about',
            //             html: "<h2>Concert, festival, and corporate events <br><span>in the Pacific Northwest.</span></h2>"
            //         },
            //         {
            //             class: 'fade-content-contact',
            //             posClass: 'intro-contact',
            //             html: "<h2>Drop us a line, <br><span>we'll be in touch.</span></h2>"
            //         }
            //     ];
            //     var navLinks = document.querySelectorAll('.fade-content');
            //     var activeLink;
            //     for (var i = 0; i < navLinks.length; i++) {
            //         if (navLinks[i].classList.contains('active')) activeLink = i;
            //     }
            //     var currentTabObject = tabFadeObjects[activeLink];
            //     var introElement = document.querySelector('.intro');
            //     setTimeout(function () {
            //         introElement.innerHTML = tabFadeObjects[activeLink].html;
            //         introElement.classList.add(currentTabObject.posClass);
            //         introElement.classList.remove('fade-out');
            //     }, 300);
            //     navLinks.forEach(function (navLink) {
            //         navLink.addEventListener('click', function (e) {
            //             if (e.target.classList.contains(currentTabObject.class)) return;
            //             introElement.classList.add('fade-out');
            //             function replaceIntroContent(i, oldTabObject) {
            //                 introElement.classList.remove(oldTabObject.posClass);
            //                 introElement.innerHTML = tabFadeObjects[i].html;
            //                 introElement.classList.add(tabFadeObjects[i].posClass);
            //                 introElement.classList.remove('fade-out');
            //             }
    
            //             for (var i = 0; i < tabFadeObjects.length; i++) {
            //                 if (e.target.classList.contains(tabFadeObjects[i].class)) {
            //                     var oldTabObject = currentTabObject;
            //                     currentTabObject = tabFadeObjects[i];
            //                     setTimeout(replaceIntroContent.bind(null, i, oldTabObject), 300);
            //                 }
            //             }
            //         });
            //     });
            // })();
        };
    }
]);

app.controller('primaryController', [
    '$scope', '$document', '$location', '$routeParams', 'dataService', 'scrollService', 'mobileMenuService', 'navigationService',
    function ($scope, $document, $location, $routeParams, dataService, scrollService, mobileMenuService, navigationService) {
        
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
        
        // Dynamically load header intro content and animations
        $document.ready(function () {
            //mobileMenuService.animateHamburger();
            navigationService.init();
        });
    }
]);