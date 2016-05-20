export function createPollController() {
    return Object.create(PollController);
}

const PollController = {
    _actions: {},
    _freq: 1000,
    _invokeOnStart: false,
  
    //@private - used internally only
    _nextActionId: 0,
    
    /**
     * Modify/set the actiotns, frequency and invokeOnStart settings
     * @param opts.actions {[function]} - An array of functions to run.
     * these functions do not get any params and the return value is ignored
     * @param opts.freq {number} - Default 1000. The frequency of the loop
     * @param opts.invokeOnStart {bool} - Default false. Invoke the actions on the start of the loop
     * rather than waiting for the first tick
     * 
     * @example
     * poller.cofigure({
     *  actions: [() => console.info("tick")],
     *  freq: 2000,
     *  invokeOnStart: true
     * });
     */
    configure({actions, freq, invokeOnStart}) {
        const clearFns = actions.reduce((acc, action) => {
            const clearFn = this.addAction(action);
            acc.push(clearFn);
            return acc;
        }, []);

        this._freq = freq || this._freq;
        this._invokeOnStart = invokeOnStart || this._invokeOnStart;
        
        return clearFns;
    },

    /**
     * Start the loop ticking, invoking the actions if invokeOnStart was passed to the configure function
     * 
     * @example
     * poller.start();
     */
    start() {
        this.isPolling() && this.stop();

        this._interval = setInterval(() => {
            this._invokeActions();
        }, this._freq);

        if (this._invokeOnStart) {
            this._invokeActions();
        }
    },

    /**
     * Stop the loop.
     */
    stop() {
        clearInterval(this._interval);
        this._interval = false;
    },

    /**
     * Is the loop currently ticking
     * @returns {bool} is polling
     */
    isPolling() {
        return !!this._interval;
    },

    /**
     * Add an action to the collection of actions to run per tick
     * @returns {function} - remove the action from the collection
     */
    addAction(action) {
        const id = this._nextActionId;
        this._nextActionId++;
        
        this._actions[id] = action;        
        return () => this._removeAction(id);
    },

    /**
     * execute the actions
     * @private
     */
    _invokeActions() {
        Object.keys(this._actions).forEach((k) => this._actions[k]());
    },
    
    /**
     * Remove an action from the collection. 
     * @private
     */
    _removeAction(id){
        delete this._actions[id];
    }
};
