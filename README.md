# PollController.js

It's just an interval which runs mulitple functions. For example you may want to poll a settings endpoint and a status endpoint every 3 seconds. With a `pollController` we can have both of these functions run of the same loop and that loop is managed in one place. 

# Installing
`npm install pollcontroller`
At the moment we are only publishing to npm.

# Getting Started
```
import {createPollController} from "pollcontroller"

const frequentPoller = createPollController();

const clearFrequentActions = frequentPoller.configure({
    actions: [YOUR_FUNCS],
    freq: 2000,
    invokeOnStart: true
});

frequentPoller.start();
```

This is the basic usage of the poller. There will now be one interval running ever 2 seconds, running all the actions you have supplied. 

# API
See `src/index.js` for API docs.

# License

MIT
