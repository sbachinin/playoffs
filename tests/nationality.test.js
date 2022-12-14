/**
 * @jest-environment jsdom
 */

global.ResizeObserver = require('resize-observer-polyfill')
const { init } = require('./utils.js')

const consoleWarn = jest.spyOn(console, 'warn')
afterEach(jest.clearAllMocks)





// IF getNationalityHTML is missing / invalid

test(`renders empty .nationality IF player has NO nationality AND getNationalityHTML is NOT provided`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: { c1: { players: [{ title: 'Josh' }] } }
    }

    const { wrapper } = init(data)

    expect((wrapper.querySelector('.player-wrapper .nationality')).innerHTML).toBe('')
})


test(`renders empty .nationality IF player has NON-STRING nationality AND getNationalityHTML is NOT provided`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: { c1: { players: [{ title: 'Josh', nationality: {} }] } }
    }

    const { wrapper } = init(data)

    expect((wrapper.querySelector('.player-wrapper .nationality')).innerHTML).toBe('')
})


test(`renders player's VALID nationality as such if getNationalityHTML is NOT provided`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: { c1: { players: [{ title: 'Josh', nationality: 'US' }] } }
    }

    const { wrapper } = init(data)

    expect((wrapper.querySelector('.player-wrapper .nationality')).innerHTML).toBe('US')
})


test(`renders player's VALID nationality as such if getNationalityHTML is INVALID (not a function)`, async () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: { c1: { players: [{ title: 'Josh', nationality: 'US' }] } }
    }

    const { wrapper } = init(data, { getNationalityHTML: { value: 'asshole' } })

    expect((wrapper.querySelector('.player-wrapper .nationality')).innerHTML).toBe('US')
    await new Promise(r => setTimeout(r, 0))
    expect(consoleWarn.mock.calls[0][0]).toMatch(`Impossible value provided for "getNationalityHTML" option`)
})

test(`renders html provided as player's nationality (when no options.getNationalityHTML)`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: {
                players: [{
                    nationality: '<span class="user-nationality" style="width: 36px">US</span>',
                }]
            }
        }
    }

    const { wrapper } = init(data)
    expect(
        getComputedStyle(
            wrapper.querySelector('.player-wrapper .nationality .user-nationality')
        ).width
    ).toBe('36px')
})















// How getNationalityHTML is called

test(`calls getNationalityHTML with a player object`, () => {
    getNationalityHTML = jest.fn()
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'US' }] }
        }
    }

    init(data, { getNationalityHTML })

    expect(getNationalityHTML.mock.calls[0][0]).toEqual({ title: 'Pete', nationality: 'US' })
})


test(`calls getNationalityHTML with a player object, even if its nationality is not a string`, () => {
    getNationalityHTML = jest.fn()
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: { value: 'asshole' } }] }
        }
    }

    init(data, { getNationalityHTML })

    expect(getNationalityHTML.mock.calls[0][0]).toEqual(
        { title: 'Pete', nationality: { value: 'asshole' } }
    )
})


test(`calls getNationalityHTML for ALL players, even those with missing or invalid nationality`, () => {
    getNationalityHTML = jest.fn()

    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }, { contestantId: 'c2' }] }],
        contestants: {
            c1: {
                players: [
                    { title: 'Pete', nationality: 'US' },
                    { title: 'Ivan' }
                ]
            },
            c2: {
                players: [
                    { title: 'Pavel', nationality: {} },
                    { title: 'Mario', nationality: 'IT' }
                ]
            }
        }
    }

    init(data, { getNationalityHTML })
    expect(getNationalityHTML).toHaveBeenCalledTimes(4)
})


test(`renders bare player.nationality if getNationalityHTML is provided but it's not a function`, async () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'US' }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: [] })
    expect(wrapper.querySelector('.nationality').textContent).toBe('US')
    await new Promise(r => setTimeout(r, 0))
    expect(consoleWarn.mock.calls[0][0]).toMatch(`Impossible value provided for "getNationalityHTML" option`)
})


test(`renders bare player.nationality if getNationalityHTML throws`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'US' }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => { very.bad() } })
    expect(wrapper.querySelector('.nationality').textContent).toBe('US')
    expect(consoleWarn.mock.calls[0][0]).toMatch(`Failed to get a string from getNationalityHTML`)
})


test(`calls getNationalityHTML with context object as 2nd arg`, () => {
    getNationalityHTML = jest.fn()
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'US' }] }
        }
    }

    init(data, { getNationalityHTML })

    expect(getNationalityHTML.mock.calls[0][1]).toEqual({
        roundIndex: 0,
        matchOrder: 0,
        contestantId: 'c1',
        playerIndex: 0
    })
})













// How a return value of getNationalityHTML is used

test(`injects the return value of getNationalityHTML even if player has no nationality`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete' }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: n => `I am an asshole` })
    expect(wrapper.querySelector('.player-wrapper .nationality').innerHTML).toBe('I am an asshole')
})

test(`injects the return value of getNationalityHTML even if player's nationality is not a string`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: {} }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: n => `I am an asshole` })
    expect(wrapper.querySelector('.player-wrapper .nationality').innerHTML).toBe(`I am an asshole`)
    expect(consoleWarn.mock.calls[0][0]).toMatch(`If nationality is provided for a player, it must be a string`)
})

test(`injects a valid return value of getNationalityHTML to ALL players`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }, { contestantId: 'c2' }] }],
        contestants: {
            c1: {
                players: [
                    { title: 'Pete', nationality: 'US' },
                    { title: 'Ivan' }
                ]
            },
            c2: {
                players: [
                    { title: 'Pavel', nationality: 'PO' },
                    { title: 'Mario', nationality: 'IT' }
                ]
            }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => 'foo' })
    const nat_elements = [...wrapper.querySelectorAll('.player-wrapper .nationality')]
    const all_players_have_foo = nat_elements.every(el => el.innerHTML === 'foo')
    expect(all_players_have_foo).toBe(true)
})

test(`Falls back to bare player's nationality (valid one) IF getNationalityHTML returns invalid value`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'CAN' }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => 23232 })
    expect(wrapper.querySelector('.player-wrapper .nationality').innerHTML).toBe(`CAN`)
    expect(consoleWarn.mock.calls[0][0]).toMatch('Failed to get a string from getNationalityHTML')
})



test(`Falls back to bare player's nationality (valid one) IF getNationalityHTML returns undefined`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: 'CAN' }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => { } })
    expect(wrapper.querySelector('.player-wrapper .nationality').innerHTML).toBe(`CAN`)
    expect(consoleWarn.mock.calls[0][0]).toMatch('Failed to get a string from getNationalityHTML')
})


test(`renders empty .nationality if both player's nationality and getNationalityHTML's return value are invalid`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: {
            c1: { players: [{ title: 'Pete', nationality: Object }] }
        }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => 23232 })
    expect(wrapper.querySelector('.player-wrapper .nationality').innerHTML).toBe('')
})


test(`nationality element takes no space if empty string is returned from getNationalityHTML
    (even if there is a valid nationality for a player)`, () => {
    const data = {
        rounds: [{}],
        matches: [{ roundIndex: 0, order: 0, sides: [{ contestantId: 'c1' }] }],
        contestants: { c1: { players: [{ nationality: 'GE', title: 'Josh' }] } }
    }

    const { wrapper } = init(data, { getNationalityHTML: () => '' })
    const el = wrapper.querySelector('.side-wrapper[contestant-id="c1"] .nationality')
    expect(el.innerHTML).toBe('')
    expect(getComputedStyle(el).padding).toBe('0px')
    expect(getComputedStyle(el).margin).toBe('0px')
    expect(getComputedStyle(el).width).toBe('auto')
})

