import Ember from 'ember';
import layout from '../templates/components/froala-editor';
const { isFunction, proxy } = Ember.$;

export default Ember.Component.extend({
    layout: layout,
    tagName: 'div',
    classNames: ['froalaEditor'],
    _froala: null,
    params: {},

    // we need this to prevent re-setting html it after content changed
    _observeValue: true,

    contentChanged() {
        let html = this.get('_froala').froalaEditor('html.get');

        // this prevents `setValue` to be called and so the html to be re-set, which we do not want.
        this.set('_observeValue', false);
        this.set('value', html);
        this.set('_observeValue', true);
    },

    valueChanged: function() {
        if (this.get('_observeValue')) {
            this.setValue();
        }
    }.observes('value'),

    setValue() {
        this.get('_froala').froalaEditor('html.set', this.get('value') || '');
    },

    didInsertElement: function() {
        var buttons = this.get('customButtons') || Ember.K;
        buttons();
        var froala = this.$().froalaEditor(this.get('params'));
        const froalaElement = this.$();
        this.setValue();
        froalaElement.on('froalaEditor.keyup', Ember.run.bind(this, this.contentChanged));
        for(var prop in this.attrs){
          if(prop !=='params') {
            var key = prop.replace(/_/g,".");
            froalaElement.on('froalaEditor.' + key, proxy(this.handleFroalaEvent, this,key));
          }
        }
        this.set('_froala', froala);
    },
    handleFroalaEvent: function(key,event, editor,x,y,z) {
      //const eventName = event.namespace;
      const reverseEventName = key.replace(/\./g,"_");
      const actionHandler = this.attrs[reverseEventName];
      if(isFunction(actionHandler)) {
        actionHandler(event, editor, x,y,z);
      } else {
        var action =  this.attrs[reverseEventName];
        if(action===false){
          return false;
        }
      }
    },
    willDestroyElement: function() {
        if (this.get('_froala')) {
            this.$().froalaEditor('destroy');
        }
    }
});

