app.controller("Home", function($http, $scope, $window, $location, Authorisation) {
    $scope.posts = [];
    $scope.currentUser = $window.localStorage.getItem('currentUser');
    $http({
        method: "GET",
        url: "backend/get/?query=posts"
    }).then(function(response) {
        $scope.posts = response.data;
    });
    $scope.logout = function(event) {
        event.preventDefault();
        Authorisation.logout(function(result) {
            if(result) {
                $location.path("/login");
            }
        });
    }
});

app.controller("Login", function($scope, $window, $location, Authorisation) {
    init();
    function init() {
        if($window.localStorage.getItem('token')) {
            $location.path("/");
        }
    }

    $scope.errors = [];
    $scope.signIn = function(event) {
        $scope.errors = [];

        event.preventDefault();
        const {username, password} = $scope;
        if(username && password) {
            Authorisation.login({username, password}, function(result) {
                if(result == true) {
                    $location.path("/");
                } else {
                    if(result != null) {
                        $scope.errors.push(result);
                    } else {
                        $scope.errors.push("There was an error logging you in. Please try again later.");
                    }
                }
            });
        } else {
            if(!username) $scope.errors.push("Username required.");
            if(!password) $scope.errors.push("Password required.");
        }
    }
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
    $scope.post = {};
    $http.get("backend/get/?query=post&id=" + id)
    .then(function(response) {
        $scope.post = response.data;
    });
});

app.controller("Compose", function($http, $scope) {
    $scope.post = {};
    $scope.errors = [];
    $scope.doSlug = function() {
        if($scope.post.title) {
            var slug = $scope.post.title.replace(/\s+/g, '-').toLowerCase();
            $scope.post.slug = slug;
        } else {
            $scope.post.slug = null;
        }
    }
    $scope.submitPost = function(event) {
        event.preventDefault();
        $scope.errors = [];
        
        if($scope.post.title && $scope.post.slug && $scope.post.type && $scope.post.content) {
            $http({
                method: "POST",
                url: "backend/post/posts/",
                data: $scope.post,
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            }).then(function(response) {
                if(response.data == "Success") {
                    console.log("Post created successfully.");
                } else if(response.data.substring(0, 6) == "Failed") {
                    let feedback = response.data.split("|");
                    console.log(feedback[1]);
                } else {
                    console.log(response.data);
                }
            })
        } else {
            if(!$scope.post.title) $scope.errors.push("A title is required.");
            if(!$scope.post.slug) $scope.errors.push("Something is wrong with your slug.");
            if(!$scope.post.type) $scope.errors.push("Select the type of post you are composing.");
            if(!$scope.post.content) $scope.errors.push("There is no post without content.");
        }
    }
});

app.controller("Gallery", function($http, $scope) {
    $scope.gallery = {};
    $http.get("backend/get/?query=gallery")
    .then(function(response) {
        if(response.data) {
            console.log(response.data);
            $scope.gallery = response.data;
        }
    });
});

// Post new gallery item
app.controller("Post", function($http, $scope) {
    $scope.item = {};
    $scope.errors = [];
    $scope.postItem = function(event) {
        event.preventDefault();
        console.log($scope.item);
        $http({
            method: "POST",
            url: "backend/post/gallery/",
            data: {
                title: $scope.item.title,
                description: $scope.item.description,
                file: $scope.file
            },
            headers: {"Content-Type": undefined},
            transformRequest: function(data) {
                var formData = new FormData();
                angular.forEach(data, function(value, key) {
                    formData.append(key, value);
                });

                return formData;
            }
        }).then(function(response) {
            console.log(response.data);
        });
    }
});