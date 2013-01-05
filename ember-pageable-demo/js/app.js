App = Ember.Application.create();

App.Router = Ember.Router.extend();

App.Router.map(function(match){
	match('/').to('people');
});

App.PaginationView = VG.Views.Pagination.extend({
	numberOfPages: 15
});

App.PersonModel = Ember.Object.extend({
	location: function () {
		return this.get('City')+', '+this.get('State');
	}.property('City', 'State')
});

App.PeopleController = Ember.Controller.extend({
	people: Ember.ArrayController.createWithMixins(VG.Mixins.Pageable, {
		perPage: 20
	})
});

App.PeopleRoute = Ember.Route.extend({
	setupControllers: function(controller) {
		$.getJSON('data.json', function(data){
			var items = [];

			data.forEach(function(item){
				items.pushObject(App.PersonModel.create(item));
			});

			controller.set('people.data', items);
		});
	}
});