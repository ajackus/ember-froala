import Ember from 'ember';
import layout from '../templates/components/froala-editor';
const { isFunction, proxy } = Ember.$;

export default Ember.Component.extend({
    layout: layout,
    classNames: ['froalaEditor'],
    tagName: 'div',
    _froala: null,
    params: {},
    value: null,
    didInsertElement: function() {
        var froala = this.$().froalaEditor(this.get('params')),
            events = this.get('eventNames');

        const froalaElement = this.$();
        froalaElement.froalaEditor('html.set', this.get('value') || '', false);
        for(var prop in this.attrs){
          if(prop !='params') {
            var key = prop.replace(/_/g,".");           
            froalaElement.on('froalaEditor.' + key, proxy(this.handleFroalaEvent, this));
          }
        }
        this.set('_froala', froala);
    },

    handleFroalaEvent: function(event, editor,x,y,z) {
      const eventName = event.namespace;
      const reverseEventName = eventName.replace(/\./g,"_");
      const actionHandler = this.attrs[reverseEventName||"image_beforeUpload"];
      if(isFunction(actionHandler)) {
        actionHandler(event, editor);
      } else {
        if(eventName=='beforeUpload.image'){
          var beforeUpload = this.attrs.image_beforeUpload(event, editor,x);
          if(beforeUpload===false){
            return false;
          }
        }else{
          var action =  this.attrs[reverseEventName];
          if(action===false){
            return false;
          }
        }
      }
    },
    willDestroyElement: function() {
        if (this.get('_froala')) {
            this.$().froalaEditor('destroy');
        }
    }
});

