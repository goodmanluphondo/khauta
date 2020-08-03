app.service("Authorisation", function($http, $window, $location) {
    var service = {};

    service.login = login;
    service.logout = logout;
    service.lookup = lookup;

    return service;
    
    function login(credentials, callback) {
        $http({
            method: "POST", 
            url: "backend/authorisation/",
            data: credentials
        }).success(function(data) {
            if(data.token) {
                $window.localStorage.setItem('token', data.token);
                $window.localStorage.setItem('currentUser', data.name);
                $http.defaults.headers.common.Authorisation = data.token;
                callback(true);
            } else {
                callback(data.error);
            }
        })
    }

    function logout(callback) {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('currentUser');
        $http.defaults.headers.common.Authorisation = "";
        callback(true);
    }

    function lookup() {
        if($window.localStorage.getItem('token')) {
            $http.defaults.headers.common.Authorisation = $window.localStorage.getItem('token');
            return true;
        } else {
            return false;
        }
    }
});