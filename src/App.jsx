import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import PaymentPasswordPage from './pages/PaymentPasswordPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div>
            {isLoggedIn ? (
                <VerificationPage />
            ) : (
                <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </div>
    );
}

export default App;