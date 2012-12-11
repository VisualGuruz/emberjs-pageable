#Ember Bootstrap Pageable

####Pagination Mixin for Ember.js Using Twitter Bootstrap's Pagination

Ember Bootstrap Pageable is a mixin for ArrayControllers to build a paginated 
view that can be controlled with Bootstrap's pagination component. It's designed
to be used in conjuction with the `{{each}}` helper and will adjust the `content`
property to only show the current page's items.  Implementation is simple:

```javascript
// Somewhere inside of your app
ApplicationController: Ember.Controller.extend({
  equipment: Ember.ArrayController.create(VG.Mixins.Pageable)
});
```

If you to change the default items per page, just adjust the _perPage option:

```javascript
// Somewhere inside of your app
ApplicationController: Ember.Controller.extend({
  equipment: Ember.ArrayController.create(VG.Mixins.Pageable, {
    _perPage: 20
  })
});
```

Then inside the template, you'll use the `{{each}}` helper like normal, and use 
this view for the pagination:

    {{view VG.Views.Pagination controllerBinding="path.to.ArrayController"}}
    
Here's a (stripped down) real world example with a bit more context:

```html
<!-- Inside of a handlebars template -->
<div class="span10">
  <div class="row">
    <div class="span10">
      <table class="table table-striped table-bordered table-condensed">
        <tbody>
      <!-- Just call the helper like normal -->
          {{#each equipment}}
            <tr {{bindAttr class="rowColor"}}>
              <td>{{tag_num}}</td>
              <td>{{mfg}}</td>
              <td>{{model}}</td>
              <td>{{description}}</td>
              <td>{{score}}</td>
              <td>{{purchase_cost}}</td>
              <td>{{maintenance_cost}}</td>
              <td>{{maintenanceRatioFormatted}}</td>
              <td>{{meanUptime}}</td>
              <td>{{uptimeScoreFormatted}}</td>
              <td>{{ageRatioFormatted}}</td>
              <td>{{riskRatioFormatted}}</td>
              <td>{{ageMoment}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </div>
  <div class="row">
  <!-- Here's where you'll call the pagination view -->
    {{view VG.Views.Pagination controllerBinding="controller.equipment" classNames="span10"}}
  </div>
</div>
```

###Coming soon

- Pushstate
- Handling high volumes of pages