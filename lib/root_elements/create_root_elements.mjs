import { debounce } from '../utils/utils.mjs'
import { MAIN_CANVAS_CLASS_NAME, EXPAND_CANVAS_CLASS_NAME,
    HIGHLIGHT_CANVAS_CLASS_NAME } from '../constants.mjs'
import { create_offscreen_canvas } from './offscreen_canvas.mjs'
import { create_updater } from './update_root_elements.mjs'
import { create_horizontal_scroll_buttons } from '../horizontal_scroll/buttons/create_horizontal_scroll_buttons.mjs'

export const create_root_elements = (root_id, resize_cb, all_data, options, store) => {

// create root element
    const wrapper = document.createElement('div')
    wrapper.className = root_id
    wrapper.style.overflow = 'hidden'
    wrapper.style.width = '100%'
    wrapper.style.position = 'relative'
    wrapper.style.userSelect = 'none'

// create canvas for round titles
    const round_titles_canvas_el = document.createElement('canvas')
    round_titles_canvas_el.style.border = 'none'
    round_titles_canvas_el.style.display = 'none'
    wrapper.append(round_titles_canvas_el)

// create canvas for highlight-related stuff
    const highlight_canvas_el = document.createElement('canvas')
    highlight_canvas_el.className = HIGHLIGHT_CANVAS_CLASS_NAME
    highlight_canvas_el.style.border = 'none'
    highlight_canvas_el.style.zIndex = 1
    highlight_canvas_el.style.position = 'absolute'
    highlight_canvas_el.style.top = 5000
    highlight_canvas_el.style.left = 0
    highlight_canvas_el.style.pointerEvents = 'none'
    wrapper.append(highlight_canvas_el)

// create canvas for expanded matches
    const expand_canvas_el = document.createElement('canvas')
    expand_canvas_el.className = EXPAND_CANVAS_CLASS_NAME
    expand_canvas_el.style.border = 'none'
    expand_canvas_el.style.zIndex = 2
    expand_canvas_el.style.position = 'absolute'
    expand_canvas_el.style.top = 5000
    expand_canvas_el.style.left = 0
    expand_canvas_el.style.pointerEvents = 'none'
    wrapper.append(expand_canvas_el)

// create canvas
    const main_canvas_el = document.createElement('canvas')
    main_canvas_el.className = MAIN_CANVAS_CLASS_NAME
    main_canvas_el.style.border = 'none'
    main_canvas_el.style.userSelect = 'none'
    wrapper.append(main_canvas_el)


// create hor scroll buttons
    const buttons = create_horizontal_scroll_buttons(all_data, wrapper, options, store, root_id)

    
// set resizer
    let resizer_is_pristine = true
    new ResizeObserver(
        debounce(() => {
            if (resizer_is_pristine) {
                resizer_is_pristine = false
                return
            }
            resize_cb()
        })
    ).observe(wrapper)

    const elements = { wrapper, main_canvas_el,
        round_titles_canvas_el, highlight_canvas_el,
        expand_canvas_el, buttons,
        offscreen_canvas: create_offscreen_canvas()
    }

    return { ...elements, update: create_updater(elements) }
}