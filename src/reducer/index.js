function reducer(state, action) {
    switch (action.type) {
        case ACTION.DISCARD_CARD:
            let myCard = action?.payload;
            // Remove card , (send index of card )
            let newOpenCardState = { ...state };
            newOpenCardState.givenCards.splice(action.payload.cardInd, 1);
            // update card
            newOpenCardState.openCard = myCard;
            return newOpenCardState;

        case ACTION.UPDATE_STATE:
            console.log("state updated to", action.payload);
            localStorage.setItem(
                "CARD_DATA",
                JSON.stringify({
                    roomID: action.payload.roomID,
                    ID: action.payload.ID,
                })
            );
            return action.payload;

        default:
            return state;
    }
}

const ACTION = {
    DRAW_CARD: "DRAW_CARD",
    DISCARD_CARD: "DISCARD_CARD",
    UPDATE_STATE: "UPDATE_STATE",
};

export default reducer;
