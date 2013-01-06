#Ember Pageable for Bootstrap

####Pagination Mixin for [Ember.js](http://emberjs.com) Using [Bootstrap's Pagination](http://twitter.github.com/bootstrap/components.html#pagination)

Ember Bootstrap Pageable is a mixin for ArrayControllers to build a paginated 
view that can be controlled with Bootstrap's pagination component. It's designed
to be used in conjuction with the `{{each}}` helper and will adjust the `content`
property to only show the current page's items.  Implementation is simple:

### The Mixin

```javascript
// Use when creating the controller for the paginated content
App.PeopleController = Ember.Controller.extend({
	people: Ember.ArrayController.createWithMixins(VG.Mixins.Pageable)
});
```

If you to change the default items per page, just adjust the perPage option:

```javascript
// Declare the controller and instantiate the pageable ArrayController with 20 items per page
App.PeopleController = Ember.Controller.extend({
	people: Ember.ArrayController.createWithMixins(VG.Mixins.Pageable, {
		perPage: 20
	})
});
```

### The ArrayController
The only difference in this implementation of ArrayController is you will now
assign the array of items to the `data` property. Easily done inside of setupControllers():

```javascript
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
```

### The Pagination View

Then inside the template, you'll use the `{{each}}` helper like normal, and use 
this view for the pagination:

```handlebars
{{view VG.Views.Pagination controllerBinding="people" classNames="span12"}}
```

If you want to change the number of pages listed in the pagination at a time,
extend `VG.Views.Pagination` and pass in the `numberOfPages` option:

```javascript
// Declare the pagination view and set the number of pages to show to 15
App.PaginationView = VG.Views.Pagination.extend({
	numberOfPages: 15
});
```

### Example

Here's the implementation from [the demo](http://visualguruz.com/ember-pageable-demo/):

```html
<!-- Inside of a handlebars template -->
<div class="row">
	<div class="span12">
		<div class="row">
			<div class="span12">
				<table class="table table-striped table-bordered table-condensed">
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Company Name</th>
							<th>Location</th>
							<th>E-mail</th>
						</tr>
					</thead>
					<tbody>
						{{#each people}}
							<tr>
								<td>{{FirstName}}</td>
								<td>{{LastName}}</td>
								<td>{{Company}}</td>
								<td>{{location}}</td>
								<td>{{Email}}</td>
							</tr>
						{{/each}}
					</tbody>
				</table>
			</div>
		</div>
		<div class="row">
			{{view App.PaginationView controllerBinding="people" classNames="span12"}}
		</div>
	</div>
</div>
```

### Requirements

- Emberjs with router-v2 (currently only `master` has this) and dependencies
- Bootstrap 2.2.0 and dependencies

### Coming soon

- Sorting API Documentation
- Pushstate and Navigation (maybe)

I'm still on the fence about adding navigation because in most usage cases for pagination, 
the data isn't idempotent and may not be the same on next visit making bookmarking a bad experience.
If there is demand for it, I'll consider it.
