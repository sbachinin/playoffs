import { create_element_from_Html, is_object } from '../utils.mjs'
import { get_single_score, get_scores_for_side } from './get_scores_for_side.mjs'

const checkmark_svg = `<svg class="default-winner-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"/></svg>`

const fill_player_template = (nationality, title) => {
    return `<div class="player-wrapper">
        <div class="nationality">${nationality}</div>
        <div class="player-title">${title}</div>
    </div>`
}


const get_entry_status_html = (context, all_data, get_option) => {
    let result = ''

    const contestant = all_data.contestants[context.contestantId]

    if (typeof contestant.entryStatus === 'string') {
        result = contestant.entryStatus.trim()
    }

    // if getEntryStatusHTML is a function, it should be called anyway, even if contestants[i].entryStatus is missing or invalid
    if (typeof get_option('getEntryStatusHTML') === 'function') {
        try {
            const unreliable_value = get_option('getEntryStatusHTML')(
                contestant.entryStatus, context, all_data
            )
            if (typeof unreliable_value === 'string') {
                result = unreliable_value
            } else {
                throw `options.getEntryStatusHTML must return a string, instead returned: ${unreliable_value}`
            }
        } catch (e) {
            console.warn('Failed to get a string from getEntryStatusHTML.', e)
        }
    }

    return result
}


const get_player_html = (player, context, all_data, get_option) => {
    let nationality = ''

    if (typeof player.nationality === 'string') {
        nationality = player.nationality.trim()
    }

    // if getNationalityHTML is a function, it should be called anyway, even if player.nationality is missing or invalid
    if (typeof get_option('getNationalityHTML') === 'function') {
        try {
            const unreliable_value = get_option('getNationalityHTML')(
                player.nationality, context, all_data
            )
            if (typeof unreliable_value === 'string') {
                nationality = unreliable_value
            } else {
                throw `options.getNationalityHTML must return a string, instead returned: ${unreliable_value}`
            }
        } catch (e) {
            console.warn('Failed to get a string from getNationalityHTML.', e)
        }
    }

    const title = typeof player.title === 'string' ? player.title : ''

    return fill_player_template(nationality, title)
}


const get_side_html = (match, side_index, all_data, get_option) => {
    const this_side = match.sides?.[side_index]
    const other_side = match.sides?.[side_index === 1 ? 0 : 1]

    let looser_class = ''
    let winner_class = ''
    let contestantId = ''
    let entry_status = ''
    let players_html = ''
    let scores_html = ''
    let subscore = ''
    let hidden_serving_class = 'hidden'
    let transparent_serving_class = 'transparent'

    if (is_object(this_side)) {
        if (this_side.isWinner) { winner_class = 'winner' }
        if (typeof this_side.contestantId === 'string') {
            contestantId = `contestant-id="${this_side.contestantId}"`
        } else if (typeof this_side.title === 'string') {
            players_html = fill_player_template('', this_side.title)
        }

        scores_html = get_scores_for_side(this_side, other_side)

        if (is_object(this_side.subscore)) {
            subscore = get_single_score(this_side.subscore, other_side?.subscore)
        }

        if (this_side.isServing === true || other_side?.isServing === true) { hidden_serving_class = '' }
        if (this_side.isServing === true) { transparent_serving_class = '' }

        let contestant = all_data.contestants?.[this_side.contestantId]

        if (contestant) {
            let context = { roundIndex: match.roundIndex, matchOrder: match.order, contestantId: this_side.contestantId }

            entry_status = get_entry_status_html(context, all_data, get_option)

            players_html = (contestant.players || []).map(
                (pl, playerIndex) => {
                    return get_player_html(pl, { ...context, playerIndex }, all_data, get_option)
                }
            ).join('')
        }
    }

    if (other_side) {
        if (other_side.isWinner) { looser_class = 'looser' }
    }

    return `
        <div class="side-wrapper ${looser_class} ${winner_class}"  ${contestantId}>
            <div class="side-info-item entry-status">${entry_status}</div>
            <div class="side-info-item players-info">${players_html}</div>
            <div class="side-info-item winner-mark">${checkmark_svg}</div>
            <div class="side-info-item side-scores">${scores_html}</div>
            <div class="side-info-item subscore">${subscore}</div>
            <div class="side-info-item serving-mark ${hidden_serving_class} ${transparent_serving_class}"></div>
        </div>
    `
}



export const get_match_element = (round_index, match_order, all_data, get_option) => {
    const maybe_match_data = all_data.matches?.find(m => m.roundIndex === round_index && m.order === match_order)

    const render_match = get_option('getMatchElement')

    const should_be_live = (
        Array.isArray(maybe_match_data?.sides)
        && maybe_match_data?.sides.length
        && maybe_match_data?.isLive === true
        && typeof render_match !== 'function'
    )

// create a shell of a match
    const match_wrapper_element = create_element_from_Html(`
        <div
            class="
                match-wrapper
                ${should_be_live ? 'live' : ''}
                ${match_order % 2 === 0 ? 'even' : 'odd'}
            "
            match-order="${match_order}"
        >
            <div class="match-lines-area">
                <div class="line-wrapper upper"></div>
                <div class="line-wrapper lower"></div>
            </div>
        </div>
    `)

    const match_body_element = create_element_from_Html(`<div class="match-body"></div>`)




// maybe use custom match renderer provided by user
    if (typeof render_match === 'function') {
        match_wrapper_element.prepend(match_body_element)
        try {
            // test that getMatchElement can't mutate all_data
            const maybe_el = render_match(round_index, match_order, deep_clone_object(all_data))
            if (maybe_el !== undefined) {
                if (maybe_el instanceof Element || typeof maybe_el === 'string') {
                    match_body_element.append(maybe_el)
                } else {
                    throw `It returned a value which is neither a string nor an Element`
                }
            }
        } catch (e) {
            console.warn(`Failed to get an element from getMatchElement. `, e)
        }
        return match_wrapper_element
    }




// otherwise: maybe return a 'placeholder' of a match
    if (maybe_match_data === undefined) {
        return match_wrapper_element
    }



// otherwise: render a contentful match using default layout
    if (Array.isArray(maybe_match_data.sides) && maybe_match_data.sides.length) {
        match_body_element.innerHTML += `
            <div class="sides">
                ${get_side_html(maybe_match_data, 0, all_data, get_option)}
                ${get_side_html(maybe_match_data, 1, all_data, get_option)}
            </div>
        `
    }

    if (typeof maybe_match_data.matchStatus === 'string' && maybe_match_data.matchStatus.length) {
        match_body_element.innerHTML += `<div class="match-status">${maybe_match_data.matchStatus}</div>`
    }

    match_wrapper_element.prepend(match_body_element)
    return match_wrapper_element
}