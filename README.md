#Ember Pageable for Bootstrap

####Pagination Mixin for [Ember.js](http://emberjs.com) Using [Bootstrap's Pagination](http://twitter.github.com/bootstrap/components.html#pagination)

Ember Bootstrap Pageable is a mixin for ArrayControllers to build a paginated 
view that can be controlled with Bootstrap's pagination component. It's designed
to be used in conjuction with the `{{each}}` helper and will adjust the `content`
property to only show the current page's items.  Implementation is simple:

### The Mixin

```javascript
// Somewhere inside of your app
ApplicationController: Ember.Controller.extend({
  people: Ember.ArrayController.create(VG.Mixins.Pageable)
});
```

If you to change the default items per page, just adjust the _perPage option:

```javascript
// Somewhere inside of your app
ApplicationController: Ember.Controller.extend({
  people: Ember.ArrayController.create(VG.Mixins.Pageable, {perPage: 20})
});
```

### The ArrayController
The only difference in this implementation of ArrayController is you will now
assign the array of items to the `data` property:

```javascript
$.getJSON('data.json', function(data){
	var items = [];

	data.forEach(function(item){
		items.pushObject(App.Models.Person.create(item));
	});

	router.get('applicationController.people').set('data', items);
});
```

### The Pagination View

Then inside the template, you'll use the `{{each}}` helper like normal, and use 
this view for the pagination:

    {{view VG.Views.Pagination controllerBinding="path.to.ArrayController"}}

If you want to change the number of pages listed in the pagination at a time,
extend `VG.Views.Pagination` and pass in the `numberOfPages` option:

```javascript
App.Views.Pagination = VG.Views.Pagination.extend({
  numberOfPages: 15
});
```

### Example

Here's the implementation from [the demo](http://visualguruz.com/ember-pageable-demo/):

```html
<!-- Inside of a handlebars template -->
<script type="text/x-handlebars" data-template-name="application">
	<div class="navbar navbar-inverse navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="#">Ember Bootstrap Pageable Demo</a>
			</div>
		</div>
	</div>
	<div class="container">
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
									<tr {{bindAttr class="rowColor"}}>
										<td>{{FirstName}}</td>
										<td>{{LastName}}</td>
										<td>{{Company}}</td>
										<td>{{Location}}</td>
										<td>{{Email}}</td>
									</tr>
								{{/each}}
							</tbody>
						</table>
					</div>
				</div>
				<div class="row">
					{{view App.Views.Pagination controllerBinding="controller.people" classNames="span12"}}
				</div>
			</div>
		</div>
	</div>
</script>
```

### Requirements

- Emberjs 1.0pre2 and dependencies
- Bootstrap 2.2.0 and dependencies

### Coming soon

- Pushstate and Navigation (maybe)
- Sorting API

I'm still on the fence about adding navigation because in most usage cases for pagination, 
the data isn't idempotent and may not be the same on next visit making bookmarking a bad experience.
If there is demand for it, I'll consider it.
