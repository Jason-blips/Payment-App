import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaSpinner, FaChevronDown, FaEnvelope, FaCheck, FaLock, FaPhone } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';

// ========== 常量数据 ==========
const countryCode = [
  { code: '+86', name: 'China', flag: 'CN' },
  { code: '+1', name: 'the United States', flag: 'US' },
  { code: '+44', name: 'the United Kingdom', flag: 'GB' },
  { code: '+81', name: 'Japan', flag: 'JP' },
  { code: '+82', name: 'Korea', flag: 'KR' },
  { code: '+33', name: 'France', flag: 'FR' },
];

const REGISTER_STEPS = {
  PHONE_VERIFICATION: 1,
  EMAIL_VERIFICATION: 2,
  HUMAN_VERIFICATION: 3,
  PASSWORD_SETUP: 4
};

// 全局标语样式
const GlobalBanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;


// ========== API配置 ==========
const API_BASE_URL = 'https://your-api-endpoint.com/api';
const API = {
  sendEmailCode: (email) => axios.post(`${API_BASE_URL}/send-email-code`, { email }),
  verifyEmailCode: (email, code) => axios.post(`${API_BASE_URL}/verify-email-code`, { email, code }),
  register: (data) => axios.post(`${API_BASE_URL}/register`, data)
};

// ========== 样式组件 ==========
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  padding: 30px;
  animation: ${fadeIn} 0.6s ease-out;
  overflow: hidden;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  margin-top: 8px;
  width: 100%;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Input = styled.input`
  width: 100%;
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
  margin-top: 20px;
  margin-bottom: 10px;
  
  &:hover {
    background: linear-gradient(to right, #5a6fd1, #6a4299);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.p`
  font-size: 14px;
  margin-top: 5px;
  min-height: 20px;
`;

const ErrorMessage = styled(Message)`
  color: #e74c3c;
`;

const SuccessMessage = styled(Message)`
  color: #2ecc71;
`;

const VerificationCodeContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const VerificationCodeButton = styled.button`
  padding: 10px 15px;
  background: ${props => props.disabled ? '#ccc' : '#667eea'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  min-width: 100px;
`;

const CountrySelectWrapper = styled.div`
  position: relative;
  margin-right: 10px;
  min-width: 120px;
`;

const CountryDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
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

const SliderContainer = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
`;

const Checkmark = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2ecc71;
  color: white;
  margin-left: 10px;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  width: 100%;
`;

// ========== 主组件 ==========
function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(REGISTER_STEPS.PHONE_VERIFICATION);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    countryCode: '+86'
  });
  const [codes, setCodes] = useState({
    phoneCode: '',
    emailCode: ''
  });
  const [sliderValue, setSliderValue] = useState(0);
  const [uiState, setUiState] = useState({
    error: '',
    success: '',
    isLoading: false,
    countdown: 0,
    showCountryDropdown: false
  });

  const wrapperRef = useRef();

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .split('')
      .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
      .join('');
  };

  // 表单处理函数
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectCountry = (country) => {
    setFormData(prev => ({ ...prev, countryCode: country.code }));
    setUiState(prev => ({ ...prev, showCountryDropdown: false }));
  };

  // 验证函数
  const validatePhone = (phone) => /^[0-9]{8,15}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  // 倒计时效果
  useEffect(() => {
    if (uiState.countdown > 0) {
      const timer = setTimeout(() => 
        setUiState(prev => ({ ...prev, countdown: prev.countdown - 1 })), 1000);
      return () => clearTimeout(timer);
    }
  }, [uiState.countdown]);

  // 点击外部关闭国家选择下拉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setUiState(prev => ({ ...prev, showCountryDropdown: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 发送验证码
  const sendVerificationCode = async () => {
    setUiState(prev => ({ ...prev, error: '', isLoading: true }));
    
    try {
      if (step === REGISTER_STEPS.PHONE_VERIFICATION) {
        if (!validatePhone(formData.phone)) {
          throw new Error('Please enter a valid phone number');
        }
        
        // 生成随机6位验证码并输出到控制台
        const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
        setCodes(prev => ({ ...prev, phoneCode }));
        console.log('Phone verification code (for development):', phoneCode);
        
        setUiState(prev => ({
          ...prev,
          isLoading: false,
          countdown: 60,
          success: `Verification code sent to console (development mode)`
        }));
      } else {
        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address');
        }
        
        // 实际API调用发送邮箱验证码
        const response = await API.sendEmailCode(formData.email);
        setCodes(prev => ({ ...prev, emailCode: response.data.code }));
        
        setUiState(prev => ({
          ...prev,
          isLoading: false,
          countdown: 60,
          success: `Verification code sent to your email`
        }));
      }
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || err.message || 'Failed to send verification code'
      }));
    }
  };

  // 验证验证码
  const verifyCode = async () => {
    if (!formData.verificationCode) {
      setUiState(prev => ({ ...prev, error: 'Please enter verification code' }));
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      if (step === REGISTER_STEPS.PHONE_VERIFICATION) {
        // 直接比较控制台输出的验证码
        if (formData.verificationCode !== codes.phoneCode) {
          throw new Error('Invalid verification code');
        }
      } else {
        // 实际API验证邮箱验证码
        const response = await API.verifyEmailCode(formData.email, formData.verificationCode);
        if (!response.data.success) {
          throw new Error('Invalid verification code');
        }
      }
      
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        success: 'Verification successful!'
      }));
      
      // 进入下一步
      if (step === REGISTER_STEPS.PHONE_VERIFICATION) {
        setStep(REGISTER_STEPS.EMAIL_VERIFICATION);
      } else if (step === REGISTER_STEPS.EMAIL_VERIFICATION) {
        setStep(REGISTER_STEPS.HUMAN_VERIFICATION);
      }
      
      // 清空验证码输入
      setFormData(prev => ({ ...prev, verificationCode: '' }));
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Invalid verification code'
      }));
    }
  };

  // 滑块验证完成
  const handleSliderChange = (value) => {
    setSliderValue(value);
    if (value === 100) {
      setUiState(prev => ({ ...prev, success: 'Verification complete! Please set your password.' }));
      setTimeout(() => setStep(REGISTER_STEPS.PASSWORD_SETUP), 500);
    }
  };

  // 提交注册
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      setUiState(prev => ({ ...prev, error: 'Password must be at least 8 characters' }));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setUiState(prev => ({ ...prev, error: 'Passwords do not match' }));
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      // 准备注册数据
      const registrationData = {
        phone: formData.phone,
        countryCode: formData.countryCode,
        email: formData.email,
        password: formData.password
      };
      
      // 实际API调用
      await API.register(registrationData);
      
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        success: 'Registration successful! Redirecting...'
      }));
      
      // 3秒后跳转到登录页面
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.'
      }));
    }
  };

  // 渲染当前步骤的表单
  const renderCurrentStep = () => {
    switch (step) {
      case REGISTER_STEPS.PHONE_VERIFICATION:
        return (
          <>
            <FormGroup>
              <label>Phone Number</label>
              <PhoneInputContainer>
                <CountrySelectWrapper ref={wrapperRef}>
                  <button 
                    onClick={() => setUiState(prev => ({ ...prev, showCountryDropdown: !prev.showCountryDropdown }))}
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '15px',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <span>
                      {getFlagEmoji(formData.countryCode)} {formData.countryCode}
                    </span>
                    <FaChevronDown style={{ marginLeft: '5px' }} />
                  </button>
                  
                  {uiState.showCountryDropdown && (
                    <CountryDropdown>
                      {countryCode.map((country) => (
                        <CountryOption
                          key={country.code}
                          onClick={() => selectCountry(country)}
                        >
                          {getFlagEmoji(country.flag)} {country.name} {country.code}
                        </CountryOption>
                      ))}
                    </CountryDropdown>
                  )}
                </CountrySelectWrapper>
                
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '15px' }}
                />
              </PhoneInputContainer>
            </FormGroup>
            
            <FormGroup>
              <label>Verification Code</label>
              <VerificationCodeContainer>
                <InputContainer>
                  <InputIcon><FaPhone /></InputIcon>
                  <Input
                    type="text"
                    name="verificationCode"
                    placeholder="Enter 6-digit code"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    maxLength="6"
                  />
                </InputContainer>
                <VerificationCodeButton
                  onClick={sendVerificationCode}
                  disabled={uiState.countdown > 0 || !formData.phone || uiState.isLoading}
                >
                  {uiState.countdown > 0 ? `${uiState.countdown}s` : 'Get Code'}
                </VerificationCodeButton>
              </VerificationCodeContainer>
            </FormGroup>
            
            <Button 
              onClick={verifyCode}
              disabled={!formData.verificationCode || uiState.isLoading}
            >
              {uiState.isLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : 'Next'}
            </Button>
          </>
        );
      
      case REGISTER_STEPS.EMAIL_VERIFICATION:
        return (
          <>
            <FormGroup>
              <label>Email Address</label>
              <InputContainer>
                <InputIcon><FaEnvelope /></InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </InputContainer>
            </FormGroup>
            
            <FormGroup>
              <label>Verification Code</label>
              <VerificationCodeContainer>
                <InputContainer>
                  <InputIcon><FaEnvelope /></InputIcon>
                  <Input
                    type="text"
                    name="verificationCode"
                    placeholder="Enter 6-digit code"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    maxLength="6"
                  />
                </InputContainer>
                <VerificationCodeButton
                  onClick={sendVerificationCode}
                  disabled={uiState.countdown > 0 || !formData.email || uiState.isLoading}
                >
                  {uiState.countdown > 0 ? `${uiState.countdown}s` : 'Get Code'}
                </VerificationCodeButton>
              </VerificationCodeContainer>
            </FormGroup>
            
            <Button 
              onClick={verifyCode}
              disabled={!formData.verificationCode || uiState.isLoading}
            >
              {uiState.isLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : 'Next'}
            </Button>
          </>
        );
      
      case REGISTER_STEPS.HUMAN_VERIFICATION:
        return (
          <>
            <SliderContainer>
              <div style={{ marginBottom: '15px', color: '#666' }}>
                Slide to verify you're human
                {sliderValue === 100 && <Checkmark><FaCheck size={12} /></Checkmark>}
              </div>
              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                railStyle={{ backgroundColor: '#eee', height: 8 }}
                trackStyle={{ backgroundColor: '#667eea', height: 8 }}
                handleStyle={{
                  borderColor: '#667eea',
                  height: 24,
                  width: 24,
                  marginTop: -8,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                disabled={sliderValue === 100}
              />
            </SliderContainer>
          </>
        );
      
      case REGISTER_STEPS.PASSWORD_SETUP:
        return (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Password</label>
              <InputContainer>
                <InputIcon><FaLock /></InputIcon>
                <Input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </InputContainer>
            </FormGroup>
            
            <FormGroup>
              <label>Confirm Password</label>
              <InputContainer>
                <InputIcon><FaLock /></InputIcon>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </InputContainer>
            </FormGroup>
            
            <Button type="submit" disabled={uiState.isLoading}>
              {uiState.isLoading ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} /> 
                  Registering...
                </>
              ) : 'Complete Registration'}
            </Button>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalBanner>
        Let's create something interesting.
      </GlobalBanner>

      <Container>
        <RegisterCard>
          <Title>Create Your Account</Title>
          
          {uiState.error && <ErrorMessage>{uiState.error}</ErrorMessage>}
          {uiState.success && !uiState.error && <SuccessMessage>{uiState.success}</SuccessMessage>}
          
          {renderCurrentStep()}
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/login" style={{ color: '#667eea' }}>Sign in</Link>
          </div>
        </RegisterCard>
      </Container>
    </>
  );
}

export default SignUpPage;