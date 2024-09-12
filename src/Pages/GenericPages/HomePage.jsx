import Background from "../../components/Background/BackgroundImage.jsx";
import Header from "../../components/header/header.jsx";

function HomePage(){
    return(
        <Background>
            <div className="d-flex flex-column vh-100">
                <Header/>
                <div className="d-flex h-100 align-items-center justify-content-center flex-column">
                    <h1 className="text-secondary">Hello User !!</h1>
                    <p>How can we help you today ?</p>
                </div>
            </div>
        </Background>
    )
}

export default HomePage;