import React, { useContext } from "react";
import cardContext from "../reducer/context";
import "../styles/card.css";
import axios from "axios";

function Card({ suit, value, cardInd, openCard, display, setDisplay }) {
    const [state, action] = useContext(cardContext);

    const { roomID, ID } = state;
    let classVariables =
        suit === "♦️" || suit === "❤" ? "color-red" : "color-black";
    classVariables += value === "6" || value === "9" ? " six" : "";
    async function discardCard() {
        if (openCard) {
            return console.log("this is the open card");
        }
        if (ID != state.turn) {
            return setDisplay("Wait for your turn");
        } else {
            setDisplay("");
        }
        if (state.openCard.suit === suit || state.openCard.value === value) {
            await axios
                .post(process.env.REACT_APP_DISCARD_CARD, {
                    roomID,
                    ID,
                    card: {
                        suit,
                        value,
                    },
                })
                .then(async (response) => {
                    const { roomID, ID } = JSON.parse(
                        localStorage.getItem("CARD_DATA")
                    );
                    axios
                        .post(process.env.REACT_APP_UPDATE_STATE, {
                            roomID,
                            ID,
                        })
                        .then(async (response) => {
                            const {
                                givenCards,
                                openCard,
                                drawDeck,
                                ID,
                                roomID,
                                turn,
                            } = response.data;
                            return await action({
                                type: "UPDATE_STATE",
                                payload: {
                                    givenCards,
                                    openCard,
                                    drawDeck,
                                    ID,
                                    roomID,
                                    turn,
                                },
                            });
                        });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            alert("Card dosen't match the open card");
        }
    }
    return (
        <div className="card-container" onClick={discardCard}>
            <p className={`${classVariables}  cardValue left`}>{value}</p>
            <p className={`${classVariables.replace("six", "")} suit `}>
                {suit}
            </p>
            <p className={`${classVariables} cardValue right`}>{value}</p>
        </div>
    );
}

export default Card;
