import {
    Game,
} from '../game';
import {
    makePackage,
} from '../package';

/**
 * PLayer id.
 */
export type PlayerId = string;

/**
 * Player information.
 */
export interface IPlayer {
    id: PlayerId;
    name: string;
}

/**
 * Package that maintains players in a game.
 */
export default makePackage('core.players')(class Players {
    /**
     * Map from player's id to Player.
     */
    private players: Map<PlayerId, IPlayer>;

    constructor(private game: Game) {
        this.players = new Map();
    }

    /**
     * Add a player to the game.
     */
    public add(id: PlayerId, name: string): void {
        const player = {
            id,
            name,
        };
        this.players.set(id, player);
    }

    /**
     * Get a player by its id.
     */
    public get(id: PlayerId): Readonly<IPlayer> | null {
        return this.players.get(id) || null;
    }
});
