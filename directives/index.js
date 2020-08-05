app.directive("Modal", function() {
    return {
        link: function(scope, element, attrs) {
            element.appendTo("body");

            element.on("click", function(event) {
                element.remove();
            });

            function Open() {
                element.show();
                $('body').addClass("modal-open");
            }

            function Hide() {
                element.hide();
                $('body').removeClass("modal-open");
            }
        }
    };
});
