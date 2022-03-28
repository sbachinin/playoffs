export const options_presets = [
    { // small scale
        "background_color": "#ffffff",
        "distance_between_rounds": 58,
        "horizontal_scroll_buttons_alignment": "top",
        "horizontal_scroll_icon_size": 50,
        "horizontal_scroll_buttons_svg_color": "#161616",
        "horizontal_scroll_buttons_hor_padding": 29,
        "horizontal_scroll_buttons_vert_padding": 29,
        "connection_lines_type": "bended-1",
        "connection_lines_width": 1,
        "connection_lines_color": "#bbbbbb",
        "match_font_size": 12,
        "score_text_color": "#fff",
        "score_font_family": "roboto",
        "score_hor_padding": 3,
        "score_hor_margin": 2
    },

    { // very condensed horizontally, with collapsed matches
        connection_lines_type: "bended-2",
        distance_between_rounds: 44,
        horizontal_scroll_buttons_alignment: "middle",
        round_title_font_size: 23,
    },

    { // GUTTERS EVERYWHERE
        matches_padding_top: 20,
        round_titles_padding_top: 25,
        round_title_font_size: 27,
        round_title_margin_bottom: 10,
        horizontal_scroll_buttons_alignment: "middle",
        horizontal_scroll_buttons_position: "In the gutters",
        horizontal_scroll_buttons_clickable_width: 35,
        vertical_scroll_triggered_by: "buttons",
        vertical_scroll_buttons_position: "In the gutters",
        vertical_scroll_buttons_alignment: "center",
        vertical_scroll_buttons_clickable_height: 35
    }
]