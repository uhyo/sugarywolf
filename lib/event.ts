import {
    EventEmitter,
} from 'events';
import {
    Game,
} from './game';

export type EventListener<P> = (arg: P)=> void;

/**
 * Specification of an event.
 */
export interface IEventSpec<P> {
    /**
     * Name of this event.
     */
    name: string;
    /**
     * Default action.
     */
    default?: EventListener<P>;
}

/**
 * Host of an event.
 */
export interface IEventHost<P> {
    /**
     * Name of this event.
     */
    name: string;
    /**
     * Add a new listener for this event.
     * @param listener new listener.
     */
    addListener(listener: EventListener<P>): void;
    /**
     * Add a new listener for this event.
     * @param listener new listener.
     */
    on(listener: EventListener<P>): void;
    /**
     * Remove a new listener for this event.
     * @param listener listener to remove.
     */
    removeListener(listener: EventListener<P>): void;
    /**
     * Emit an event.
     * @param payload Payload for an emit.
     */
    emit(payload: P): void;
}

class EventHost<P> implements IEventHost<P> {
    /**
     * Name of this event.
     */
    public readonly name: string;
    private readonly game: Game;
    private readonly emitter: EventEmitter;
    private readonly eventName = 'message';
    private readonly defaultActionEventName = 'default';
    private readonly defaultAction: EventListener<P>;

    constructor(game: Game, spec: IEventSpec<P>) {
        this.name = spec.name;
        this.game = game;
        this.defaultAction = spec.default ||
            // tslint:disable-next-line: no-empty
            (()=> {});

        // EventEmitter for this event
        this.emitter = new EventEmitter();
        // Register a default action
        this.emitter.on(this.defaultActionEventName, this.defaultAction);
    }
    public addListener(listener: EventListener<P>): void {
        this.on(listener);
    }
    public on(listener: EventListener<P>): void {
        this.emitter.on(this.eventName, listener);
    }
    public removeListener(listener: EventListener<P>): void {
        this.emitter.removeListener(this.eventName, listener);
    }
    public emit(payload: P): void {
        // Call registered listeners
        this.emitter.emit(this.eventName, payload);
        // Then call the default action
        this.emitter.emit(this.defaultActionEventName, payload);
    }
}

/**
 * Generate a new event host.
 */
export function makeEvent<P>(game: Game, spec: IEventSpec<P>): IEventHost<P> {
    return new EventHost(game, spec);
}
