import { get_max_base_round_index } from '../utils/sizes.mjs'

export const update_buttons = (
    stable_elements,
    base_round_index,
    all_data
) => {
    const left_is_active = base_round_index > 0
    const right_is_active = get_max_base_round_index(stable_elements, all_data) - base_round_index > 0.01
    stable_elements.navigation_buttons.update_active(left_is_active, right_is_active)
}