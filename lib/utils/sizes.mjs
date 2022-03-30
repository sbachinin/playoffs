import { get_main_canvas } from './utils.mjs'
import { find_match_data_by_id } from '../data/utils.mjs'
import { MAIN_CANVAS_MIN_HEIGHT } from '../constants.mjs'

export const get_round_left_X = (options, round_index, round_width) => {
    if (round_index === 0) return options.padding_left
    
    return options.padding_left
        + round_width * round_index
        + options.distance_between_rounds * round_index
}

export const get_all_content_width = (options, rounds_count, round_width) => {
    return (
        + rounds_count * round_width
        + (rounds_count-1) * options.distance_between_rounds
        + options.padding_left
        + options.padding_right
    )
}

export const get_round_title_height = options => {
    return options.round_titles_padding_top
        + options.round_title_font_size
        + options.round_title_margin_bottom
}

export const get_round_title_left_X = (round_scroll_left_X, round_width, options) => {
    switch (options.round_title_text_align) {
        case 'left': return round_scroll_left_X + options.round_title_hor_margin
        case 'center': return round_scroll_left_X + round_width/2
        case 'right': return round_scroll_left_X + round_width - options.round_title_hor_margin
    }
}

export const get_height_deficit_for_round = (
    match_count,
    options,
) => {
    return (
        get_matches_height_for_round(match_count, options)
        - get_main_canvas().height
    )
}

export const get_matches_height_for_round = (match_count, options) => {
    return (
        get_min_height_per_match(options) * match_count
        + options.matches_padding_top
        + options.matches_padding_bottom
    )
}

export const get_match_body_height = options => {
    return options.match_font_size * 3.1
}

export const get_min_height_per_match = options => {
    return get_match_body_height(options) + options.min_vert_margin_between_matches
}

export const is_round_visible_X = (round_width, round_scroll_X, options) => {
    return (round_scroll_X + round_width) > 0
        && (round_scroll_X - options.distance_between_rounds) < get_main_canvas().width
}

export const get_round_scroll_X = (round, state, options) => {
    return round.left_X - (options.auto_canvas_size ?  0 : state.scroll_X)
}

export const get_round_scroll_Y_px = (round, scroll_Y, options) => {
    const matches_length = round.matches.length

    const round_height_deficit = get_height_deficit_for_round(matches_length, options)
    return round_height_deficit > 0
        ? round_height_deficit / 100 * scroll_Y
        : 0
}


export const get_match_center_scroll_Y = (all_data, match_id, scroll_Y, options) => {
    const { match_index, round } = find_match_data_by_id(all_data, match_id)

    let height_per_match = 0
    if (options.use_classical_layout) {
        const round0_matches_height = all_data.rounds[0].matches.length * get_min_height_per_match(options)
        height_per_match = round0_matches_height / round.matches.length
    } else {
        const visible_height_for_round_matches = (
            get_main_canvas().height
            - options.matches_padding_top
            - options.matches_padding_bottom
        )
        const visible_height_per_match = visible_height_for_round_matches / round.matches.length
        height_per_match = Math.max(
            get_min_height_per_match(options),
            visible_height_per_match
        )
    }

    return options.matches_padding_top
        + height_per_match * (match_index + 0.5)
        - get_round_scroll_Y_px(
            options.use_classical_layout ? all_data.rounds[0] : round,
            scroll_Y,
            options
        )
}

export const get_root_el_height = (user_wrapper, options) => {
    if (options.auto_canvas_size) return 'auto'

    const min_height = get_round_title_height(options) + MAIN_CANVAS_MIN_HEIGHT
    return Math.max(
        min_height,
        user_wrapper.clientHeight
    ) + 'px'
}