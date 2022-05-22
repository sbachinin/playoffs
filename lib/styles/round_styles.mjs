const live_color = 'rgb(30, 142, 62)'

export const get_rounds_styles = (root_id, options) => `
    #${root_id} {
        font-family: ${options.root_font_family};
    }

    #${root_id} .round-wrapper {
        position: relative;
        display: grid;
        grid-auto-rows: minmax(0, 1fr);
        align-items: center;
    }

    #${root_id} .match-wrapper {
        display: grid;
        grid-template-rows: repeat(2, minmax(0, 1fr)); /* two sides will always be of same height */
        grid-row-gap: ${options.vertical_gap_between_sides}px;
        padding: ${options.match_root_font_size / 3}px ${options.match_root_font_size / 2}px;
        margin: ${options.min_vertical_distance_btw_matches / 2}px 0;
        color: ${ options.match_text_color };
        position: relative; /* to host 'Live' badge */
    }

    #${root_id} .side-wrapper {
        display: flex;
        cursor: pointer;
    }

    #${root_id} .side-wrapper.highlighted .side-info-item,
    #${root_id} .side-wrapper:hover .side-info-item {
        color: ${ options.highlight_color };
    }


    #${root_id} .match-wrapper .live-badge {
        position: absolute;
        font-size: ${ Math.floor(options.match_root_font_size / 4 * 3) }px;
        color: ${ live_color };
        top: -${ options.match_root_font_size * 1.4 }px;
        right: ${options.match_root_font_size}px;
        border: 1px solid;
        padding: 0 3px;
        border-radius: 4px;
    }


    #${root_id} .side-info-item {
        display: grid;
        grid-auto-rows: minmax(0, 1fr); /* equal height rows */
        grid-template-columns: auto;
        align-items: center;
        pointer-events: none; /* to capture clicks on .side-wrapper */
        transition: color 0.15s ease-out;
    }

    #${root_id} .side-info-item.entry-status {
        width: ${ options.match_root_font_size * 1.5 }px;
        font-size: ${options.match_root_font_size - 4}px;
        text-align: center;
    }

    #${root_id} .side-info-item.players-info {
        flex: 1;
        padding-left: ${ options.match_root_font_size / 2 }px;
        grid-row-gap: ${ options.vertical_gap_between_side_players }px;
    }

    #${root_id} .player-wrapper {
        display: flex;
        align-items: center;
    }

    #${root_id} .player-wrapper .nationality {
        min-width: ${ options.match_root_font_size * 2 }px;
        font-size: ${options.match_root_font_size - 4}px;
        text-align: center;
        margin-right: ${ options.match_root_font_size / 2 }px;
        display: flex;
        justify-content: center;
        padding-top: ${ options.match_root_font_size / 8 }px;
    }

    #${root_id} .player-wrapper .nationality > img {
        height: ${options.match_root_font_size * 0.8}px;
    }

    #${root_id} .player-wrapper .player-title {
        flex: 1;
        padding-right: ${ options.match_root_font_size * 2 }px;
        font-family: ${options.player_title_font_family || options.root_font_family};
    }

    
    #${root_id} .side-info-item.winner-mark {
        padding-right: ${ options.distance_between_scores }px;
    }


    #${root_id} .side-info-item.score {
        grid-auto-flow: column;
        font-family: ${options.score_font_family || options.root_font_family};
        grid-column-gap: ${ options.distance_between_scores }px;
        padding-right: ${ options.match_root_font_size / 2 }px;
    }
    #${root_id} .single-score {
        display: flex;
        overflow: visible;
        justify-content: center;
    }
    #${root_id} .tie-break {
        font-size: ${Math.floor(options.match_root_font_size / 3 * 2)}px;
        display: inline-block;
        transform: translate(1px, -${options.match_root_font_size / 3.5}px);
        width: 0;
    }

    #${root_id} svg.default-winner-mark {
        height: ${options.match_root_font_size}px;
    }
`