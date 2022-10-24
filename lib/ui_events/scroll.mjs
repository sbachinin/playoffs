import { within_range } from '../utils.mjs'
// https://stackoverflow.com/a/4770179

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
export const disable_scroll = (el) => {
    el.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    el.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    el.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    el.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
export const enable_scroll = (el) => {
    el.removeEventListener('DOMMouseScroll', preventDefault, false);
    el.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    el.removeEventListener('touchmove', preventDefault, wheelOpt);
    el.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}





export const handle_vertical_button_click = (html_shell) => {
    let destination_scroll_Y = 0

    const try_scroll_Y = (e) => {

        if (!e.target.classList.contains('vertical-scroll-button')) return

        const is_up = e.target.classList.contains('button-up')

        const delta = is_up ? 200 : -200
        destination_scroll_Y = within_range(
            destination_scroll_Y + delta,
            html_shell.matches_positioner.parentElement.clientHeight - html_shell.matches_positioner.clientHeight,
            0
        )
        html_shell.matches_positioner.style.transform = `translateY(${destination_scroll_Y}px)`
    }

    html_shell.the_root_element.addEventListener('click', try_scroll_Y)

    const unhandle_vertical_button_click = () => {
        html_shell.the_root_element?.removeEventListener('click', try_scroll_Y)
    }

    return unhandle_vertical_button_click
}
