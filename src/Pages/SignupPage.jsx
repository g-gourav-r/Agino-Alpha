function SignupPage(){
    return(
        <div className="auth-page container-fluid vh-100 d-flex">
            <div className="row w-100 flex-grow-1">
                <div className="col-12 d-none d-md-block col-md-7 d-flex align-items-center justify-content-center">
                </div>
                <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                <div className="wrapper border p-5 rounded w-100 me-lg-4 mx-md-2">
                <h3 className="text-center">Unleash the Power of Your Data</h3>
                        <p className="mb-4 text-center">Signup to Agino</p>
                        <div className="mb-3">
                            <div className="input-group justify-content-center">
                                <span className="input-group-text"><i class="bi bi-person"></i></span>
                                <input type="email" className="form-control p-2" placeholder="Username" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="input-group justify-content-center">
                                <span className="input-group-text"><i class="bi bi-envelope"></i></span>
                                <input type="email" className="form-control p-2" placeholder="Email ID" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                <input type="password" className="form-control p-2" placeholder="Password" />
                            </div>                        
                        </div>
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                <input type="password" className="form-control p-2" placeholder="Repeat Password" />
                            </div>                        
                        </div>
                        <div className="btn=group d-flex">
                            <button className="btn-green p-1 px-lg-4 me-3">Signup</button>
                            <button className="btn-black p-1 px-lg-4">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage;