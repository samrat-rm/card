import React, { useState, useContext } from "react";
import axios from "axios";
import cardContext from "../reducer/context";
import "../styles/join.css";
import { useNavigate } from "react-router-dom";
import { socket } from "../reducer/socket";

function Join() {
    const [roomID, setRoomID] = useState("");
    const [state, action] = useContext(cardContext);
    const navigate = useNavigate();
    async function joinRoom() {
        await axios
            .post(process.env.REACT_APP_CREATE_ROOM, { roomID })
            .then(async (response) => {
                const { openCard, givenCards, drawDeck, ID, roomID, turn } =
                    response.data;
                await action({
                    type: "UPDATE_STATE",
                    payload: {
                        openCard,
                        givenCards,
                        drawDeck,
                        ID,
                        roomID,
                        turn,
                    },
                });
                socket.emit("joinRoom", { id: roomID });
                navigate("/dashboard");
            });
    }
    return (
        <div className="join-container create-container">
            <input
                value={roomID}
                maxLength="4"
                className="join-room"
                placeholder="Enter room ID"
                onChange={(e) => setRoomID((prev) => e.target.value)}
            />

            <button onClick={joinRoom} className="join-button">
                Create
            </button>
        </div>
    );
}

export default Join;
