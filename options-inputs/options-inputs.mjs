import { OPTIONS } from '../lib/options.mjs'
import { get_default_options, get_flattened_options } from '../lib/utils/get_default_options.mjs'
import { get_option_input } from './get-option-input.mjs'
import * as elements from './elements.mjs'
import { get_options_group_heading } from './get_options_group_heading.mjs'

const names_of_expanded_groups = []
const all_inputs = []

const update_inputs = (options_to_values) => {
    Object.keys(OPTIONS).forEach(options_type_name => {
        document.querySelector(`.${options_type_name}-arrow`).style.transform = (
            names_of_expanded_groups.includes(options_type_name) ? 'rotate(180deg)' : 'none'
        )
        document.querySelector(`.${options_type_name}`).style.height = (
            names_of_expanded_groups.includes(options_type_name) ? 'auto' : 0
        )
        Object.entries(OPTIONS[options_type_name]).forEach(([option_name, option_info]) => {
            const wrapper_el = document.querySelector(`.${option_name}-input-wrapper`)
            if (option_info.disable_if?.(options_to_values)) {
                wrapper_el?.classList.add('disabled')
            } else {
                wrapper_el?.classList.remove('disabled')
            }
        })
    })
    all_inputs.forEach(i => i.update(options_to_values))
}

const render_inputs = (data, user_options_to_values, wrapper_el, update_brackets) => {
    wrapper_el.innerHTML = ''

    const default_options_to_values = get_default_options()
    const options_to_values = { ...default_options_to_values, ...user_options_to_values}

    const onchange = (option_name, option_value) => {
        Object.assign(
            options_to_values,
            { [option_name]: option_value }
        )
        if (option_value === true) {
            const flattened_options = get_flattened_options()
            flattened_options[option_name]?.incompatible_with?.forEach(incompat_option_name => {
                Object.assign(
                    options_to_values,
                    { [incompat_option_name]: false }
                )
            })
        }

        update_inputs(options_to_values)
        update_brackets(data, options_to_values)
    }

    const get_inputs_of_type = (options, options_type_name) => {
        const group_inputs = Object.entries(options)
            .map(([option_name, option_info]) => {
                const option_wrapper_el = elements.option_wrapper_el(option_name, option_info)
                const input = get_option_input(
                    option_name,
                    option_info,
                    options_to_values[option_name],
                    onchange
                )
                all_inputs.push(input)
                option_wrapper_el.append(input.el)
                return option_wrapper_el
            })

        const group_wrapper_el = elements.grouped_inputs_wrapper(options_type_name, names_of_expanded_groups)
        group_wrapper_el.append(...group_inputs)
        return group_wrapper_el
    }

    Object.entries(OPTIONS)
        .forEach(([options_type_name, options_of_type]) => {
            wrapper_el.append(
                get_options_group_heading(
                    options_type_name,
                    () => update_inputs(options_to_values),
                    names_of_expanded_groups
                ),
                get_inputs_of_type(options_of_type, options_type_name)
            )
        })
/* 
    wrapper_el.append(get_options_group_heading(
        'DATA_TEXTAREA',
        () => render_inputs(data, options_to_values, wrapper_el, update_brackets),
        names_of_expanded_groups
    ))

    if (names_of_expanded_groups.includes('DATA_TEXTAREA')) {
        const data_textarea = create_element_from_Html(`
            <textarea disabled style="width: 100%; height: 1000px;">${JSON.stringify(data, null, 2)}</textarea>
        `)
        data_textarea.addEventListener('input', e => {
            update_brackets(JSON.parse(e.target.value), options_to_values)
        })
        wrapper_el.append(data_textarea)
    } */
}

export const get_options_inputs = (
    update_brackets,
    data,
    user_options_to_values
) => {   
    const wrapper_el = elements.inputs_root_wrapper()
    render_inputs(data, user_options_to_values, wrapper_el, update_brackets)
    document.head.insertAdjacentHTML('beforeend', elements.styles())
    return wrapper_el
}
