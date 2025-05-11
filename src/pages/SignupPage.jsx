import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaLock, FaSpinner, FaChevronDown } from 'react-icons/fa';


// 国家区号数据
const countryCode = [
  {code: '+86', name: 'China', flag: 'CN'},
  {code: '+1', name: 'the United States', flag: 'US'},
  {code: '+44', name: 'the United Kingdom', flag: 'GB'},
  {code: '+81', name: 'Japan', flag: 'JP'},
  {code: '+82', name: 'Korea', flag: 'KR'},
  {code: '+33', name: 'France', flag: 'FR'},
];


const getFlagEmoji = (countryCode) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(char.charCodeAt() + 127397));
};

// 动画定义
const CountrySelect = styled.div`
  position: relative;
  display: inline-block;
  width: 100px;
  margin-right: 10px;
`;

const CountryDropDown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const CountryOption = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
  
  background-color: #f5f5f5;
  }
`;

const SelectedCountry = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  background: white;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

// ========================================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 样式组件
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: calc(100% - 60px);
  padding: 15px 15px 15px 45px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
  
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  @media (max-width: 480px) {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }
`;

const PhoneNumberInput = styled(Input)`
  flex: 1;
  width: auto;
  padding-left: 15px;
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(to right, #5a6fd1, #6a4299);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  margin-right: 10px;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: right;
  color: #667eea;
  font-size: 14px;
  margin-top: 10px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #eee;
  }
  
  span {
    padding: 0 10px;
    color: #999;
    font-size: 14px;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
  
  &:hover {
    background: #f9f9f9;
  }
`;

const GoogleIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2342B350' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E");
  background-size: contain;
`;

const FacebookIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%231877F2' d='M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.626 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.748V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.979 48 24z'/%3E%3C/svg%3E");
  background-size: contain;
`;

const SignUpText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function LoginPage({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCode[0]);
  const [showCountryDropDown, setShowCountryDropDown] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCountryDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validatePhone = (phone) => {
    const regex = /^[0-9]{8,15}$/; // 调整为不包含区号验证
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${phone}`;
    console.log('Full Phone Number:', fullPhoneNumber);
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLoginSuccess();
    } catch (err) {
      setError('Invalid phone number or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Welcome Back</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <PhoneInputContainer>
              <CountrySelect ref={wrapperRef}>
                <SelectedCountry onClick={() => setShowCountryDropDown(!showCountryDropDown)}>
                  {selectedCountry.flag} {selectedCountry.code}
                  <FaChevronDown style={{ marginLeft: '5px' }} />
                </SelectedCountry>
                {showCountryDropDown && (
                  <CountryDropDown>
                    {countryCode.map((country) => (
                      <CountryOption
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropDown(false);
                        }}
                      >
                        {getFlagEmoji(country.flag)} {country.name} {country.code}
                      </CountryOption>
                    ))}
                  </CountryDropDown>
                )}
              </CountrySelect>
              <PhoneNumberInput
                type="tel" 
                placeholder="Phone number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
             </PhoneInputContainer>
          </FormGroup>
          
          <FormGroup>
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Login'}
          </Button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Remember me
            </label>
            
            <ForgotPassword href="#">Forgot password?</ForgotPassword>
          </div>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner /> Logging in...
              </>
            ) : 'Login'}
          </Button>
        </form>
        
        <Divider><span>OR</span></Divider>
        
        <SocialButton>
          <GoogleIcon />
          Continue with Google
        </SocialButton>
        
        <SocialButton>
          <FacebookIcon />
          Continue with Facebook
        </SocialButton>
        
        <SignUpText>
          Don't have an account? <a href="#">Sign up</a>
        </SignUpText>
      </LoginCard>
    </Container>
  );
}

export default LoginPage;