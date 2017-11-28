// Test for event utility.
import {
    makeEvent,
} from '../event';

describe('EventHost', ()=> {
    const gameMock: any = {};
    it('remembers its name', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        expect(h.name).toBe('test.event');
    });
    it('can add a listener by `on`', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        const handler = jest.fn();

        h.on(handler);

        h.emit({
            foo: 'hi',
        });

        expect(handler.mock.calls).toEqual([
            [{foo: 'hi'}],
        ]);
    });
    it('can add a listener by `addListener`', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        const handler = jest.fn();

        h.addListener(handler);

        h.emit({
            hoge: 3,
        });

        expect(handler.mock.calls).toEqual([
            [{hoge: 3}],
        ]);
    });
    it('calls listener for each emission', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        const handler = jest.fn();

        h.on(handler);

        h.emit({
            foo: 'hi',
        });
        h.emit({
            bar: 3,
        });
        h.emit({
            baz: true,
        });

        expect(handler.mock.calls).toEqual([
            [{foo: 'hi'}],
            [{bar: 3}],
            [{baz: true}],
        ]);
    });
    it('keeps order of registered handlers', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        const calls: any[] = [];

        const handler1 = (p: any)=> calls.push([0, p]);
        const handler2 = (p: any)=> calls.push([1, p]);

        h.on(handler1);
        h.on(handler2);

        h.emit({
            foo: 'hi',
        });

        expect(calls).toEqual([
            [0, {foo: 'hi'}],
            [1, {foo: 'hi'}],
        ]);
    });
    it('can remove listener by `removeListener`', ()=> {
        const h = makeEvent(gameMock, {
            name: 'test.event',
        });

        const calls: any[] = [];

        const handler1 = (p: any)=> calls.push([0, p]);
        const handler2 = (p: any)=> calls.push([1, p]);

        h.on(handler1);
        h.on(handler2);

        h.removeListener(handler1);

        h.emit({
            foo: 'hi',
        });

        expect(calls).toEqual([
            [1, {foo: 'hi'}],
        ]);
    });
});
