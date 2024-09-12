import WindowTemplate from "../components/WindowTemplate/WindowTemplate.jsx";
import Background from "../components/Background/BackgroundImage.jsx";
import Header from "../components/header/header.jsx";
import AddDataSource from "../components/AddDataSource/AddDataSource.jsx";

function DataSource(){
    return (

        <Background>
        <div className="d-flex flex-column vh-100">
        <Header currentPage={"data-source"}/>
        <WindowTemplate
            Maincontent={<AddDataSource/>}
        />
        </div>
    </Background>

    );
}

export default DataSource;