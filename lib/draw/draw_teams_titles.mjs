const adjust_font = (options, isHighlighted) => {
    return `${
        (options.winner_is_highlighted && isHighlighted) ? 'bold': ''
    } ${
        options.team_title_font_size
    }px ${
        options.team_title_font_family
    }`
}

export const draw_teams_titles = (sides, current_X, center_Y, options, ctx, is_expanded = false) => {
    const texts_offset = options.vert_gap_between_opponents/2 + options.team_title_font_size/2
    const title_prop_name = is_expanded ? 'short_title' : 'title_to_display'

    ctx.textAlign = 'left'
    ctx.fillStyle = options.team_title_text_color
    ctx.font = adjust_font(options, sides[0].isWinner)
    ctx.fillText(
        sides?.[0]?.[title_prop_name],
        current_X,
        center_Y - texts_offset + 2)
    ctx.font = adjust_font(options, sides[1].isWinner)
    ctx.fillText(
        sides?.[1]?.[title_prop_name],
        current_X,
        center_Y + texts_offset + 2)
}