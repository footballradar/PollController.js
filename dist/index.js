"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPollController = createPollController;
//torn about classes/factory here
//we could open source this - Gary ;)

function createPollController() {
    return Object.create(PollController);
}

var PollController = {
    _actions: {},
    _nextActionId: 0,
    _freq: 1000,
    _invokeOnStart: false,

    configure: function configure(_ref) {
        var _this = this;

        var actions = _ref.actions;
        var freq = _ref.freq;
        var invokeOnStart = _ref.invokeOnStart;

        //this could use the merge thing from lodash
        var clearFns = actions.reduce(function (acc, action) {
            var clearFn = _this.addAction(action);
            acc.push(clearFn);
            return acc;
        }, []);

        this._freq = freq || this._freq;
        this._invokeOnStart = invokeOnStart || this._invokeOnStart;

        return clearFns;
    },
    start: function start() {
        var _this2 = this;

        this.isPolling() && this.stop();

        this._interval = setInterval(function () {
            _this2._invokeActions();
        }, this._freq);

        if (this._invokeOnStart) {
            this._invokeActions();
        }
    },
    stop: function stop() {
        clearInterval(this._interval);
        this._interval = false;
    },
    isPolling: function isPolling() {
        return !!this._interval;
    },
    addAction: function addAction(action) {
        var _this3 = this;

        var id = this._nextActionId;
        this._nextActionId++;

        this._actions[id] = action;
        return function () {
            return _this3._removeAction(id);
        };
    },
    _invokeActions: function _invokeActions() {
        var _this4 = this;

        Object.keys(this._actions).forEach(function (k) {
            return _this4._actions[k]();
        });
    },
    _removeAction: function _removeAction(id) {
        delete this._actions[id];
    }
};