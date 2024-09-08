import WindowTemplate from "../components/WindowTemplate/WindowTemplate";
import Background from "../components/background/background";
import Header from "../components/header/header";
import ChatHistory from "../components/chathistory/chathistory";
import ChatWindow from "../components/ChatWindow/ChatWindow";
import React, { useState } from 'react';




function notepad(){

    return (

        <Background>
        <div className="d-flex flex-column vh-100">
            <Header currentPage={"notepad"}/>
            <WindowTemplate
                Maincontent={"Failed to get endpoint"}
                sideBar={"Failed to get endpoint"}
            />
        </div>
    </Background>

    );
}

export default notepad;