function WindowTemplate({ sideBar, Maincontent }) {
    return (
        <div className="page-wrapper container-fluid h-100 d-flex flex-column">
            <div className="window-wrapper border my-2 flex-grow-1 rounded h-100">
                <div className="row g-0 h-100">
                    <div className="col-md-3 d-none d-md-block d-flex flex-column h-100">
                        <div className="side-bar d-flex flex-column flex-grow-1 h-100 overflow-auto">
                            {sideBar}
                            <div className="mt-auto p-3">
                                <button type="button" className="btn-green w-100 p-2">Feedback</button>
                            </div>
                        </div>
                    </div>
                    <div className="content-window col-12 col-md-9 h-100">
                        <div className="content-window-wrapper p-2 h-100">
                            <div className="main-content-window bg-light border h-100">
                                {Maincontent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WindowTemplate;
