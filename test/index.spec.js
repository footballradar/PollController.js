import test from "tape";
import sinon from "sinon";

import {createPollController} from "../dist/index";

const noop = () => { };

test("configure: Should return an array of clear functions", (t) => {

    const poller = createPollController();
    const action = sinon.spy();

    const result = poller.configure({
        actions: [action]
    });

    t.ok(isArray(result));
    t.equal(result.length, 1);
    t.ok(typeof result[0] === "function");

    t.end();
});

test("start: Should call our spy function after default 1000ms", (t) => {
    t.plan(1);

    const poller = createPollController();
    const action = sinon.spy();

    poller.configure({
        actions: [action]
    });

    poller.start();

    setTimeout(() => {
        poller.stop();

        t.ok(action.calledOnce);
        t.end();
    }, 1000);
});

test("start: Should call our spy function after default 1000ms twice", (t) => {
    const poller = createPollController();
    const action = sinon.spy();

    poller.configure({
        actions: [action]
    });

    poller.start();

    setTimeout(() => {
        poller.stop();

        t.ok(action.calledTwice);
        t.end();
    }, 2100);
});

test("stop: Should prevent our spy function from being called a second time", (t) => {
    const poller = createPollController();
    const action = sinon.spy();

    poller.configure({
        actions: [action]
    });

    poller.start();

    setTimeout(() => {
        poller.stop();
    }, 1000);

    setTimeout(() => {
        t.ok(action.calledOnce);
        t.end();
    }, 2000);
});

test("freq: Should use the interval parameter if available", (t) => {
    const poller = createPollController();
    const action = sinon.spy();

    poller.configure({
        actions: [action],
        freq: 5000
    });

    poller.start();

    setTimeout(() => {
        t.ok(action.called === false);
    }, 1000);

    setTimeout(() => {
        t.ok(action.calledOnce);
        t.end();

        poller.stop();
    }, 5100);
});

test("invokeOnStart: Should instantly run the action before the first freq", (t) => {
    const poller = createPollController();
    const action = sinon.spy();

    poller.configure({
        actions: [action],
        freq: 5000,
        invokeOnStart: true
    });

    poller.start();
    poller.stop();

    t.ok(action.calledOnce);
    t.end();
});

function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}
