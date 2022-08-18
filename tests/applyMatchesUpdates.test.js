/**
 * @jest-environment jsdom
 */

global.ResizeObserver = require('resize-observer-polyfill')
const { createPlayoffs } = require('../index.js').easyPlayoffs
const finished_ucl = require('./ucl-finished.js').default

const init = () => {
    document.body.innerHTML = ''
    const wrapper = document.createElement('div')
    document.body.append(wrapper)
    return wrapper
}




test('getAllData returns a new match supplied by applyMatchesUpdates in place of an old match', () => {
    const wrapper = init()

    const pl = createPlayoffs(finished_ucl, wrapper)

    const new_match = {
        id: 'some_id',
        round_index: 1,
        order: 2,
        sides: [ { contestant_id: 'c123', score: [{ main_score: '666' }] } ]
    }

    pl.applyMatchesUpdates([ new_match ])

    const all_matches = pl.getAllData().matches
    expect(all_matches.length).toBe(15)

    const matches_in_this_position = all_matches.filter(m => m.round_index === 1 && m.order === 2)
    expect(matches_in_this_position.length).toBe(1)
    expect(matches_in_this_position[0]).toEqual(new_match)
});




test('draws a new score for a match updated by applyMatchesUpdates', () => {
    const wrapper = init()

    const pl = createPlayoffs(finished_ucl, wrapper)

    const new_match = {
        id: 'some_id',
        round_index: 1,
        order: 2,
        sides: [ { contestant_id: 'c123', score: [{ main_score: '666' }] } ]
    }

    pl.applyMatchesUpdates([ new_match ])

    const updated_match_score_el = wrapper.querySelectorAll('.round-wrapper')[1]
        .querySelectorAll('.match-wrapper')[2]
        .querySelector('.main-score')
    expect(updated_match_score_el.textContent.trim()).toBe(new_match.sides[0].score[0].main_score)
});



test('applyMatchesUpdates creates new match if none was present for this round_id and order', () => {
    const wrapper = init()

    const pl = createPlayoffs(
        {
            rounds: [ { name: 'Some round' } ],
            matches: [],
            contestants: {
                c1: {
                    players: [
                        {
                            title: 'John Doe'
                        }
                    ]
                },
            }
        },
        wrapper
    )

    expect(wrapper.querySelector('.main-score')).toBe(null);

    const new_match = {
        id: '32323',
        round_index: 0,
        order: 0,
        sides: [
            { contestant_id: 'c1', score: [{ main_score: '6' }] },
        ]
    }

    pl.applyMatchesUpdates([ new_match ])

    expect(wrapper.querySelector('.main-score').innerHTML).toBe('6');

    expect(pl.getAllData().matches[0]).toEqual(new_match)
});
