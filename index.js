var app = angular.module("app", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state("home", {
        url: "/",
        templateUrl: "./components/home.html",
        controller: "Home"
    })
    .state("login", {
        url: "/login",
        templateUrl: "./components/login.html",
        controller: "Login"
    })
    .state("posts", {
        url: "/posts",
        templateUrl: "./components/posts.html",
        controller: "Posts"
    })
    .state("compose", {
        url: "/posts/compose",
        templateUrl: "./components/posts.compose.html",
        controller: "Compose"
    })
    .state("edit", {
        url: "/posts/edit/:id",
        templateUrl: "./components/posts.edit.html",
        controller: "Edit"
    });

    function authenticated ($q, $state, $timeout, AuthService) {
        if(AuthService.isAuthenticated()) {
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
