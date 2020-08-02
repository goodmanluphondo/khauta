app.controller("Home", function($http, $scope) {
    $scope.posts = [];
    $http({
        method: "GET",
        url: "backend/get/?query=posts"
    }).then(function(response) {
        $scope.posts = response.data;
        console.log($scope.posts);
    });
});

app.controller("Posts", function($http, $scope) {
    $scope.posts = [];
    $scope.getExcerpt = function(content) {
        if(content) {
            return content.substring(0, 50);
        }
    }
    $http({
        method: "GET",
        url: "backend/get/?query=posts"
    }).then(function(response) {
        $scope.posts = response.data;
        console.log($scope.posts);
    });
});

app.controller("Edit", function($http, $scope, $stateParams) {
    let id = $stateParams.id;
    $scope.post = [];
    $http.get("backend/get/?query=post&id=" + id)
    .then(function(response) {
        $scope.post = response.data;
    });
});

app.controller("Compose", function($http, $scope) {
    //
});