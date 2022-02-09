import { try_update_scroll_round_index } from './try_update_scroll_round_index.mjs'

export const handle_buttons_clicks = (e, hor_buttons, all_data, store, options) => {
    if (e.target == hor_buttons.left_button
        || hor_buttons.left_button.contains(e.target)
    ) {
        try_update_scroll_round_index(-1, all_data, store, options)
    }
    if (e.target == hor_buttons.right_button
        || hor_buttons.right_button.contains(e.target)
    ) {
        try_update_scroll_round_index(1, all_data, store, options)
    }
}