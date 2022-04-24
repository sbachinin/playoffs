import { create_element_from_Html } from '../utils/utils.mjs'
import { get_match_scores_element } from './get_match_scores_element.mjs'

const dummy_item = '<div class="empty-item">&#8203;</div>'
const dummy_match_pair = `<div class="match-info-pair">${dummy_item}${dummy_item}</div>`

const populate_round_column = (match_count, actual_matches, get_match_info_pair_el) => {
    return Array.from(Array(match_count)).map((_, match_index) => {
        const maybe_match = actual_matches.find(m => m.order === match_index)
        if (maybe_match === undefined) {
            return dummy_match_pair
        }
        return get_match_info_pair_el(maybe_match)
    }).join('')
}

const get_title_item = (side, state) => `
    <div
        class="team-title-item ${side.id === state.highlighted_team_id ? 'highlighted' : ''}"
        team-id=${side.id}
    >
        ${side.title}
        &#8203;
    </div>
`


export const get_round_element = (round, rounds_count, round_index, state, options) => {
    const round_last_index = rounds_count - 1 - round_index
    const match_count = Math.pow(2, round_last_index)

    const el = create_element_from_Html(`
        <div class="round-wrapper" style="visibility: ${round_index < Math.floor(state.anchor_round_index) ? 'hidden' : 'visible'}">
            <div class="round-column entry-statuses">
                ${populate_round_column(
                    match_count,
                    round.matches,
                    (m) => `
                        <div class="match-info-pair" style="align-items: center;">
                            ${
                                m.sides[0]?.entry_status === undefined
                                ? dummy_item
                                : `<div>${m.sides[0]?.entry_status}&#8203;</div>`
                            }
                            ${
                                m.sides[1]?.entry_status === undefined
                                ? dummy_item
                                : `<div>${m.sides[1]?.entry_status}&#8203;</div>`
                            }
                        </div>
                    `
                )}
            </div>
            <div class="round-column nationalities"">
                ${populate_round_column(
                    match_count,
                    round.matches,
                    (m) => `
                        <div class="match-info-pair" style="align-items: center;">
                            ${
                                m.sides[0]?.nationality_code === undefined
                                ? dummy_item
                                : `<div>${m.sides[0]?.nationality_code}&#8203;</div>`
                            }
                            ${
                                m.sides[1]?.nationality_code === undefined
                                ? dummy_item
                                : `<div>${m.sides[1]?.nationality_code}&#8203;</div>`
                            }
                        </div>
                    `
                )}
            </div>
            <div class="round-column team-titles" style="align-items: flex-start;">
                ${populate_round_column(
                    match_count,
                    round.matches,
                    (m) => `
                        <div class="match-info-pair">
                            ${
                                m.sides[0]?.title === undefined
                                ? dummy_item
                                : get_title_item(m.sides[0], state)
                            }
                            ${
                                m.sides[1]?.title === undefined
                                ? dummy_item
                                : get_title_item(m.sides[1], state)
                            }
                        </div>
                    `
                )}
            </div>
            <div class="round-column result-mark"">
                ${populate_round_column(
                    match_count,
                    round.matches,
                    (m) => `
                        <div class="match-info-pair" style="align-items: center;">
                            ${
                                m.sides[0]?.result === 'winner'
                                ? options.winner_mark
                                : (
                                    m.sides[0]?.result === undefined
                                    ? dummy_item
                                    : `<div>${m.sides[0]?.result}&#8203;</div>`
                                )
                            }
                            ${
                                m.sides[1]?.result === 'winner'
                                ? options.winner_mark
                                : (
                                    m.sides[1]?.result === undefined
                                    ? dummy_item
                                    : `<div>${m.sides[1]?.result}&#8203;</div>`
                                )
                            }
                        </div>
                    `
                )}
            </div>
            <div class="round-column scores">
                ${populate_round_column(
                    match_count,
                    round.matches,
                    (m) => get_match_scores_element(m)
                )}
            </div>
        </div>

    `)
    return el
}