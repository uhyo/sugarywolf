import {
    Game,
} from '../../game';
import {
    choice,
} from '../choice';

describe('Choice module', ()=> {
    let game: Game = new Game();
    let p = choice.make(game);
    beforeEach(()=> {
        game = new Game();
        p = choice.make(game);
    });

    it('name', ()=> {
        expect(choice.name).toBe('core.choice');
    });

    it('remembers added choice', ()=> {
        p.openChoice.emit({
            controls: [
                {
                    options: [],
                    type: 'select',
                    value: null,
                },
            ],
            to: 'player1',
            type: 'some-choice',
        });

        expect(Array.from(p.getFor('player1'))).toEqual([
            {
                controls: [
                    {
                        options: [],
                        type: 'select',
                        value: null,
                    },
                ],
                type: 'some-choice',
            },
        ]);
    });
    it('empty array for unknown player', ()=> {
        expect(Array.from(p.getFor('foobar'))).toEqual([]);
    });
});
