import React, { useState } from 'react';

export function LoginView({ onLogin, onSignup }) {
    const [isSignup, setIsSignup] = useState(false);
    const [authError, setAuthError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        setAuthError("");
        setIsLoading(true);

        try {
            if (isSignup) {
                await onSignup(data.name, data.email, data.password);
                alert("Account created!");
            } else {
                await onLogin(data.email, data.password);
            }
        } catch (err) {
            setAuthError("Authentication failed. " + (err.response?.data || "Please check credentials."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
            <div style={{ background: '#222', padding: 40, borderRadius: 12, width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isSignup ? "Create Account" : "Log in to SUROOR"}</h2>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {isSignup && <input name="name" placeholder="Full Name" required style={{ padding: 12, borderRadius: 4, border: 'none', background: '#333', color: 'white' }} />}
                    <input name="email" type="email" placeholder="Email" required style={{ padding: 12, borderRadius: 4, border: 'none', background: '#333', color: 'white' }} />
                    <input name="password" type="password" placeholder="Password" required style={{ padding: 12, borderRadius: 4, border: 'none', background: '#333', color: 'white' }} />

                    {authError && <div style={{ color: '#ff4444', fontSize: 13, textAlign: 'center' }}>{authError}</div>}

                    <button type="submit" disabled={isLoading} style={{
                        padding: 12, borderRadius: 24, border: 'none',
                        background: isLoading ? '#555' : 'var(--brand-gold)',
                        color: 'black', fontWeight: 700, cursor: isLoading ? 'wait' : 'pointer', marginTop: 10,
                        transition: 'transform 0.1s'
                    }}>
                        {isLoading ? "Please wait..." : (isSignup ? "Sign Up" : "Log In")}
                    </button>
                </form>
                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#aaa', cursor: 'pointer' }} onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                </div>
            </div>
            <p style={{ marginTop: 20, color: '#666', fontSize: 12 }}>
                Note: Backend on Render free tier may take up to 50s to wake up on first login.
            </p>
        </div>
    );
}
