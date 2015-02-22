app.config(function ($routeProvider) {
        $routeProvider
            .when('/',
                {
                    controller: 'CardController',
                    templateUrl: 'app/views/quiz_partial.html'
                })
            .when('/choices',
                {
                    controller: 'CardController',
                    templateUrl: 'app/views/choices_partial.html'
                })
            .otherwise({ redirectTo: '/' });
    });