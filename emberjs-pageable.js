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

// Make sure the Helpers container exists
if ('undefined' === typeof VG.Helpers)
	VG.Helpers = {};

// Make sure the Views container exists
if ('undefined' === typeof VG.Views)
	VG.Views = {};

// Make sure the Mixins container exists
if ('undefined' === typeof VG.Mixins)
	VG.Mixins = {};

/**
 * Normalizes values to be used in a sort for natural sort
 * @param  {Mixed} a
 * @param  {Mixed} b
 * @return {Array}
 */
VG.Helpers.normalizeSortValues = function (a, b) {
	// Set unsupported types.  May need to be made into a whitelist instead
	var failTypes = ['function', 'object', 'array', 'date', 'regexp'];

	// Check if `b` can be normalized
	if (jQuery.inArray(jQuery.type(a), failTypes) !== -1){
		throw new Error('Cannot normalize input `a`! '+jQuery.type(a)+' was passed!');
	}

	// Check if `b` can be normalized
	if (jQuery.inArray(jQuery.type(b), failTypes) !== -1){
		throw new Error('Cannot normalize input `b`! '+jQuery.type(b)+' was passed!');
	}

	// Function that does the normalizing
	var norm = function (input) {
		// Some setup
		var ret,
			tests = {
				// Regex to detect if is number
				number: /^([0-9]+?)$/
			};

		// Figure out what the value is return the normalized version
		switch(jQuery.type(input)) {
			case 'string':
				if (tests.number.test(jQuery.trim(input))) {
					return parseInt(input, 10);
				}
				return jQuery.trim(input).toLowerCase();
			case 'null':
				return '';
			case 'boolean':
				return input ? '0' : '1';
			default:
				return input;
		}
	};

	// Normalize variables
	a = norm(a);
	b = norm(b);

	// If types differ, set them both to strings
	if ((typeof a === 'string' && typeof b === 'number') || (typeof b === 'string' && typeof a === 'number')) {
		a = String(a);
		b = String(b);
	}

	// Return normalized values
	return [a, b];
};


/**
 * Mixing to add to an array controller for use with pagination
 *
 * @type {Ember.Mixin}
 */
VG.Mixins.Pageable = Ember.Mixin.create({
	/**
	 * Current page of the view
	 * @type {Number}
	 */
	currentPage: 1,

	/**
	 * How many items to show per page
	 * @type {Number}
	 */
	perPage: 100,

	/**
	 * The property the data is currently sorted by
	 * @type {String}
	 */
	sortBy: null,

	/**
	 * Direction of the current sort, if any
	 * @type {String}
	 */
	sortDirection: 'ascending',


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
			end = start + this.get('perPage');

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
	},

	/**
	 * Sorts the data by a property
	 * @param  {String} property
	 * @param  {String} direction
	 * @return {Void}
	 */
	sortByProperty: function (property, direction) {
		var data = this.get('data').slice();

		// Set up sort direction
		if (direction === undefined) {
			if (this.get('sortBy') === property && this.get('sortDirection') === 'ascending')
				direction = 'descending';
			else
				direction = 'ascending';
		}

		// Custom sort to sort alphanumerically
		data.sort(function (a, b) {
			// Normalize values to make sort natural
			var normalizedValues = VG.Helpers.normalizeSortValues(a.get(property), b.get(property)),
				va = normalizedValues[0],
				vb = normalizedValues[1];

			// Do the sorting
			if (va == vb)
				return 0;
			else {
				// Reverse if necessary
				if (direction === 'ascending')
					return va > vb ? 1 : -1;
				else
					return va < vb ? 1 : -1;
			}
		});

		// Now that sort is complete, set the controller
		this.set('sortBy', property);

		// Assign sort direction
		this.set('sortDirection', direction);

		// Assign the data
		this.set('data', data);

		// Reset the current page to 1
		this.set('currentPage', 1);
	}
});

/**
 * The view class for the pagination.  Handles the navigation of pages using the pageable mixin
 * @type {Ember.View}
 */
VG.Views.Pagination = Ember.View.extend({
	/**
	 * Default template used to render the page buttons
	 * @type {[type]}
	 */
	defaultTemplate: Ember.Handlebars.compile(
		'{{#if view.pages}}\
		<div class="pagination pull-right">\
				<ul>\
					<li {{bindAttr class="view.disablePrev:disabled"}}><a {{action prevPage target="view"}}>Prev</a></li>\
					{{#each view.pages itemViewClass="view.PageButton" page="content"}}\
						<a {{action goToPage target="view"}}>{{this}}</a>\
					{{/each}}\
					<li {{bindAttr class="view.disableNext:disabled"}}><a {{action nextPage target="view"}}>Next</a></li>\
				</ul>\
			</div>\
		{{/if}}'
	),

	/**
	 * Number of page buttons to display at a time
	 * @type {Number}
	 */
	numberOfPages: 10,

	/**
	 * Computed property that generates the page link numbers to be used in the
	 * view. Limit to 10 pages at a time with the current page being in the center
	 * if there are pages past the start or end. Credit to Google.com for the
	 * inspiration.  Here's an example of how it should look:
	 *
	 *              Prev 8 9 10 11 12 |13| 14 15 16 17 Next
	 *              Prev 80 81 82 83 84 85 86 |87| 88 89 90 91 92 93 94 Next
	 *
	 * @return {Array}
	 */
	pages: function () {
		var result = [],
			totalPages = this.get('controller.totalPages'),
			currentPage = this.get('controller.currentPage'),
			length = (totalPages >= this.get('numberOfPages')) ? this.get('numberOfPages') : totalPages,
			startPos;

		// If only one page, don't show pagination
		if (totalPages === 1)
			return;

		/*
		 * Figure out the starting point.
		 *
		 * If current page is <= 6, then start from 1, else FFIO
		 */
		if (currentPage  <= Math.floor(this.get('numberOfPages') / 2) + 1 || totalPages <= this.get('numberOfPages')) {
			startPos = 1;
		} else {
			// Check to see if in the last section of pages
			if (currentPage >= totalPages - (Math.ceil(this.get('numberOfPages') / 2) - 1)) {
				// Start pages so that the total number of pages is shown and the last page number is the last page
				startPos = totalPages - ((this.get('numberOfPages') - 1));
			} else {
				// Start pages so that current page is in the center
				startPos = currentPage - (Math.ceil(this.get('numberOfPages') / 2) - 1);
			}
		}

		// Go through all of the pages and make an entry into the array
		for (var i = 0; i < length; i++)
			result.push(i + startPos);

		return result;
	}.property('controller.totalPages', 'controller.currentPage'),

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
	prevPage: function () {
		this.get('controller').previousPage();
	},

	/**
	 * Action that fires the nextPage function on the pageable ArrayController
	 * @param  {event} event
	 * @return {void}
	 */
	nextPage: function () {
		this.get('controller').nextPage();
	},

	/**
	 * View class for the page buttons in the pagination
	 * @type {Ember.View}
	 */
	PageButton: Ember.View.extend({
		// Bootstrap page buttons are li elements
		tagName: 'li',

		// Bind to is current to show the button as active
		classNameBindings: ['isCurrent'],

		/**
		 * Action helper to set the currentPage on the pageable ArrayController
		 * @param  {event} event
		 * @return {void}
		 */
		goToPage: function () {
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

/**
 * Table Header view class to create th tags that will sort your table when
 * clicked. Bootstrap does not supply styling for sorting, so you'll need to
 * create your own. By default, Pageable uses the following styles:
 *
 *     `clickable`: Marks the header as clickable, allowing for things like
 * setting the curser to pointer, letting the user know the element is
 * clickable.
 *     `active`: Will be set if the header is the current active sort
 *     `ascending`: Will be set if the header is active and the current sort is
 * ascending.
 *     `descending`: Will be set if the header is active and the current sort
 * is descending.
 *
 * @type {Object}
 */
VG.Views.TableHeader =  Ember.View.extend({
	/**
	 * Default template used to render the header
	 * @type {Function}
	 */
	defaultTemplate: Ember.Handlebars.compile('{{view.text}}'),

	/**
	 * It's a header, so render it as a th
	 * @type {String}
	 */
	tagName: 'th',

	/**
	 * Mark the view as clickable
	 * @type {Array}
	 */
	classNames: ['clickable'],

	/**
	 * Define the bound classes.  Used to say if the header is the active sort
	 * and what direction the sort is.
	 * @type {Array}
	 */
	classNameBindings: ['isCurrent:active', 'isAscending:ascending', 'isDescending:descending'],
	
	/**
	 * Name of the property the header is bound to
	 * @type {String}
	 */
	propertyName: '',

	/**
	 * Text to be rendered to the view
	 * @type {String}
	 */
	text: '',

	/**
	 * Click even used to instantiate a new sort
	 *
	 * @param  {Object} event
	 * @return {Void}
	 */
	click: function (event) {
		this.get('controller').sortByProperty(this.get('propertyName'));
	},

	/**
	 * Computed property for checking to see if the header is the current sort
	 * or not.
	 *
	 * @return {Boolean}
	 */
	isCurrent: function () {
		return this.get('controller.sortBy') === this.get('propertyName');
	}.property('controller.sortBy'),

	/**
	 * Computed property for checking to see if the header is sorted ascending
	 * when it is the current sort.
	 *
	 * @return {Boolean} [description]
	 */
	isAscending: function () {
		return this.get('isCurrent') && this.get('controller.sortDirection') === 'ascending';
	}.property('controller.sortDirection', 'isCurrent'),

	/**
	 * Computed property for checking to see if the header is sorted descending
	 * when it is the current sort.
	 *
	 * @return {Boolean} [description]
	 */
	isDescending: function () {
		return this.get('isCurrent') && this.get('controller.sortDirection') === 'descending';
	}.property('controller.sortDirection', 'isCurrent')
});