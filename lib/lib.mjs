import { validate_data } from './validate_data.mjs'
import { create_unique_id } from './utils/utils.mjs'
import { create_root_elements } from './create_root_elements.mjs'
import { create_offscreen_canvas } from './offscreen_canvas.mjs'
import { maybe_draw_round_titles } from './draw/round_titles.mjs'
import { draw_expanded_matches } from './draw/draw_expanded_matches.mjs'
import { draw_rounds } from './draw/draw_rounds.mjs'
import { create_horizontal_scroll_buttons } from './horizontal_scroll/buttons/create_horizontal_scroll_buttons.mjs'
import { animate_scroll_X_to_anchor_round } from './horizontal_scroll/animate_scroll_X_to_anchor_round.mjs'
import { install_mouse_events } from './mouse_events/mouse_events.mjs'
import { get_default_options } from './utils/get_default_options.mjs'
import { get_permanent_drawing_props } from './data/permanent_drawing_props.mjs'
import { set_round_heights } from './data/temporary_drawing_props.mjs'
import { create_store } from './store/store.mjs'
import { CURSOR, SCROLL_X, SCROLL_TO_NEW_ANCHOR_ROUND,
    REDRAW_ALL, REDRAW_EXPANDED_MATCHES, ANIMATE_EXPANDED_MATCH_CHANGE
} from './store/effects.mjs'
import { animate_expanded_match } from './effects/animate_expanded_match.mjs'
import { get_adjusted_options } from './adjust_options.mjs'

export const createBrackets = (initial_data, root_container, user_options) => {

    const actual_options = { ...get_default_options() }
    const all_data = {}
    const root_id = create_unique_id()
    const store = create_store(actual_options)

    const update_all = (user_data = initial_data, user_options = actual_options) => {
        const new_data = JSON.parse(JSON.stringify(user_data))
        Object.assign(actual_options, get_adjusted_options(user_options))

        try {
            validate_data(new_data, actual_options)
        } catch (e) {
            console.error(e)
            return
        }

        update_root_elements(actual_options, new_data[0].matches.length)
        
        Object.assign(all_data, get_permanent_drawing_props(new_data, actual_options, main_canvas_el))
        set_round_heights(all_data, actual_options, main_canvas_el.height)

        offscreen_canvas.draw()
        
        store.reset_some_props()

        window.sport_brackets_data = all_data
        buttons.update_visibility()
        buttons.apply_options()
        
        maybe_draw_round_titles(all_data, store.state, actual_options, round_titles_canvas_el)
        draw_rounds(
            all_data, store.state, main_canvas_el,
            offscreen_canvas.el, highlight_canvas_el,
            actual_options)
    }

    const offscreen_canvas = create_offscreen_canvas(all_data, actual_options)
    const {
        root_brackets_el, main_canvas_el, round_titles_canvas_el,
        highlight_canvas_el, expand_canvas_el, update_root_elements
    } = create_root_elements(root_id, update_all)
    root_container.append(root_brackets_el)
    if (!main_canvas_el.getContext) return

    const buttons = create_horizontal_scroll_buttons(
        all_data,
        root_brackets_el,
        actual_options,
        store,
        root_id,
    )

    store.on_update(CURSOR, () => {
        main_canvas_el.style.cursor = store.state.cursor
    })
    store.on_update(SCROLL_X, () => {
        buttons.update_visibility()
            setTimeout(() => maybe_draw_round_titles(all_data, store.state, actual_options, round_titles_canvas_el))
    })
    store.on_update(SCROLL_TO_NEW_ANCHOR_ROUND, () => {
        animate_scroll_X_to_anchor_round(all_data, store, main_canvas_el, actual_options)
    })
    store.on_update(REDRAW_EXPANDED_MATCHES, () => {
        draw_expanded_matches(all_data.rounds, store.state, expand_canvas_el, actual_options)
    })
    store.on_update(ANIMATE_EXPANDED_MATCH_CHANGE, () => {
        animate_expanded_match(store.update_state)
    })
    store.on_update(REDRAW_ALL, () => {
        draw_rounds(
            all_data, store.state, main_canvas_el,
            offscreen_canvas.el, highlight_canvas_el,
            actual_options)
    })

    update_all(initial_data, user_options)

    install_mouse_events(
        all_data,
        actual_options,
        store,
        root_brackets_el,
    )

    return update_all
}
