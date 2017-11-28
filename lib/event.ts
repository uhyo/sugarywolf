import {
    EventEmitter,
} from 'events';
import {
    Game,
} from './game';

/**
 * Specification of an event.
 */
export interface IEventSpec {
    /**
     * Name of this event.
     */
    name: string;
}

export type EventListener<P> = (arg: P)=> void;

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
    constructor(name: string, game: Game) {
        this.name = name;
        this.game = game;

        this.emitter = new EventEmitter();
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
        this.emitter.emit(this.eventName, payload);
    }
}

/**
 * Generate a new event host.
 */
export function makeEvent<P>(game: Game, spec: IEventSpec): IEventHost<P> {
    return new EventHost(spec.name, game);
}

