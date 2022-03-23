import { within_range } from '../utils/utils.mjs'
import { get_height_deficit_for_round, get_min_height_per_match } from '../utils/sizes.mjs'
import { animate_scroll } from '../utils/animate_scroll.mjs'
import { was_window_recently_scrolled } from './remember_window_scroll.mjs'

export const get_wheel_handler = (all_data, options, store) => {
    return e => {
        if (options.vertical_scroll_triggered_by !== 'wheel') return
        if (store.state.destination_scroll_Y <= 0 && e.deltaY < 0) return
        if (store.state.destination_scroll_Y >= 100 && e.deltaY > 0) return
        if (options.auto_canvas_height) return
        if (was_window_recently_scrolled()) return
        
        const longest_round_height_deficit = get_height_deficit_for_round(
            all_data.rounds[0].matches.length,
            options,
        )

        e.preventDefault();

        const amount = options.vertical_scroll_amount > 0
            ? options.vertical_scroll_amount
            : get_min_height_per_match(options)

        const delta = e.deltaY
            * amount
            / longest_round_height_deficit

        const maybe_scroll_Y = (store.state.destination_scroll_Y || store.state.scroll_Y) + delta

        animate_scroll({
            store,
            destination_scroll_Y: within_range(maybe_scroll_Y, 0, 100),
            duration: options.vertical_scroll_animation_duration
        })
    }
}
