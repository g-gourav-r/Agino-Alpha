import WindowTemplate from "../components/WindowTemplate/WindowTemplate";
import Header from "../components/header/header";
import React, { useState } from 'react';

function notepad(){

    return (

     
        <div className="d-flex flex-column vh-100">
            <Header currentPage={"notepad"}/>
            <WindowTemplate
                Maincontent={"Failed to get endpoint"}
                sideBar={"Failed to get endpoint"}
            />
        </div>


    );
}

export default notepad;