import { is_object } from './utils/utils.mjs'

/*
    SHAPE:

[
    {
        name?: string,
        matches: [
            {
                id?: string,
                order: number,
                sides: [
                    {
                        id: string, (required if team history is highlightable)
                        short_title: string,
                        nationality: string,
                        seed?: number,
                        entry_status?: string, // tennis: Q / WC / LL / A / SR / LD
                        score: [
                            {
                                main_score: number | string,
                                tie_break?: number
                            }
                        ]
                        isWinner: boolean
                    }
                ]
            }
        ]
    }
]
*/

const err = (msg, actual_data) => {
    throw `Incorrect data. ${msg} ${actual_data ? JSON.stringify(actual_data) : ''}`
}

export const validate_data = (all_rounds_data, options) => {
    
    if (!Array.isArray(all_rounds_data)) {
        err('Expected an array of rounds, instead got: ', all_rounds_data)
    }

    if (all_rounds_data.length === 0) {
        err('At least 1 round must be provided')
    }
    
    all_rounds_data.forEach(round => {
        if (!is_object(round)) {
            err('Round must be an object, instead got: ', round)
        }

        if (!Array.isArray(round.matches)) {
            err('Expected an array of matches, instead got: ', round.matches)
        }

        if (round.matches.length === 0) {
            err('Must be at least 1 match in round: ', round)
        }

        round.matches?.forEach(match => {
            if (!is_object(match)) {
                err('Expected a match object, instead got: ', match)
            }
            if (typeof match.id !== 'undefined' && typeof match.id !== 'string') {
                err(`Match id must be a string: `, match)
            }
            if (typeof match.order !== 'number') {
                err(`Match's order property must be a number, instead got: `, match.order)
            }
    
            if (!Array.isArray(match.sides)) {
                err(`Match's sides property must be an array, instead got: `, match.sides)
            }
            if (match.sides.length < 2) {
                err('Match must have 2 sides: ', match)
            }
            let have_match_winner = false
            match.sides.forEach?.(side => {
                if (!is_object(side)) {
                    err(`Match's side must be an object, instead got: `, side)
                }

                if (options.highlight_team_history_on_click
                    && typeof side.id !== 'string') {
                    err(`side must have an id property if options.highlight_team_history_on_click is true: `, side)
                }

                if (typeof side.seed !== 'undefined' && typeof side.seed !== 'number') {
                    err('If side.seed is provided, it must be a number, instead got: ', side.seed)
                }
                if (typeof side.entry_status !== 'undefined' && typeof side.entry_status !== 'string') {
                    err('If side.entry_status is provided, it must be a string, instead got: ', side.entry_status)
                }
                if (typeof side.short_title !== 'string') {
                    err('Side.short_title must be a string, instead got: ', side.short_title)
                }

                // check for nationality if options are set to show nationality

                if (!Array.isArray(side.score)) {
                    err('Side.score must be an array, instead got: ', side.score)
                }
                side.score.forEach(single_set_score => {
                    if (!is_object(single_set_score)) {
                        err(`Score must be an object, instead got: `, single_set_score)
                    }
                    if (
                        typeof single_set_score.main_score !== 'number'
                        && typeof single_set_score.main_score !== 'string'
                    ) {
                        err('Side.score.main_score must be a number or a string, instead got: ', single_set_score.main_score)
                    }
                    if (
                        typeof single_set_score.tie_break !== 'number'
                        && typeof single_set_score.tie_break !== 'undefined'
                    ) {
                        err('Side.score.tie_break must be a number or undefined, instead got: ', single_set_score.tie_break)
                    }
                })
                if (side.isWinner) have_match_winner = true
            })
            if (!have_match_winner) {
                err('Winning side must have a { isWinner: true } property: ', match)
            }
            
        })
    })
}
