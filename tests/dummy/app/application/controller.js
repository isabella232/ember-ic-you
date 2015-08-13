import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  actions: {
    crossedTheLine(above) {
      this.set('aboveTheLine', above);
    }
  }
});