import React, { useState } from 'react';

function LoginPage({ onLoginSuccess }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone.trim() && password.trim()) {
            // 假设验证成功，真实项目应调用后端API
            onLoginSuccess();
        } else {
            alert('Please enter your phone number and password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="tel" 
                    placeholder="Phone number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;