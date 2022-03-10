const get_gutter_border_color = options => {
    return (
        options.horizontal_scroll_buttons_position === 'In the gutters'
        && options.scroll_gutter_border_color
    ) ? options.scroll_gutter_border_color : 'transparent'
}

const get_vert_align = position => {
    if (position === 'top') return 'flex-start'
    if (position === 'middle') return 'center'
    if (position === 'bottom') return 'flex-end'
}


const get_left_button_styles = (root_id, options) => `
    #${root_id} .scroll-button-wrapper.left {
        left: 0;
        border-right: 1px solid ${get_gutter_border_color(options)};
    }
    #${root_id} .scroll-button-wrapper.left .button-clickable-area {
        background: ${ options.left_scroll_button_clickable_background }
    }
`

const get_right_button_styles = (root_id, options) => `
    #${root_id} .scroll-button-wrapper.right  {
        right: 0;
        border-left: 1px solid ${get_gutter_border_color(options)};
    }
    #${root_id} .scroll-button-wrapper.right .button-clickable-area {
        background: ${ options.right_scroll_button_clickable_background }
    }
`

const get_hor_buttons_shared_styles = (root_id, options) => `
    #${root_id} .scroll-button-wrapper.horizontal {
        justify-content: center;
        align-items: ${get_vert_align(options.horizontal_scroll_buttons_alignment)};
        top: 0;
        height: 100%;
        pointer-events: ${ options.horizontal_scroll_buttons_position === 'In the gutters' ? 'auto' : 'none' };
        background: ${ options.horizontal_scroll_buttons_position === 'In the gutters'
            ? options.scroll_gutter_background_color
            : 'none'
        };
        margin: 0 ${ options.horizontal_scroll_buttons_position === 'In the gutters'
            ? 0
            : options.horizontal_scroll_buttons_hor_margin
        };
    }

        
    #${root_id} .scroll-button-wrapper.horizontal .button-clickable-area {
        width: ${options.horizontal_scroll_buttons_clickable_width}px;
        height: ${options.horizontal_scroll_buttons_clickable_height}px;
        margin: ${ options.horizontal_scroll_buttons_vert_margin } 0;
    }

    #${root_id} .scroll-button-wrapper.horizontal svg {
        fill: ${options.horizontal_scroll_buttons_svg_color};
    }
`


export const get_hor_buttons_styles = (root_id, options) => `
    ${get_left_button_styles(root_id, options)}
    ${get_right_button_styles(root_id, options)}
    ${get_hor_buttons_shared_styles(root_id, options)}
`