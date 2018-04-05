'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = exports.app = function () {
  function app() {
    _classCallCheck(this, app);

    initVariables();
    loadVariables();
  }

  _createClass(app, [{
    key: 'initVariables',
    value: function initVariables() {
      this.onceInit = false;
      this.prefix = null;
      this.suffix = null;
      this.version = null;
      this.build = null;
      this.useBlock = null;
      this.supportStorage = null;
      this.supportWorker = null;
      this.$el = null;
      this.cvs = null;
      this.$cvs = null;
      this.$selector = null;
      this.$ranges = null;
      this.$ranges.temp = null;
      this.$ranges.start = null;
      this.$ranges.end = null;
      this.$ranges.temp.start = null;
      this.$ranges.temp.end = null;
    }
  }, {
    key: 'loadVariables',
    value: function loadVariables() {
      this.$el = $('#unicode-table');
      this.$selector = $('#scope-selector');
      this.$ranges.start = $('#scope-start');
      this.$ranges.end = $('#scope-end');
    }
  }, {
    key: 'version',
    get: function get() {
      return version;
    },
    set: function set(val) {
      this._version = val;
    }
  }, {
    key: 'build',
    get: function get() {
      return this._build;
    },
    set: function set(val) {
      this._build = val;
    }
  }]);

  return app;
}();