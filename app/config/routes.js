app.config(function ($routeProvider) {
        $routeProvider
            .when('/',
                {
                    controller: 'viewController',
                    templateUrl: 'app/views/quiz_partial.html'
                })
            //Define a route that has a route parameter in it (:customerID)
            .when('/choices',
                {
                    controller: 'viewController',
                    templateUrl: 'app/views/choices_partial.html'
                })
			.when('/reservations',
				{
					controller: 'viewController',
					templateUrl: 'app/views/reservations_partial.html'
				})
			.when('/registrations',
				{
					controller: 'viewController',
					templateUrl: 'app/views/registrations_partial.html'
				})
			.when('/events',
				{
					controller: 'viewController',
					templateUrl: 'app/views/events_partial.html'
				})
			.when('/contacts',
				{
					controller: 'viewController',
					templateUrl: 'app/views/contacts_partial.html'
				})
            .otherwise({ redirectTo: '/' });
    });