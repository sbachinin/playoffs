/**
 * @jest-environment jsdom
 */

global.ResizeObserver = require('resize-observer-polyfill')
const { createPlayoffs } = require('../index.js').easyPlayoffs

// TODO rewrite survival tests to 'render empty shell' tests
test('survives when non-string name is provided for a round', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{ name: false }],
            matches: [],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})



test('survives when data.matches is undefined', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})

test('survives when data.matches are not an array', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [],
            matches: true,
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})


test('survives when string is given for a match', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [],
            matches: ['fdsdfsd'],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})




test('survives when match is an empty object', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [],
            matches: [{}],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})


test('survives when match.id is not a string', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [],
            matches: [{ id: true }],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})



test('survives without match.roundIndex', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{ id: 'fdfds' }],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})


test('survives when match.roundIndex is not a number', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{ id: '32323', roundIndex: true }],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})

test('survives when match.order is not a number', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{ id: '32323', roundIndex: 0, order: [] }],
            contestants: {}
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})



test('survives when player has no title', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{
                id: '32323', roundIndex: 0, order: 0,
                sides: [{ contestantId: 'contestant1', score: [] }]
            }
            ],
            contestants: {
                contestant1: { players: [{}] }
            }
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})


test('survives when player has non-string title', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{
                id: '32323', roundIndex: 0, order: 0,
                sides: [{ contestantId: 'contestant1', score: [] }]
            }
            ],
            contestants: {
                contestant1: { players: [{ title: false }] }
            }
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})


test('survives when player has non-string nationality', () => {
    const wrapper = document.createElement('div')
    document.body.append(wrapper)

    expect.assertions(1)

    createPlayoffs(
        {
            rounds: [{}],
            matches: [{
                id: '32323', roundIndex: 0, order: 0,
                sides: [{ contestantId: 'contestant1', score: [] }]
            }
            ],
            contestants: {
                contestant1: { players: [{ title: 'fdf', nationality: false }] }
            }
        },
        wrapper,
        {}
    )
    expect(true).toBe(true)
})

