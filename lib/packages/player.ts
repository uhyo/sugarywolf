import {
    IEventHost,
    makeEvent,
} from '../event';
import {
    Game,
} from '../game';
import {
    IPackage,
    makePackage,
} from '../package';

/**
 * Player id.
 */
export type PlayerId = string;

/**
 * Player information.
 */
export interface IPlayer {
    /**
     * ID of player.
     */
    id: PlayerId;
    /**
     * Name of player.
     */
    name: string;

    /**
     * Whether this player is dead.
     */
    dead: boolean;
}

/**
 * Event that indicates a player died.
 */
export interface IDieEvent {
    id: PlayerId;
    reason: string;
}

/**
 * Internal package of player.
 */
export class Player {
    /**
     * Event that indicates a player died.
     */
    public readonly die: IEventHost<IDieEvent>;
    /**
     * Map from player's id to Player.
     */
    private players: Map<PlayerId, IPlayer>;

    constructor(private game: Game) {
        this.players = new Map();

        this.die = makeEvent(game, {
            default: ({id})=> {
                const pl = this.players.get(id);
                if (pl != null) {
                    pl.dead = true;
                }
            },
            name: 'die',
        });
    }

    /**
     * Add a player to the game.
     */
    public add(id: PlayerId, name: string): void {
        const p = {
            dead: false,
            id,
            name,
        };
        this.players.set(id, p);
    }

    /**
     * Get a player by its id.
     */
    public get(id: PlayerId): Readonly<IPlayer> | null {
        return this.players.get(id) || null;
    }

    /**
     * Get the list of players.
     */
    public all(): Iterator<[PlayerId, IPlayer]> {
        return this.players.entries();
    }
}

/**
 * Package that maintains players in a game.
 */
export const player = makePackage<Player>('core.player')(Player);
