import { validate_data } from './data/validate_data.mjs'
import { create_unique_id } from './utils/utils.mjs'
import { create_root_elements } from './root_elements/create_root_elements.mjs'
import { create_horizontal_scroll_buttons } from './horizontal_scroll/buttons/create_horizontal_scroll_buttons.mjs'
import { install_mouse_events } from './mouse_events/mouse_events.mjs'
import { get_permanent_drawing_props } from './data/permanent_drawing_props.mjs'
import { set_round_heights } from './data/temporary_drawing_props.mjs'
import { create_store } from './store/store.mjs'
import { create_options } from './options/create_options.mjs'
import { get_effects } from './effects/get_effects.mjs'
import { draw_all } from './draw/draw_all.mjs'

export const createBrackets = (initial_data, root_container, user_options) => {

    const { actual_options, update_options } = create_options()
    const all_data = {}
    const root_id = create_unique_id()
    const store = create_store(actual_options)

    const update_all = (user_data = initial_data, user_options = {}) => {
        const new_data = JSON.parse(JSON.stringify(user_data))
        update_options(user_options)

        try {
            validate_data(new_data, actual_options)
        } catch (e) {
            console.error(e)
            return
        }

        root_elements.update(actual_options, new_data[0].matches.length)
        
        Object.assign(all_data,
            get_permanent_drawing_props(new_data, actual_options, root_elements.main_canvas_el))
        
        set_round_heights(all_data, actual_options, root_elements.main_canvas_el.height)

        root_elements.offscreen_canvas.draw(all_data, actual_options)
        
        store.update_some_props(actual_options)

        window.sport_brackets_data = all_data
        buttons.update_visibility()
        buttons.apply_options()
        
        draw_all(all_data, store, actual_options, root_elements)
    }

    const root_elements = create_root_elements(root_id, update_all)

    root_container.append(root_elements.wrapper)
    if (!root_elements.main_canvas_el.getContext) return

    const buttons = create_horizontal_scroll_buttons(
        all_data,
        root_elements.wrapper,
        actual_options,
        store,
        root_id,
    )

    store.set_effects(
        get_effects(store,
            all_data, actual_options, buttons, root_elements
        )
    )

    update_all(initial_data, user_options)

    install_mouse_events(
        all_data,
        actual_options,
        store,
        root_elements.wrapper,
    )

    return update_all
}
