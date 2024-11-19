import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Background from "../../components/Background/BackgroundImage.jsx";
import createApiCall, { POST } from "../../components/api/api";

function SignupPage() {

    const navigate = useNavigate();

    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [signupError, setSignupError] = useState("");
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
      setShowRepeatPassword(!showRepeatPassword);
    };


    const validatePasswords = (password, repeatPassword) => {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    
        if (password !== repeatPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
    
        if (!passwordPattern.test(password)) {
            setPasswordError("Password must be at least 6 characters long, and include a mix of letters, numbers, and special characters.");
            return false;
        }
    
        setPasswordError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        const password = form.password.value;
        const repeatPassword = form.repeatPassword.value;
        const username = form.username.value;
        const email = form.email.value;

        let isValid = true;

        setPasswordError("");
        setEmailError("");
        setUsernameError("");
        setSignupError("");
        setSuccessMessage("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError("Please provide a valid email address.");
            isValid = false;
        }

        if (!username) {
            setUsernameError("Please add a username.");
            isValid = false;
        }

        if (!password || !repeatPassword) {
            setPasswordError("Please add a password.");
            isValid = false;
        } else if (!validatePasswords(password, repeatPassword)) {
            isValid = false;
        }

        if (isValid) {
            const signupApiCall = createApiCall("signup", POST);
            signupApiCall({
                body: { username: username, email: email, password: password },
            })
              .then(response => {
                setSuccessMessage("Account registered successfully. Please login")
              })
              .catch(async error => {
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
        
                setSignupError(errorMessage);
              });
        }
    };

    return (
        <Background>
            <form onSubmit={handleSubmit}>
                <div className="auth-page container-fluid vh-100 d-flex">
                    <div className="row w-100 flex-grow-1">
                        <div className="col-12 d-none vh-100 d-md-block col-md-7 d-flex align-items-center justify-content-center">
                            <div className="brand-logo text-center">
                                <h1 className="vh-100 d-flex align-items-center justify-content-center">Agino &alpha;</h1>
                            </div>
                        </div>
                        <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                            <div className="wrapper border p-5 rounded w-100 me-lg-4 mx-md-2">
                                <h3 className="text-center">Unleash the Power of Your Data</h3>
                                <p className="mb-4 text-center">Signup to Agino</p>
                                <div className="mb-3">
                                    <div className="input-group justify-content-center">
                                        <span className="input-group-text"><i className="bi bi-person"></i></span>
                                        <input
                                            type="text"
                                            className="form-control p-2"
                                            placeholder="Username"
                                            name="username"
                                        />
                                    </div>
                                    {usernameError && <p className="error-text text-danger">{usernameError}</p>}
                                </div>
                                <div className="mb-3">
                                    <div className="input-group justify-content-center">
                                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                        <input
                                            type="email"
                                            className="form-control p-2"
                                            placeholder="Email ID"
                                            name="email"
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
                                        />
                                        <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i> {/* Toggle icon */}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                        <input
                                            type={showRepeatPassword ? "text" : "password"}
                                            className="form-control p-2"
                                            placeholder="Repeat Password"
                                            name="repeatPassword"
                                        />
                                        <span className="input-group-text" onClick={toggleRepeatPasswordVisibility} style={{ cursor: 'pointer' }}>
                                            <i className={showRepeatPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i> {/* Toggle icon */}
                                        </span>
                                    </div>
                                    {passwordError && <p className="error-text text-danger">{passwordError}</p>}
                                    {successMessage && <p className="error-text text-success">{successMessage}</p>}
                                    {signupError && <p className="error-text text-danger">{signupError  }</p>}
                                </div>
                                <div className="btn-group d-flex">
                                    <button type="submit" className="btn-green p-1 px-lg-4 me-3">Signup</button>
                                    <button type="button" className="btn-black p-1 px-lg-4" onClick={() => navigate('/login')} >Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Background>
    );
}

export default SignupPage;
