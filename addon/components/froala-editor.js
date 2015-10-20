import Ember from 'ember';
import layout from '../templates/components/froala-editor';

const { $, on } = Ember;
const { isFunction, proxy } = $;

export default Ember.Component.extend({
  layout: layout,
  params: {},
  tagName: 'div',
  value: null,
  _froala: null,

  eventNames: [
    'afterFileUpload',
    'afterImageUpload',
    'afterPaste',
    'afterPasteCleanup',
    'afterRemoveImage',
    'afterSave',
    'afterUploadPastedImage',
    'align',
    'backColor',
    'badLink',
    'beforeDeleteImage',
    'beforeFileUpload',
    'beforeImageUpload',
    'beforePaste',
    'beforeRemoveImage',
    'beforeSave',
    'beforeUploadPastedImage',
    'blur',
    'bold',
    'cellDeleted',
    'cellHorizontalSplit',
    'cellInsertedAfter',
    'cellInsertedBefore',
    'cellVerticalSplit',
    'cellsMerged',
    'columnDeleted',
    'columnInsertedAfter',
    'columnInsertedBefore',
    'contentChanged',
    'fileError',
    'fileUploaded',
    'focus',
    'fontFamily',
    'fontSize',
    'foreColor',
    'formatBlock',
    'getHTML',
    'htmlHide',
    'htmlShow',
    'imageAltSet',
    'imageDeleteError',
    'imageDeleteSuccess',
    'imageError',
    'imageFloatedLeft',
    'imageFloatedNone',
    'imageFloatedRight',
    'imageInserted',
    'imageLinkInserted',
    'imageLinkRemoved',
    'imageLoaded',
    'imageReplaced',
    'imageResize',
    'imageResizeEnd',
    'imagesLoaded',
    'imagesLoadError',
    'indent',
    'initialized',
    'italic',
    'linkInserted',
    'linkRemoved',
    'maxCharNumberExceeded',
    'onPaste',
    'orderedListInserted',
    'outdent',
    'redo',
    'rowDeleted',
    'rowInsertedAbove',
    'rowInsertedBelow',
    'saveError',
    'selectAll',
    'strikeThrough',
    'subscript',
    'superscript',
    'tableDeleted',
    'tableInserted',
    'underline',
    'undo',
    'unorderedListInserted',
    'videoError',
    'videoFloatedLeft',
    'videoFloatedNone',
    'videoFloatedRight',
    'videoInserted',
    'videoRemoved',
  ],

  handleFroalaEvent: function(event, editor) {
    const eventName = event.namespace;
    const actionHandler = this.attrs[eventName];

    if (isFunction(actionHandler)) {
      actionHandler(event, editor);
    } else {
      this.sendAction(eventName, event, editor);
    }
  },

  renderFroalaEditor: on('didInsertElement', function() {
    const events = this.get('eventNames');
    const froala = this.$().editable(this.get('params'));
    const froalaElement = this.$();

    froalaElement.editable('setHTML', this.get('value') || '', false);

    events.forEach((key) => {
      if (this.attrs[key]) {
        froalaElement.on('editable.' + key, proxy(this.handleFroalaEvent, this));
      }
    });

    this.set('_froala', froala);
  }),

  teardownFroalaEditor: on('willDestroyElement', function() {
    if (this.get('_froala')) {
      this.$().editable('destroy');
    }
  }),

});
