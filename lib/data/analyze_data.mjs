import { is_object } from '../utils/utils.mjs'
import { halt } from './handle_errors.mjs'

/*
    SHAPE:

{
    rounds: [ // you have to provide an object for every round
        {
            name?: string,
            matches: [ // it's not necessary to provide objects for future matches
                {
                    id?: string,
                    order: number, // 0-based
                    sides?: [
                        {
                            id: string, (required if team history is highlightable)
                            
                            score?: [
                                {
                                    main_score: number | string, // May contain divergent results like 'W/O' or 'Ret' in tennis
                                    tie_break?: number
                                }
                            ]
                            isWinner?: boolean
                        }
                    ]
                }
            ]
        }
    ],

    teams: {
        [id]: {
            title: string,
            nationality_code?: string,
            flag_url?: string,
            entry_status?: string, // tennis: 'Q' | 'WC' | 'LL' | 'A' | 'SR' | 'LD' | number
        }
    }
}

*/

export const ananlyze_data = (all_data, options) => {
    if (!Array.isArray(all_data.rounds)) {
        halt('Expected an array of rounds, instead got: ', all_data.rounds)
    }

    if (all_data.rounds.length === 0) {
        halt('At least 1 round must be provided')
    }

    all_data.rounds.forEach(round => {
        if (!is_object(round)) {
            halt('Round must be an object, instead got: ', round)
        }

        if (!Array.isArray(round.matches)) {
            halt('Expected an array of matches, instead got: ', round.matches)
        }

        round.matches?.forEach(match => {
            if (!is_object(match)) {
                halt('Expected a match object: ', match)
            }
            if (match.id !== undefined && typeof match.id !== 'string') {
                halt(`Match id must be a string: `, match)
            }
            if (match.order === undefined) {
                halt('Match must contain .order property: ', match)
            }
            
            if (match.order !== undefined && typeof match.order !== 'number') {
                halt(`If you provide match.order property, it must be a number: `, match)
            }

            if (match.sides !== undefined && !Array.isArray(match.sides)) {
                halt(`If match.sides is provided, it must be an array: `, match)
            }
            match.sides && match.sides.forEach?.(side => {
                if (!is_object(side)) {
                    halt(`Match's side must be an object: `, match)
                }

                if (options.highlight_team_history_on_click
                    && typeof side.id !== 'string') {
                    halt(`Side must have an id property if options.highlight_team_history_on_click is true: `, side)
                }

                side.score !== undefined
                    && !Array.isArray(side.score)
                    && halt('Side.score must be an array: ', side)

                side.score !== undefined
                    && side.score.forEach(single_set_score => {
                        if (!is_object(single_set_score)) {
                            halt(`Score must be an object: `, side)
                        }
                        if (single_set_score.main_score === undefined) {
                            halt('If you provide a side.score, it must contain a "main_score" property', side)
                        }
                        if (
                            typeof single_set_score.main_score !== 'number'
                            && typeof single_set_score.main_score !== 'string'
                        ) {
                            halt('Side.score.main_score must be a number or a string: ', side)
                        }
                        if (
                            typeof single_set_score.tie_break !== 'number'
                            && typeof single_set_score.tie_break !== 'undefined'
                        ) {
                            halt('Side.score.tie_break must be a number or undefined: ', side)
                        }
                    })
            })
        })
    })

    Object.values(all_data.teams).forEach(team_meta => {
        if (typeof team_meta.title !== 'string') {
            halt('Team must have a title, and it must be a string: ', team_meta)
        }

        if (typeof team_meta.entry_status !== 'undefined' && typeof team_meta.entry_status !== 'string') {
            halt('If entry_status is provided for a team, it must be a string: ', team_meta)
        }

        if (typeof team_meta.nationality_code !== 'undefined' && typeof team_meta.nationality_code !== 'string') {
            // may also check for the length of this code...
            halt('If nationality_code is provided for a team, it must be a string: ', team_meta)
        }

        if (typeof team_meta.flag_url !== 'undefined' && typeof team_meta.flag_url !== 'string') {
            halt('If flag_url is provided for a team, it must be a string: ', team_meta)
        }
    })
}
