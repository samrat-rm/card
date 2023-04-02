import "./styles/App.css";
import reducer from "./reducer/index";
import { useReducer, useMemo } from "react";
import Dashboard from "./component/Dashboard";
// import cardContext from "./reducer/context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Join from "./component/Join";
import Create from "./component/Create";
import cardContext from "./reducer/context";
import { SocketContext, socket } from "./reducer/socket";

function App() {
    // let cardData = localStorage.getItem("CARD_DATA");
    // (cardData && JSON.parse(cardData)) ||
    const initialState = {
        openCard: {},
        givenCards: [],
        drawDeck: [],
        roomID: "",
        ID: 0,
    };
    const router = createBrowserRouter([
        {
            path: "/dashboard",
            element: <Dashboard />,
        },
        {
            path: "/join",
            element: (
                <div className="join-page">
                    <Join />
                    <Create />
                </div>
            ),
        },
    ]);
    const [state, action] = useReducer(reducer, initialState);
    const { roomID, ID } = state;
    console.log({ roomID, ID });
    const appValue = useMemo(() => {
        return [state, action];
    }, [state]);
    return (
        <SocketContext.Provider value={socket}>
            <cardContext.Provider value={appValue}>
                <RouterProvider router={router} />
            </cardContext.Provider>
        </SocketContext.Provider>
    );
}
export default App;
