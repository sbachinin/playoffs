import { draw_connecting_lines } from './draw_connecting_lines.mjs'
import { draw_scores } from './draw_scores.mjs'
import { should_draw_seed, draw_seed } from './draw_seed.mjs'
import { get_round_title_height } from '../utils/sizes.mjs'
import { draw_teams_titles } from './draw_teams_titles.mjs'

export const draw_matches_for_round = (
    round_index,
    all_data,
    canvas_el,
    options,
    state,
    add_match_to_expand
) => {
    const round_data = all_data.rounds[round_index]
    round_data.matches.forEach((match, match_index) => {
        const { center_Y, sides } = match
        
        // match is invisible in this scrollY position
        if (center_Y < get_round_title_height(options) || center_Y > canvas_el.height) return
        
        if (
            match.id === state.expanded_match_id
            || match.id === state.previous_expanded_match_id
        ) {
            add_match_to_expand({
                ...match,
                collapsed_left_X: round_data.left_X,
                collapsed_width: round_data.width
            })
        }

        const ctx = canvas_el.getContext('2d', { alpha: false })
        ctx.textBaseline = 'middle'
        
        const round_left_X = round_data.left_X - Math.floor(state.scroll_X)
        let current_X = round_left_X + options.match_padding_left
        
        if (should_draw_seed(round_index, options)) {
            draw_seed(sides, current_X, center_Y, options, ctx)
            current_X += options.seed_width
        }

        draw_teams_titles(sides, current_X, center_Y, state.selected_team_id, options, ctx)

        current_X += all_data.team_title_width + options.scores_left_margin
        if (!options.reduce_match_until_clicked && !options.reduce_match_until_hovered) {
            draw_scores(ctx, match, current_X, state.selected_team_id, options)
        }

// draw 'axis' of the match
        ctx.beginPath()
        ctx.lineWidth = options.connection_lines_width
        ctx.strokeStyle = options.connection_lines_color
        ctx.moveTo(round_left_X + round_data.width, center_Y)
        const connection_point = [round_left_X, center_Y]
        ctx.lineTo(...connection_point)

// draw regular connecting lines
        if (round_index > 0) {
            draw_connecting_lines({
                type: options.connection_lines_type,
                later_connection_point: connection_point,
                upper_parent: all_data.rounds[round_index - 1].matches[match_index*2],
                lower_parent: all_data.rounds[round_index - 1].matches[match_index*2 + 1],
                parent_to_highlight: null,
                options,
                ctx
            })
        }

        ctx.stroke();

// maybe draw higlighted 'axis' & connecting lines
        const team_id_to_highlight = sides.find(s => s.id === state.selected_team_id)?.id
        if (!team_id_to_highlight) return
        ctx.beginPath()
        ctx.strokeStyle = options.highlighted_connection_lines_color
        ctx.lineWidth = options.highlighted_connection_lines_width
        ctx.moveTo(round_left_X + round_data.width, center_Y)
        ctx.lineTo(...connection_point)
        if (round_index > 0) {
            const parent_to_highlight = all_data.rounds[round_index - 1].matches
                    .find(m => m.sides.find(s => s.id === team_id_to_highlight))
            parent_to_highlight && draw_connecting_lines({
                type: options.connection_lines_type,
                later_connection_point: connection_point,
                upper_parent: all_data.rounds[round_index - 1].matches[match_index*2],
                lower_parent: all_data.rounds[round_index - 1].matches[match_index*2 + 1],
                parent_to_highlight,
                options,
                ctx,
            })
        }
        ctx.stroke();
    })
}