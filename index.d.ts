import { Data, Match, Contestant } from "./lib/data/data"

type Options = {
    mainBorderColor: string,
    rootBackgroundColor: string,
    mainVerticalPadding: number,
    visibleRoundsCount: number,
    showScrollbar: boolean,
    scrollbarWidth: number,
    scrollbarColor: string,
    roundTitlesHeight: number,
    roundTitlesBorderBottomColor: string,
    roundTitleColor: string,
    navButtonsPosition: string,
    navigationButtonsTopDistance: string,
    navigationGutterBorderColor: string,
    defaultNavigationSvgSize: number,
    navigationSvgColor: string,
    leftNavigationButtonBackground: string,
    rightNavigationButtonBackground: string,
    leftNavigationButtonHTML: string,
    rightNavigationButtonHTML: string,
    rootFontFamily: string,
    roundTitlesFontFamily: string,
    roundTitlesFontSize: number,
    matchTextColor: string,
    matchFontSize: number,
    playerTitleFontFamily: string,
    highlightedPlayerTitleColor: string,
    scoreFontFamily: string,
    connectionLinesWidth: number,
    connectionLinesColor: string,
    highlightedConnectionLinesColor: string,
    matchMaxWidth: number,
    matchMinVerticalGap: number,
    matchHorMargin: number,
    matchAxisMargin: number,
    oneSidePlayersGap: number,
    liveMatchBorderColor: string,
    liveMatchBackgroundColor: string,
    distanceBetweenScorePairs: number,
    onMatchClick: (match: Match) => void,
    onMatchSideClick: (contestant: Contestant, contestant_id: string, match: Match) => void
}

type OptionsMap = Partial<Options>

export function createPlayoffs(
    user_data: Data,
    user_wrapper_el: Element,
    user_options: OptionsMap
): {
    moveToNextRound: () => void;
    moveToPreviousRound: () => void;
    setBaseRoundIndex: (i: number) => void;
    getNavigationState: () => {
        reachedRightEdge: boolean,
        allRoundsAreVisible: boolean,
        baseRoundIndex: number
    }

    applyNewOptions: (new_options: OptionsMap) => void;
    getUserOptions: () => OptionsMap;

    applyFullDataUpdate: (new_data: Data) => void;
    applyMatchesUpdates: (matches_data: Match[]) => void;
    getAllData: () => Data;
};