import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你可以将错误记录到日志服务
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了，请稍后再试。</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
