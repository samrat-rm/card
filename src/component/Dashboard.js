import React, { useContext, useState, useEffect } from "react";
import Card from "./Card";
import cardContext from "../reducer/context";
import { useNavigate } from "react-router-dom";
import cardBG from "../assets/images/card_bg.svg";
import "../styles/dashboard.css";
import OpenCard from "./OpenCard";
import axios from "axios";
import { SocketContext } from "../reducer/socket";

function Dashboard() {
    let navigate = useNavigate();
    const [display, setDisplay] = useState("Start");
    const [state, action] = useContext(cardContext);
    const socket = useContext(SocketContext);
    const { roomID, ID } = state;
    socket.on("connect", () => {
        console.log(socket.id);
    });

    useEffect(() => {
        const timer = setTimeout(
            () =>
                axios
                    .post(process.env.REACT_APP_UPDATE_STATE, {
                        roomID,
                        ID,
                    })
                    .then(async (response) => {
                        const {
                            givenCards,
                            turn,
                            openCard,
                            drawDeck,
                            roomID,
                            ID,
                        } = response.data;
                        await action({
                            type: "UPDATE_STATE",
                            payload: {
                                givenCards,
                                turn,
                                openCard,
                                drawDeck,
                                roomID: roomID,
                                ID,
                            },
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setDisplay(err.message);
                    }),
            1000
        );

        return () => {
            socket.off("updateJoin");
            return clearTimeout(timer);
        };
    }, [state, socket]);

    const GivenCardComp = state.givenCards.map((card, ind) => {
        return (
            <Card
                cardInd={ind}
                key={ind}
                display={display}
                setDisplay={setDisplay}
                suit={card.suit}
                value={card.value}
            />
        );
    });

    useEffect(() => {
        if (ID != state.turn) {
            setDisplay("Wait for your turn");
        } else {
            setDisplay("");
        }
        if (state.givenCards.length <= 0) {
            axios
                .post(process.env.REACT_APP_CLOSE_GAME, { roomID, ID })
                .then(() => {
                    navigate("/join");
                });
        }
    }, [state]);
    async function drawCard() {
        const { roomID, ID } = state;
        if (ID != state.turn) {
            return setDisplay("Wait for your turn");
        } else {
            setDisplay("");
        }
        if (state.givenCards.length > 0) {
            await axios
                .post(process.env.REACT_APP_DRAW_CARD, { roomID, ID })
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
                            console.log("update state");
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
            alert("You won");
        }
    }
    return (
        <div>
            {" "}
            <div className="draw-card-container">
                <button className="draw-card" onClick={drawCard}>
                    <p>Draw a card </p>
                    <img src={cardBG} className="bg-image" alt="" />
                </button>
                <OpenCard bgColor={"black"} />
            </div>
            {GivenCardComp.length > 0 ? (
                <div className="given-card-continer">{GivenCardComp}</div>
            ) : (
                <h1 className="winner">Winner</h1>
            )}
            <p>{display}</p>
        </div>
    );
}

export default Dashboard;
