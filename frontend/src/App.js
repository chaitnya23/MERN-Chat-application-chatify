import "./styles/bootstrap.css";
import "./styles/App.css";
import io from "socket.io-client";
import UserLogin from "./componants/UserLogin";
import { Route, useHistory } from "react-router-dom";
import ChatPage from "./componants/ChatPage";
import MessageBox from "./componants/MessageBox";
import UserIdContext from "./Context/UserIdContext";
//const socket = io.connect('http://localhost:4000/');
import { ChatState } from "./Context/UserIdContext";
import { useEffect } from "react";
import GroupChat from "./componants/GroupChat";

function App() {
  

  const history = useHistory();

  
  return (
    
      <div className="App">
        <Route exact path="/auth">
          <UserLogin />
        </Route>

        <Route exact path="/chatpage">
          <ChatPage />
        </Route>

        <Route exact path="/rooms">
          <GroupChat/>
        </Route>
      </div>
 
  );
}

export default App;
