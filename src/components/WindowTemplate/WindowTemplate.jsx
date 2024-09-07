function WindowTemplate() {
    return (
        <div className="page-wrapper container-fluid h-100 d-flex flex-column">
            <div className="window-wrapper border my-2 flex-grow-1 rounded h-100">
                <div className="row g-0 h-100">
                    <div className="col-md-3 d-none d-md-block h-100">
                        <div className="container-fluid side-bar h-100">
                            
                        </div>
                    </div>
                    <div className="content-window col-11 col-md-9 h-100">
                        <div className="content-window-wrapper container-fluid main-window p-2 h-100">
                            <div className="main-content-window container-fluid border h-100">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WindowTemplate;
