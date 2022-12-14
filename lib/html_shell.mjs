import { debounce, create_element_from_Html, update_styles } from './utils.mjs'
import buttons_styles from './styles/buttons.scss'
import main_styles from './styles/main.scss'
import rounds_styles from './styles/rounds.scss'


export const create_html_shell = (user_wrapper_el, is_fullscreen) => {
    update_styles(
        'root',
        'permanent-styles',
        [buttons_styles, main_styles, rounds_styles].join('\n')
    )

    const the_root_element = create_element_from_Html(`
        <div class="playoffs-root">

            <div class="navigation-button left"></div>
            <div class="navigation-button right"></div>
            <div class="scroll-button button-up"></div>
            <div class="scroll-button button-down"></div>

            <div class="round-titles-grid-item">
                <div class="round-titles-wrapper equal-width-columns-grid"></div>
            </div>

            <div class="scrollbar-parent">
                <div class="scrollbar"></div>
            </div>
            <div class="matches-scroller scroll-y-enabled with-hidden-native-scrollbar">
                <div class="matches-positioner equal-width-columns-grid"></div>
            </div>

        </div>
    `)

    let fullscreen_wrapper = null
    let remember_window_size = () => void 0

    if (is_fullscreen) {
        fullscreen_wrapper = create_element_from_Html(`
            <div class="playoffs-fullscreen-wrapper">
                <div class="fullscreen-top">
                    <div class="exit-fullscreen-button">
                        <div class="circle-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="fullscreen-bottom"></div>
            </div>
        `)

        // documentElement.clientWidth seems preferable to window.innerWidth because it doesn't include a width of scrollbar
        remember_window_size = debounce(() => {
            fullscreen_wrapper.style.setProperty(`--window_width`, document.documentElement.clientWidth + 'px')
            fullscreen_wrapper.style.setProperty(`--window_height`, window.innerHeight + 'px')
        })
        window.addEventListener('resize', remember_window_size)
        remember_window_size()

        fullscreen_wrapper.insertBefore(the_root_element, fullscreen_wrapper.querySelector('.fullscreen-bottom'))
        user_wrapper_el.append(fullscreen_wrapper)
    } else {
        user_wrapper_el.append(the_root_element)
    }


    const find = (s) => the_root_element.querySelector(s)

    let elements = {
        fullscreen_wrapper, // maybe null
        the_root_element,
        scrollbar: find('.scrollbar'),
        round_titles_wrapper: find('.round-titles-wrapper'),
        matches_scroller: find('.matches-scroller'),
        matches_positioner: find('.matches-positioner'),
    }

    const uninstall = () => {
        Object.keys(elements).forEach(k => {
            if (elements[k] instanceof Element) {
                elements[k].remove()
            }
            delete elements[k]
        })
        elements = null
        window.removeEventListener('resize', remember_window_size)
    }

    return {
        ...elements,
        uninstall
    }
}