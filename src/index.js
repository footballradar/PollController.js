//torn about classes/factory here
//we could open source this - Gary ;)

export function createPollController() {
    return Object.create(PollController);
}

const PollController = {
    _actions: {},
    _nextActionId: 0,
    _freq: 1000,
    _invokeOnStart: false,
  
    configure({actions, freq, invokeOnStart}) {
        //this could use the merge thing from lodash
        const clearFns = actions.reduce((acc, action) => {
            const clearFn = this.addAction(action);
            acc.push(clearFn);
            return acc;
        }, []);

        this._freq = freq || this._freq;
        this._invokeOnStart = invokeOnStart || this._invokeOnStart;
        
        return clearFns;
    },

    start() {
        this.isPolling() && this.stop();

        this._interval = setInterval(() => {
            this._invokeActions();
        }, this._freq);

        if (this._invokeOnStart) {
            this._invokeActions();
        }
    },

    stop() {
        clearInterval(this._interval);
        this._interval = false;
    },

    isPolling() {
        return !!this._interval;
    },

    addAction(action) {
        const id = this._nextActionId;
        this._nextActionId++;
        
        this._actions[id] = action;        
        return () => this._removeAction(id);
    },

    _invokeActions() {
        Object.keys(this._actions).forEach((k) => this._actions[k]());
    },
    
    _removeAction(id){
        delete this._actions[id];
    }
};
