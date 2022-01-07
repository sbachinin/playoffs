import { is_object } from './utils/utils.mjs'

/*
DESIRABLE SHAPE:
[
    {
        name?: string,
        matches: [
            {
                order: number,
                sides: [
                    {
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
    throw `Incorrect data. ${msg} ${JSON.stringify(actual_data)}`
}

export const validate_data = all_rounds_data => {
    
    if (!Array.isArray(all_rounds_data)) {
        err('Expected an array of rounds, instead got: ', all_rounds_data)
    }
    
    all_rounds_data.forEach(round => {
        if (!is_object(round)) {
            err('Round must be an object, instead got: ', round)
        }

        if (!Array.isArray(round.matches)) {
            err('Expected an array of matches, instead got: ', round.matches)
        }
        round.matches?.forEach(match => {
            if (!is_object(match)) {
                err('Expected a match object, instead got: ', match)
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
                    return
                }
                if (typeof side.short_title !== 'string') {
                    err('side.short_title must be a string, instead got: ', side.short_title)
                }

                // check for nationality if options are set to show nationality

                if (!Array.isArray(side.score)) {
                    err('side.score must be an array, instead got: ', side.score)
                }
                side.score.forEach(single_set_score => {
                    if (!is_object(single_set_score)) {
                        err(`score must be an object, instead got: `, single_set_score)
                    }
                    if (
                        typeof single_set_score.main_score !== 'number'
                        && typeof single_set_score.main_score !== 'string'
                    ) {
                        err('side.score.main_score must be a number or a string, instead got: ', single_set_score.main_score)
                    }
                    if (
                        typeof single_set_score.tie_break !== 'number'
                        && typeof single_set_score.tie_break !== 'undefined'
                    ) {
                        err('side.score.tie_break must be a number or undefined, instead got: ', single_set_score.tie_break)
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
