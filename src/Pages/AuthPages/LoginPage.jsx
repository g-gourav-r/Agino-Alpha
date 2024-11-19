import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background/BackgroundImage";
import createApiCall, { GET, POST } from "../../components/api/api";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { toast, ToastContainer } from 'react-toastify';

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const googleAuth = createApiCall("auth/google", GET);

  const handleAuth = () => {
    setLoading(true);
    toast.loading("Authenticating...");  
    window.location.href = "https://primus-1ppt.onrender.com/auth/google";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", { autoClose: 3000 });
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty.", { autoClose: 3000 });
      return;
    }

    // If valid, make the API call
    const loginApiCall = createApiCall("login", POST);
    setLoading(true);

    const fetchToastId = toast.loading("Logging in...");
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

        // Update the toast on success
        toast.update(fetchToastId, {
          render: "Login successful!",
          type: "success",
          isLoading: false,
          autoClose: 200,
        });

        setTimeout(() => {
          navigate('/home'); // Navigate after toast is displayed
        }, 300);
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

        // Update the toast on error
        toast.update(fetchToastId, {
          render: `Error: ${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <Background>
      <ToastContainer /> {/* Toastify container for notifications */}
      <div className="auth-page container-fluid vh-100 d-flex">
        <div className="row w-100 flex-grow-1">
          <div className="col-12 d-none vh-100 d-md-block col-md-7 d-flex align-items-center justify-content-center">
            <div className="brand-logo text-center">
              <h1 className="vh-100 d-flex align-items-center justify-content-center">Agino &alpha;</h1>
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
                </div>
                <div className="btn-group d-flex">
                  <button type="submit" className="btn-green p-1 px-lg-4 me-3" disabled={loading}>
                    Login
                  </button>
                  <button type="button" className="btn-black p-1 px-lg-4 me-3" onClick={() => navigate('/signup')}>
                    Signup
                  </button>
                  <button type="button" className="btn-black p-1 px-lg-4 d-flex align-items-center justify-items-center" onClick={handleAuth} disabled={loading}>
                    <FontAwesomeIcon icon={faGoogle}/>&nbsp;&nbsp;Continue with Google
                  </button>
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
