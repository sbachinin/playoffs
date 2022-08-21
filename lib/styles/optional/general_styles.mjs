export const get_general_styles = (root_id, get_option) => `
    #${root_id}.root-brackets-element {
        background-color: ${ get_option('rootBackgroundColor') };
        border: 1px solid ${get_option('mainBorderColor')};
    }

    
    #${root_id} .round-titles-wrapper {
        height: ${ get_option('roundTitlesHeight') }px;
        font-size: ${ get_option('roundTitlesFontSize') }px;
        font-family: ${ get_option('roundTitlesFontFamily') || get_option('rootFontFamily') };
        color: ${ get_option('roundTitleColor') };
        border-bottom: 1px solid ${ get_option('roundTitlesBorderBottomColor') };
    }

    #${root_id} .matches-positioner {
        min-height: calc(100% - ${get_option('mainVerticalPadding') * 2}px);
        margin-top: ${ get_option('mainVerticalPadding') || 0 }px;
        margin-bottom: ${ get_option('mainVerticalPadding') || 0 }px;
        font-size: ${get_option('matchFontSize')}px;
    }

    #${root_id} .scrollbar {
        width: ${ get_option('scrollbarWidth') }px;
        background: ${ get_option('scrollbarColor') };
    }
`