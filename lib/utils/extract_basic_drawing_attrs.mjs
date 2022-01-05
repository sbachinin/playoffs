const get_default_round_title = (rounds_count, round_index) => {
    if (round_index === (rounds_count-1)) return 'Final'
    if (round_index === (rounds_count-2)) return 'Semifinals'
    if (round_index === (rounds_count-3)) return 'Quarterfinals'
    return `1/${Math.pow(2, rounds_count - round_index - 1)}`
}

export const extract_basic_drawing_attrs = (rounds, options, ctx) => {
    ctx.save();
    ctx.font = `${options.team_title_font_size}px ${options.team_title_font_family}`
    let widest_team_title_width = 0
    rounds.forEach(round => {
        round.matches.forEach(match => {
            widest_team_title_width = Math.max(
                widest_team_title_width,
                ctx.measureText(match.sides[0].title).width,
                ctx.measureText(match.sides[1].title).width
            )
        })
    })

    ctx.restore();
    
    return {
        widest_team_title_width,
        rounds_drawing_attrs: rounds.map(
            (round, round_index) => ({
                title: round.name || get_default_round_title(rounds.length, round_index)
            })
        )
    }
}