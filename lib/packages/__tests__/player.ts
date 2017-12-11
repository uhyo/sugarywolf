import {
    Game,
} from '../../game';
import player from '../player';

describe('Player module', ()=> {
    let p: any;
    let game: Game;
    beforeEach(()=> {
        game = new Game();
        p = player.make(game);
    });

    it('name', ()=> {
        expect(player.name).toBe('core.player');
    });

    it('remembers added player', ()=> {
        p.add('player1', 'Player');

        expect(p.get('player1')).toMatchSnapshot();
    });

    it('non-added player is null', ()=> {
        p.add('player1', 'Player');

        expect(p.get('foobar')).toBeNull();
    });

    it('iterates all players', ()=> {
        p.add('player1', 'Player');
        p.add('player2', 'Player2');

        const pls = Array.from(p.all());
        expect(pls).toMatchSnapshot();
    });

    describe('die event', ()=> {
        it('kills player for die event', ()=> {
            p.add('player1', 'Player');

            expect(p.get('player1').dead).toBe(false);
            p.die.emit({
                id: 'player1',
                reason: 'foo',
            });
            expect(p.get('player1').dead).toBe(true);
        });
        it('no error when killing nonexistent player', ()=> {
            p.die.emit({
                id: 'foo',
                reason: 'bar',
            });
        });
    });
});
