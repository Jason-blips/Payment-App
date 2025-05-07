import React, { useState, useEffect } from 'react';

function VerificationPage() {
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = () => {
        if (code === '040322') {
            setIsVerified(true);
            alert('Verification successful!');
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const handleResend = () => {
        if (countdown === 0) {
            setCountdown(60);
            alert('A new verification code has been sent.');
        }
    };

    return (
        <div className="verification-container">
            <h2>Enter Verification Code</h2>
            <div className="input-group">
                <input 
                    type="text" 
                    placeholder="6-digit code" 
                    maxLength={6} 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    disabled={isVerified}
                />
                <button 
                    onClick={handleSubmit}
                    disabled={isVerified || code.length < 6}
                >
                    {isVerified ? 'Verified' : 'Submit'}
                </button>
            </div>
            <p className="countdown" onClick={handleResend}>
                {countdown > 0 ? 
                    `Resend code in ${countdown}s` : 
                    'Click to resend code'
                }
            </p>
            {isVerified && <p className="success-message">Verification complete!</p>}
        </div>
    );
}

export default VerificationPage;