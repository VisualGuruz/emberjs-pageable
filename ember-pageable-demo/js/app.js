// Create the Application
App = Ember.Application.create();

// Map out the route
App.Router.map(function(match){
	match('/').to('people');
});

// Declare the route
App.PeopleRoute = Ember.Route.extend({
	setupControllers: function(controller) {
		// Get the data to use and inject it into the controller
		$.getJSON('data.json', function(data){
			var items = [];

			// Loop through each item and create a Person out of it
			data.forEach(function(item){
				items.pushObject(App.PersonModel.create(item));
			});

			// Set the items to the `data` property for use in the controller
			controller.set('people.data', items);
		});
	}
});

/*****************************************************************************
 *                                                                           *
 *                             The MVC stuff                                 *
 *                                                                           *
 *****************************************************************************/

// Declare the person model and add a property to format the location
App.PersonModel = Ember.Object.extend({
	location: function () {
		return this.get('City')+', '+this.get('State');
	}.property('City', 'State')
});

// Declare the pagination view and set the number of pages to show to 15
App.PaginationView = VG.Views.Pagination.extend({
	numberOfPages: 15
});

// Declare the controller and instantiate the pageable ArrayController with 20 items per page
App.PeopleController = Ember.Controller.extend({
	people: Ember.ArrayController.createWithMixins(VG.Mixins.Pageable, {
		perPage: 20
	})
});