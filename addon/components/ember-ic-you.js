import Ember from 'ember';

const {
  Component,
  guidFor,
  run,
  computed,
  isEmpty,
} = Ember;

/**
 A simple component to send an action when it passes a distance from the bottom
 of a scrollable element.

 @class EmberICYou
 */

export default Component.extend({

  classNames: ['ember-ic-you'],

  /**
   The name of the action that will be sent.
   */

  crossedTheLine: 'crossedTheLine',

  /**
   True if the listener can be turned on.

   @property enabled
   @type { Boolean }
   @default true
   */

  enabled: true,

  /**
   The distance from the bottom at which aboveTheLine will be true.

   @property triggerDistance
   @type { Number }
   @default 0
   */

  triggerDistance: 0,

  /**
   Keeps state of page position relative to the component's
   trigger `triggerDistance`

   @property aboveTheTrigger
   @type {Boolean}
   @default false
   */

  aboveTheTrigger: false,

  /**
   Optional - the viewport element holding the content.

   @property scrollContainer
   @type {String}
   @default null
   */

  scrollContainer: null,

  /**
   Optional - the content that is currently being scrolled.

   @property scrolledContent
   @type {String}
   @default null
   */

  scrolledContent: null,

  /**
   Selector for the viewport container. If null, the container will be the window.

   @property scrollContainer
   @type {String}
   @default null
   */

  _scrollContainer: computed('scrollContainer', function() {
    let selector = this.get('scrollContainer');
    return selector ? this.$().closest(selector) : Ember.$(window);
  }),

  /**
   Selector for the content being scrolled.

   @property _scrolledContent
   @type {String}
   */

  _scrolledContent: computed('scrolledContent', function() {
    return this.$().closest(this.get('scrolledContent'));
  }),

  /**
   Caches the elements that will be used in each scroll cycle, sets an observer
   on `enabled` to fire `_switch`, and calls `_switch`;

   @method didInsertElement
   */

  didInsertElement() {
    this.addObserver('enabled', this, '_switch');
    this._switch();
  },

  /**
   The names of the listeners the component will use, concatenated for use by
   jQuery.

   @property eventNames
   @type { String }
   */

  eventNames: computed(function() {
    let guid = guidFor(this);
    return `scroll.${guid} resize.${guid}`;
  }),

  /**
   Deactivates the jQuery listeners.

   @method willDestroyElement
   */

  willDestroyElement() {
    this.deactivateListeners();
  },

  /**
   Initializes jQuery listeners.

   @method activateListeners
   */

  activateListeners() {
    let scrollContainer = this.get('_scrollContainer'),
        eventNames = this.get('eventNames');

    scrollContainer.on(eventNames, () => {
      this._listenerFired();
    });
  },

  /**
   Deinitializes jQuery listeners.

   @method deactivateListeners
   */

  deactivateListeners() {
    let scrollContainer = this.get('_scrollContainer'),
        eventNames = this.get('eventNames');

    scrollContainer.off(eventNames);
  },

  /**
   Activates and deactivates listeners depending on if the component is `enabled`

   @method _switch
   @private
   */

  _switch() {
    let enabled = this.get('enabled');

    if (enabled) {
      this.activateListeners();
    } else {
      this.deactivateListeners();
    }
  },

  /**
   Measures the distance of the component from the bottom.
   Debounces `crossedTheLine` action.

   @method _listenerFired
   @private
   */

  _listenerFired() {
    let scrollContainer = this.get('_scrollContainer');
    let scrolledContent = this.get('_scrolledContent');
    let triggerDistance = this.get('triggerDistance');
    let previousAboveTheTrigger = this.get('aboveTheTrigger');

    let icYouWindowPosition = this.$().offset().top;

    // If you are scrolling content that isn't the window itself, there should be a provided `scrolledContent` selector
    // for that content. The position of `ember-ic-you` would be measured relative to this scrolled content.
    let offsetFromTop = isEmpty(scrolledContent) ? icYouWindowPosition : icYouWindowPosition - scrolledContent.offset().top;
    let scrollContainerPosition = scrollContainer.scrollTop();
    let scrollContainerHeight = scrollContainer.height();

    let positionOfMe = offsetFromTop - scrollContainerPosition - scrollContainerHeight;
    let aboveTheTrigger = ( positionOfMe <= triggerDistance );

    if (aboveTheTrigger !== previousAboveTheTrigger) {
      this.set('aboveTheTrigger', aboveTheTrigger);
      run.debounce(this, 'sendAction', 'crossedTheLine', aboveTheTrigger, 50);
    }
  }
});
