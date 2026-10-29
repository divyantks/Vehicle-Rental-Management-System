
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate=useNavigate();
    const [role,setRole]=useState("");
    const [isRegister,setIsRegister]=useState(false);
    const [form,setForm]=useState({
        name:"",
        email:"",
        password:"",
        phone:"",
        licenceNo:"",
        address:""
    });
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    function updateForm(event) {
        setForm({...form,[event.target.name]:event.target.value});
    }

    async function submitForm(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint=isRegister
                ? "/api/auth/register"
                : role==="ADMIN"
                    ? "/api/auth/admin-login"
                    : "/api/auth/customer-login";

            const response=await fetch("http://localhost:8080"+endpoint,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(form)
            });

            const data=await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            if(isRegister) {
                setIsRegister(false);
                setRole("CUSTOMER");
                setError("Registration successful! Please log in.");
                setForm({...form,password:""});
                return;
            }

            localStorage.setItem("driveEaseRole",data.role);
            localStorage.setItem("driveEaseEmail",data.email);

            if(data.customerId) {
                localStorage.setItem("driveEaseCustomerId",data.customerId);
            }

            navigate(data.role==="ADMIN"?"/admin":"/");
        } catch(err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    if(!role) {
        return (
            <main className="login-page">
                <div className="login-brand">Drive<span>Ease</span></div>
                <section className="login-card role-card">
                    <p className="login-eyebrow">WELCOME TO DRIVE EASE</p>
                    <h1>Let's get you moving.</h1>
                    <p className="login-description">Choose how you want to continue.</p>

                    <button className="role-option" onClick={()=>setRole("CUSTOMER")}>
                        <span className="role-icon">👤</span>
                        <span><strong>Login as Customer</strong><small>Explore and book vehicles</small></span>
                        <span className="role-arrow">→</span>
                    </button>

                    <button className="role-option" onClick={()=>setRole("ADMIN")}>
                        <span className="role-icon">🛡️</span>
                        <span><strong>Login as Admin</strong><small>Manage your rental business</small></span>
                        <span className="role-arrow">→</span>
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="login-page">
            <div className="login-brand">Drive<span>Ease</span></div>

            <section className="login-card">
                <button className="login-back" onClick={()=>{setRole("");setError("");setIsRegister(false);}}>
                    ← Change role
                </button>

                <p className="login-eyebrow">{role==="ADMIN"?"ADMIN PORTAL":"CUSTOMER PORTAL"}</p>
                <h1>{isRegister?"Create your account":"Welcome back"}</h1>
                <p className="login-description">
                    {isRegister?"Register to start booking vehicles.":"Enter your credentials to continue."}
                </p>

                <form onSubmit={submitForm} className="login-form">
                    {isRegister && (
                        <>
                            <label>Full name<input name="name" value={form.name} onChange={updateForm} required /></label>
                            <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={updateForm} required /></label>
                            <label>Driving licence number<input name="licenceNo" value={form.licenceNo} onChange={updateForm} required /></label>
                            <label>Address (optional)<input name="address" value={form.address} onChange={updateForm} /></label>
                        </>
                    )}

                    <label>Email address<input name="email" type="email" value={form.email} onChange={updateForm} required /></label>
                    <label>Password<input name="password" type="password" value={form.password} onChange={updateForm} minLength={isRegister?8:1} required /></label>

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-submit" type="submit" disabled={loading}>
                        {loading?"Please wait...":isRegister?"Create Account":"Login"}
                    </button>
                </form>

                {role==="CUSTOMER" && (
                    <p className="login-switch">
                        {isRegister?"Already have an account?":"New to DriveEase?"}
                        <button onClick={()=>{setIsRegister(!isRegister);setError("");}}>
                            {isRegister?"Login":"Create account"}
                        </button>
                    </p>
                )}
            </section>
        </main>
    );
}

export default Login;
