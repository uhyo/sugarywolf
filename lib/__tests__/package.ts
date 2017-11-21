// Tests for Package functionality.
import {
    makePackage,
    Package,
} from '../package';

describe('Package', ()=> {
    it('remembers its name', ()=> {
        class SampleModule {}
        const p = new Package('test.module', SampleModule);

        expect(p.name).toBe('test.module');
    });
    it('initializes given module when make', ()=> {
        const cl = jest.fn();

        const p = new Package('test.module', cl);
        const game = {};

        expect(cl).not.toHaveBeenCalled();

        const res = p.make(game);
        // constructor should be called once
        expect(cl).toHaveBeenCalledTimes(1);
        // Result of make should be the result of new
        expect(res).toBe(cl.mock.instances[0]);
    });
    it('stores module for each game', ()=> {
        const cl = jest.fn();

        const p = new Package('test.module', cl);
        const game1 = {};
        const game2 = {};

        const res = p.make(game1);

        // Package should remember a module for game1
        expect(p.get(game1)).toBe(res);

        // game2 is not initialized yet
        expect(p.get(game2)).toBe(null);
    });
});
describe('makePackage', ()=>{
    it('initializes a package with given name', ()=> {
        const cl = jest.fn();
        const p = makePackage('test.module')(cl);

        expect(p).toBeInstanceOf(Package);
        expect(p.name).toBe('test.module');

        const res = p.make({} as any);
        expect(res).toBe(cl.mock.instances[0]);
    });
});
