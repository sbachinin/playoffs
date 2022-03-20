import { create_effects } from './effects_controller.mjs'
import { get_adjusted_update } from './adjust_update.mjs'
import { default_state } from './default_state.mjs'
import { deep_clone_object } from '../utils/utils.mjs'

export const create_store = (options) => {
    let effects_controller = create_effects()

    const state = deep_clone_object(default_state)

    const update_state = (update = {}, force_redraw = false) => {
        const old_state = deep_clone_object(state)
        Object.assign(state, get_adjusted_update(old_state, update, options))
        effects_controller.run_all(state, old_state, force_redraw)
    }

    const update_some_props = options => {
        if (!options.highlight_team_history_on_click) { state.highlighted_team_id = null}
        state.dragging = false
        state.drag_start_scroll_coords = []
        state.drag_start_mouse_coords = []
    }

    return {
        state,
        update_state,
        update_some_props,
        set_effects: effects => { effects_controller.set(effects) }
    }
}