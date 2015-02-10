app.config(function ($routeProvider) {
        $routeProvider
            .when('/',
                {
                    controller: 'viewController',
                    templateUrl: 'app/views/quiz_partial.html'
                })
            .when('/choices',
                {
                    controller: 'viewController',
                    templateUrl: 'app/views/choices_partial.html'
                })
            .otherwise({ redirectTo: '/' });
    });