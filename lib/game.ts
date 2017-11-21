import {
    IModule,
} from './module';
import {
    IPackage,
} from './package';
/**
 * A game which holds modules.
 */
export class Game {
    private modules: Record<string, IModule>;
    constructor() {
        this.modules = {};
    }
    /**
     * Add an extension to this game.
     */
    public use<M extends IModule>(extension: IPackage<M>): void {
        this.modules[extension.name] = extension.make(this);
    }
}
