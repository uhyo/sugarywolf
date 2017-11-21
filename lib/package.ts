import {
    Game,
} from './game';
import {
    IModule,
} from './module';
/**
 * An extension to Game.
 */
export interface IPackage<M extends IModule>{
    /**
     * Name of this package.
     */
    name: string;
    /**
     * Get a module associated to a Game.
     */
    get(g: Game): M | null;
    /**
     * Make a module for `g`.
     */
    make(g: Game): M;
}

/**
 * Constructor of a module.
 */
export interface IModuleConstructor<M extends IModule> {
    new(g: Game): M;
}
/**
 * Package object.
 */
export class Package<M extends IModule> implements IPackage<M> {
    public name: string;
    private states: WeakMap<Game, M>;
    private modConstructor: IModuleConstructor<M>;

    constructor(name: string, mod: IModuleConstructor<M>) {
        this.name = name;
        this.states = new WeakMap();
        this.modConstructor = mod;
    }
    public get(g: Game): M | null {
        // return this.states.get(g, null);
        return this.states.get(g) || null;
    }
    public make(g: Game): M {
        const res = new this.modConstructor(g);
        this.states.set(g, res);
        return res;
    }
}

/**
 * A function that makes given module a package.
 */
export type PackageGenerator<M extends IModule> = (mod: IModuleConstructor<M>)=> IPackage<M>;

/**
 * Generator function for packages.
 */
export function makePackage<M extends IModule>(name: string): PackageGenerator<M> {
    return (mod: IModuleConstructor<M>)=> new Package(name, mod);
}
