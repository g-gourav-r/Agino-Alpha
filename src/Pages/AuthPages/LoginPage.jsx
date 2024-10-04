import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background/BackgroundImage";
import createApiCall, { POST } from "../../components/api/api";
import { v4 as uuidv4 } from 'uuid';

function LoginPage() {

    const navigate = useNavigate();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const email = form.email.value;
        const password = form.password.value;
        let isValid = true;

        setEmailError("");
        setPasswordError("");
        setLoginError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError("Please provide a valid email address.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Please enter your password.");
            isValid = false;
        }

        if (isValid) {
            const loginApiCall = createApiCall("login", POST);
            setLoading(true);
            localStorage.removeItem('database');
            localStorage.removeItem('databaseAliasName');
            localStorage.removeItem('sessionId');
            loginApiCall({
                body: { username: email, password: password },
            })
              .then(response => {
                setLoading(false);
                const token = response.token;
                localStorage.setItem('token', token);
                localStorage.setItem('psid', uuidv4());
                navigate('/home');
              })
              .catch(async error => {
                setLoading(false);
                let errorMessage = 'An unknown error occurred';
                if (error instanceof Response) {
                  try {
                    const errorResponse = await error.json(); 
                    errorMessage = errorResponse.message || errorMessage;
                  } catch (e) {
                    console.error('Failed to parse error response:', e);
                  }
                } else {
                  errorMessage = error.message || errorMessage;
                }
        
                setLoginError(errorMessage);
              });
        }
    };

    return (
        <Background>
            <div className="auth-page container-fluid vh-100 d-flex">
                <div className="row w-100 flex-grow-1">
                    <div className="col-12 d-none vh-100 d-md-block col-md-7 d-flex align-items-center justify-content-center">
                        <div className="brand-logo text-center">
                            <h1 className="vh-100 d-flex align-items-center justify-content-center">Agino</h1>
                        </div>
                    </div>
                    <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                        <div className="wrapper border p-5 rounded w-100 me-lg-4 mx-md-2">
                            <h2 className="text-center">Welcome Back</h2>
                            <p className="mb-4 text-center">Login to Agino</p>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <div className="input-group justify-content-center">
                                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                        <input 
                                            type="email" 
                                            className="form-control p-2" 
                                            placeholder="Email ID" 
                                            name="email"
                                            required 
                                        />
                                    </div>
                                    {emailError && <p className="error-text text-danger">{emailError}</p>}
                                </div>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                        <input 
                                             type={showPassword ? "text" : "password"}
                                            className="form-control p-2" 
                                            placeholder="Password" 
                                            name="password"
                                            required 
                                        />
                                                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
          <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i> {/* Toggle icon */}
        </span>
                                    </div>
                                    {passwordError && <p className="error-text text-danger">{passwordError}</p>}
                                    {loginError && <p className="error-text text-danger">{loginError}</p>}
                                </div>
                                <div className="btn-group d-flex">
                                    <button type="submit" className="btn-green p-1 px-lg-4 me-3">
                                        {loading ? (
                                            <div className="spinner-grow spinner-grow-sm text-success" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                    <button className="btn-black p-1 px-lg-4" onClick={() => navigate('/signup')}>Signup</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
}

export default LoginPage;
