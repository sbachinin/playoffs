export const adjust_font = (options, is_winner) => {
    return `${
        (options.winner_is_highlighted && is_winner) ? 'bold': ''
    } ${
        options.team_title_font_size
    }px ${
        options.team_title_font_family
    }`
}

export const draw_team_title = ({
    title,
    y,
    is_highlighted,
    is_winner,
    options,
    ctx
}) => {
    ctx.fillStyle = is_highlighted
        ? options.highlighted_team_text_color
        : options.team_title_text_color
    ctx.font = adjust_font(options, is_winner)
    ctx.fillText(
        title,
        0,
        Math.floor(y))
}