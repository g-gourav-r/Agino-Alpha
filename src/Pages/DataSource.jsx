import WindowTemplate from "../components/WindowTemplate/WindowTemplate";
import Background from "../components/Background/Background";
import Header from "../components/header/header";
import AddDataSource from "../components/AddDataSource/AddDataSource";

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