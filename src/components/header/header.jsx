import { useNavigate } from "react-router-dom";

function header({currentPage}){

  const navigate = useNavigate();

    return(
    <nav className="navbar navbar-expand-lg d-flex justify-content-between mx-2 mt-1 rounded">
        <div className="container-fluid header">
          <a className="navbar-brand" href="#">Agino</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2  mb-lg-0">
              <li className="nav-item">
                <a className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} aria-current="page" onClick={()=> navigate("/home")}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#">Reports</a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#">NoteEditor</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${currentPage === 'data-source' ? 'active' : ''}`} onClick={()=> navigate("/data-source")}>Data Source</a>
              </li>
            </ul>
            <div className="d-flex">
              <button className="btn-black p-2 r-4" type="submit"><i className="bi bi-person me-2"></i>Logout</button>
            </div>
          </div>
        </div>
      </nav>
    )
}

export default header;