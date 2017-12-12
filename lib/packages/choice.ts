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
import {
    PlayerId,
} from './player';

/**
 * A control of a choice.
 */
export interface IControl {
    /**
     * Options of this selection.
     */
    options: IOption[];
    type: 'select';
    /**
     * Current selected value.
     */
    value: number | null;
}

/**
 * An option of a select control.
 */
export type IOption = IPlayerOption | IStringOption;

export interface IPlayerOption {
    /**
     * player id.
     */
    id: PlayerId;
    type: 'player';
}
export interface IStringOption {
    /**
     * shown string. (TODO i18n)
     */
    title: string;
    type: 'string';
}

/**
 * Event to open a choice.
 */
export interface IOpenChoiceEvent {
    /**
     * Shown controls.
     */
    controls: IControl[];
    /**
     * ID of player to which this choice is shown.
     */
    to: PlayerId;
    /**
     * Type of choice.
     */
    type: string;
}

/**
 * Choice.
 */
export interface IChoice {
    /**
     * Controls.
     */
    controls: IControl[];
    /**
     * Type of choice.
     */
    type: string;
}

/**
 * Internal package of choice.
 */
export class Choice {
    /**
     * Event to open a choice.
     */
    public openChoice: IEventHost<IOpenChoiceEvent>;
    /**
     * Map from player's id to open choices.
     */
    private choices: Map<PlayerId, IChoice[]>;

    constructor(private game: Game) {
        this.choices = new Map();

        this.openChoice = makeEvent(game, {
            default: ({
                controls,
                to,
                type,
            })=> {
                // default action is to add a new choice to choices.
                const cs = this.choices.get(to) || [];
                cs.push({
                    controls,
                    type,
                });
                this.choices.set(to, cs);
            },
            name: 'openChoice',
        });
    }

    /**
     * Get the list of choices open to a given player.
     */
    public getFor(id: PlayerId): IterableIterator<IChoice> {
        const arr = this.choices.get(id);
        if (arr == null) {
            // TODO???
            return [][Symbol.iterator]();
        } else {
            return arr[Symbol.iterator]();
        }
    }
}

/**
 * Package that maintains choices shown to a player.
 */
export const choice = makePackage<Choice>('core.choice')(Choice);
