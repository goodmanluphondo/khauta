var app = angular.module("app", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $provide.service("unauthorisedInterceptor", ["$q", "$window", function($q, $window) {
        return {
            "responseError": function(rejection) {
                if(rejection.status === 401) {
                    $window.localStorage.removeItem('token');
                    $window.localStorage.removeItem('currentUser');
                    $window.location.href = "#/";
                }

                return $q.reject(rejection);
            }
        }
    }]);

    $httpProvider.interceptors.push("unauthorisedInterceptor");

    $stateProvider
    .state("home", {
        url: "/",
        templateUrl: "./components/home.html",
        controller: "Home",
        resolve: {authenticated: authenticated}
    })
    .state("login", {
        url: "/login",
        templateUrl: "./components/login.html",
        controller: "Login"
    })
    .state("posts", {
        url: "/posts",
        templateUrl: "./components/posts.html",
        controller: "Posts",
        resolve: {authenticated: authenticated}
    })
    .state("compose", {
        url: "/posts/compose",
        templateUrl: "./components/posts.compose.html",
        controller: "Compose",
        resolve: {authenticated: authenticated}
    })
    .state("edit", {
        url: "/posts/edit/:id",
        templateUrl: "./components/posts.edit.html",
        controller: "Edit",
        resolve: {authenticated: authenticated}
    })
    .state("gallery", {
        url: "/gallery",
        templateUrl: "./components/gallery.html",
        controller: "Gallery",
        resolve: {authenticated: authenticated}
    })
    .state("post", {
        url: "/gallery/post",
        templateUrl: "./components/gallery.post.html",
        controller: "Post",
        resolve: {authenticated: authenticated}
    });

    function authenticated ($q, $state, $timeout, Authorisation) {
        if(Authorisation.lookup()) {
            return $q.when();
        } else {
            $timeout(function() {
                $state.go('login', {});
                return $q.reject();
            })
        }
    }
});

app.run(function($rootScope) {
    $rootScope.$on("$stateChangeSuccess", function() {});
});
