import Background from "../../components/background/background";
import Header from "../../components/header/header";
import InteractionWindow from "../../components/WindowTemplate/WindowTemplate";

function HomePage(){
    return(
        <Background>
            <div className="d-flex flex-column vh-100">
            <Header/>
            <InteractionWindow/>
            </div>
        </Background>
    )
}

export default HomePage;