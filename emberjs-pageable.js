/* Copyright (C) 2012 VisualGuruz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

if ('undefined' === typeof VG) {
	VG = {};

	if ('undefined' !== typeof window) {
		window.VG = VG;
	}
}


/**
 * Container for VG Mixins
 * @type {Object}
 */
VG.Mixins = {};

/**
 * Mixing to add to an array controller for use with pagination
 *
 * @type {Ember.Mixin}
 */
VG.Mixins.Pageable = Ember.Mixin.create({
	currentPage: 1,
	perPage: 100,

	/**
	 * Used to store or retrieve the data
	 * @type {Array}
	 */
	data: [],

	/**
	 * Used for the collection view for which items to show
	 *
	 * @return {Array}
	 */
	content: function () {
		// Get the starting and ending point of the array to slice
		var start = (this.get('currentPage') - 1) * this.get('perPage'),
			end = start + this.get('perPage') - 1;

		return this.get('data').slice(start, end);
	}.property('currentPage', 'perPage', 'data'),

	/**
	 * Returns the total number of pages based on the length of the array and
	 * the number of items per page.
	 *
	 * @return int Total Number of Pages
	 */
	totalPages: function () {
		return Math.ceil(this.get('data').length / this.get('perPage'));
	}.property('data', 'perPage'),

	/**
	 * Navigates the content to the next page
	 * @return {void}
	 */
	nextPage: function () {
		// Make sure you can go forward first
		if (this.get('currentPage') === this.get('totalPages'))
			return null; // NOOP

		// Set the current page to the next page
		this.set('currentPage', this.get('currentPage') + 1);
	},

	/**
	 * Navigates the content to the previous page
	 * @return {[type]} [description]
	 */
	previousPage: function () {
		// Make sure you can go backwards first
		if (this.get('currentPage') === 1)
			return null; // NOOP

		// Set the current page to the previous page
		this.set('currentPage', this.get('currentPage') - 1);
	}
});

VG.Views = {};

/**
 * The view class for the pagination.  Handles the navigation of pages using the pageable mixin
 * @type {Ember.View}
 */
VG.Views.Pagination = Ember.View.extend({
	template: Ember.Handlebars.compile(
		'<div class="pagination">\
				<ul>\
					<li {{bindAttr class="view.disablePrev:disabled"}}><a {{action prevPage}}>Prev</a></li>\
					{{#each view.pages itemViewClass="view.pageButton" page="content"}}\
						<a {{action goToPage}}>{{this}}</a>\
					{{/each}}\
					<li {{bindAttr class="view.disableNext:disabled"}}><a {{action nextPage}}>Next</a></li>\
				</ul>\
			</div>'
	),

	/**
	 * Computed property that generates the page link numbers to be used in the view
	 * @return {Array}
	 */
	pages: function () {
		var result = [];

		// Go through all of the pages and make an entry into the array
		for (var i = 0; i < this.get('controller.totalPages'); i++)
			result.push(i + 1);

		return result;
	}.property('controller.totalPages'),

	/**
	 * Computed property to determine if the previous page link should be disabled or not.
	 * @return {Boolean}
	 */
	disablePrev: function () {
		return this.get('controller.currentPage') == 1;
	}.property('controller.currentPage'),

	/**
	 * Computed property to determine if the next page link should be disabled or not.
	 * @return {Boolean}
	 */
	disableNext: function () {
		return this.get('controller.currentPage') == this.get('controller.totalPages');
	}.property('controller.currentPage', 'controller.totalPages'),

	/**
	 * Action that fires the previousPage function on the pageable ArrayController
	 * @param  {event} event
	 * @return {void}
	 */
	prevPage: function (event) {
		event.preventDefault();
		this.get('controller').previousPage();
	},

	/**
	 * Action that fires the nextPage function on the pageable ArrayController
	 * @param  {event} event
	 * @return {void}
	 */
	nextPage: function (event) {
		event.preventDefault();
		this.get('controller').nextPage();
	},

	/**
	 * View class for the page buttons in the pagination
	 * @type {Ember.View}
	 */
	pageButton: Ember.View.extend({
		tagName: 'li',

		// Bind to is current to show the button as active
		classNameBindings: ['isCurrent'],

		/**
		 * Action helper to set the currentPage on the pageable ArrayController
		 * @param  {event} event
		 * @return {void}
		 */
		goToPage: function (event) {
			event.preventDefault();

			// Change the page
			this.set('parentView.controller.currentPage', this.get('content'));
		},

		/**
		 * Computed property to see if the button is active
		 * @return {Boolean}
		 */
		isCurrent: function () {
			return this.get('content') == this.get('parentView.controller.currentPage') ? 'active' : '';
		}.property('parentView.controller.currentPage')
	})
});