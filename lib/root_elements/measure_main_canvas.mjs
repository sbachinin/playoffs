import { 
    get_round_title_height,
    get_total_rounds_height
} from '../utils/sizes.mjs'

export const measure_main_canvas = (wrapper, first_round_length, options) => {
    const canvas_hor_margin = (
        options.horizontal_scroll_triggered_by === 'buttons'
        && options.horizontal_scroll_buttons_position === 'In the gutters'
    ) ? options.horizontal_scroll_buttons_clickable_width : 0
    
    const canvas_width = wrapper.clientWidth - canvas_hor_margin * 2

    const canvas_vert_margin = (
        options.vertical_scroll_triggered_by === 'buttons'
        && options.vertical_scroll_buttons_position === 'In the gutters'
    ) ? options.vertical_scroll_buttons_clickable_height : 0

    let canvas_height = wrapper.clientHeight
        - (options.hide_round_titles ? 0 : get_round_title_height(options))
        - canvas_vert_margin * 2

    if (options.auto_canvas_height) {
        canvas_height = get_total_rounds_height(options, first_round_length)
    }

    return {
        canvas_width,
        canvas_height, 
        canvas_hor_margin,
        canvas_vert_margin
    }
}