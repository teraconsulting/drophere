// Generated by CoffeeScript 1.4.0
var BaseDispatcher, PasteBinDispatcher, handle_drag_enter, handle_drag_leave, handle_drag_over, handle_drop, root,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

root = typeof exports !== "undefined" && exports !== null ? exports : this;

BaseDispatcher = (function() {

  function BaseDispatcher(file, progress_bar, error_element) {
    var _this = this;
    this.file = file;
    this.progress_bar = progress_bar;
    this.error_element = error_element;
    this.reader = new FileReader;
    this.reader.onerror = this.error_handler;
    this.reader.onprogress = this.update_progress;
    this.reader.onabort = function(evt) {
      return alert('File reading aborted !');
    };
    this.reader.onloadstart = function(evt) {
      console.log('Loading');
      return _this.progress_bar.html('Loading');
    };
    this.reader.onload = function(evt) {
      console.log('Loaded');
      return _this.progress_bar.html('Loaded');
    };
  }

  BaseDispatcher.prototype.error_handler = function(evt) {
    switch (evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        return alert('File Not Found.');
      case evt.target.error.NOT_READABLE_ERR:
        return alert('File is not readable.');
      case evt.target.error.ABORT_ERR:
        return null;
      default:
        return alert('An error occurred reading this file.');
    }
  };

  BaseDispatcher.prototype.update_progress = function(evt) {
    var percent_loaded;
    if (evt.lengthComputable) {
      percent_loaded = Math.round((evt.loaded / evt.total) * 100);
      if (percent_loaded < 100) {
        console.log('#{percent_loaded}%');
        return this.progress_bar.html("" + percent_loaded + "%");
      }
    }
  };

  BaseDispatcher.prototype.dispatch = function() {};

  return BaseDispatcher;

})();

PasteBinDispatcher = (function(_super) {

  __extends(PasteBinDispatcher, _super);

  function PasteBinDispatcher() {
    this.dispatch = __bind(this.dispatch, this);
    return PasteBinDispatcher.__super__.constructor.apply(this, arguments);
  }

  PasteBinDispatcher.prototype.dispatch = function() {
    var ajax_params, send_params,
      _this = this;
    this.reader.readAsText(this.file);
    root.reader = this.reader;
    send_params = {
      api_dev_key: config.pastebin.api_key,
      api_option: 'paste',
      api_paste_code: this.reader.result,
      api_paste_name: this.file.name,
      api_paste_private: 1
    };
    ajax_params = {
      type: 'POST',
      url: config.pastebin.url,
      data: send_params,
      dataType: 'text',
      progress: this.update_progress,
      success: function(data) {
        return console.log(data);
      }
    };
    return $.ajax(ajax_params);
  };

  return PasteBinDispatcher;

})(BaseDispatcher);

handle_drag_over = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  return evt.originalEvent.dataTransfer.dropEffect = 'copy';
};

handle_drop = function(evt) {
  var dispatcher, error_element, file, files, progress_bar, _error_element, _i, _len, _progress_bar, _results;
  evt.stopPropagation();
  evt.preventDefault();
  drop_zone.removeClass('drag-active');
  files = evt.originalEvent.dataTransfer.files;
  console.log(files);
  _results = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    _progress_bar = document.createElement('div');
    _error_element = document.createElement('div');
    progress_bar = $(_progress_bar);
    error_element = $(_error_element);
    $('#output').append(progress_bar);
    $('#output').append(error_element);
    dispatcher = new PasteBinDispatcher(file, progress_bar, error_element);
    _results.push(dispatcher.dispatch());
  }
  return _results;
};

handle_drag_enter = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  console.log('enter');
  return drop_zone.addClass('drag-active');
};

handle_drag_leave = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  console.log('leave');
  if (evt.srcElement === drop_mask.get(0)) {
    console.log(evt);
    return drop_zone.removeClass('drag-active');
  }
};

window.onready = function() {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('APIs are not supported');
    null;
  }
  root.drop_zone = $("#drop-zone");
  root.drop_mask = $("#drop-zone #drop-mask");
  drop_zone.bind('dragenter', handle_drag_enter);
  drop_zone.bind('dragleave', handle_drag_leave);
  drop_zone.bind('dragover', handle_drag_over);
  return drop_zone.bind('drop', handle_drop);
};
