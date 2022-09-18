import { get_default_options, get_options_flattened_meta } from './options_meta_getter.mjs'
import { debounce } from '../utils.mjs'

export const shout_impossible_option_value = debounce((option_name, option_value) => {
    console.warn(
        `Impossible value provided for "${option_name}" option: %c${JSON.stringify(option_value, null, 2)}%c.
Default value of %c${get_default_options()[option_name]}%c will be used instead`,
        'background: #c7ffc9; color: black; padding: 0 3px',
        '',
        'background: pink; color: black; padding: 0 3px',
        ''
    )
}, 0)

export const validate_user_options = (user_options) => {
    const all_options_meta = get_options_flattened_meta()

    Object.keys(user_options).forEach(option_name => {

// valid option name?
        const option_meta = all_options_meta[option_name]
        if (!option_meta) {
            console.warn(`Unknown option provided: %c${option_name}`, 'background: pink; color: black; font-weight: bold; padding: 0 3px;')
            return
        }
    })
}