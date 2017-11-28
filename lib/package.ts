import {
    Game,
} from './game';
import {
    IModule,
} from './module';
/**
 * An extension to Game.
 */
export interface IPackage<G extends object, M extends IModule>{
    /**
     * Name of this package.
     */
    name: string;
    /**
     * Get a module associated to a Game.
     */
    get(g: G): M | null;
    /**
     * Make a module for `g`.
     */
    make(g: G): M;
}

/**
 * Constructor of a module.
 */
export interface IModuleConstructor<G, M extends IModule> {
    new(g: G): M;
}
/**
 * Package object.
 */
export class Package<G extends object, M extends IModule> implements IPackage<G, M> {
    public name: string;
    private states: WeakMap<G, M>;
    private modConstructor: IModuleConstructor<G, M>;

    constructor(name: string, mod: IModuleConstructor<G, M>) {
        this.name = name;
        this.states = new WeakMap();
        this.modConstructor = mod;
    }
    public get(g: G): M | null {
        // return this.states.get(g, null);
        return this.states.get(g) || null;
    }
    public make(g: G): M {
        const res = new this.modConstructor(g);
        this.states.set(g, res);
        return res;
    }
}

/**
 * A function that makes given module a package.
 */
export type PackageGenerator<G extends object, M extends IModule> = (mod: IModuleConstructor<G, M>)=> IPackage<G, M>;

/**
 * Generator function for packages.
 */
export function makePackage<M extends IModule>(name: string): PackageGenerator<Game, M> {
    return (mod: IModuleConstructor<Game, M>)=> new Package(name, mod);
}
