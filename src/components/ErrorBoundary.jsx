import React from "react";

/**
 * 错误边界组件，用于捕获和处理子组件中的错误
 * 防止整个应用因单个组件的错误而崩溃
 */
export class ErrorBoundary extends React.Component{
  // 构造函数，初始化组件状态
  constructor(props){
    super(props);
    this.state = { hasError: false }; // 初始化错误状态为false
  }
  /**
   * 静态方法，当子组件抛出错误时调用
   * 返回更新后的state对象，用于标记错误状态
   * @returns {Object} 包含错误状态的对象
   */
/**
 * 静态方法 getDerivedStateFromError 用于在后代组件抛出错误后渲染备用 UI
 * 这是 React 生命周期的一部分，用于错误边界 (Error Boundary) 的实现
 * @returns {Object} 返回一个对象以更新 state，使组件能够回退到备用 UI 渲染
 */
  static getDerivedStateFromError(){
    return { hasError: true }; // 设置 hasError 为 true，触发错误状态的渲染
  }
  componentDidCatch(error, info){
    // 这里可以打点。现在先 console 吧。
    console.error("[ErrorBoundary]", error, info);
  }
  // 渲染组件内容的方法
  render(){
    // 检查组件是否有错误状态
    if (this.state.hasError){
      // 如果有错误，显示错误提示信息
      return <div style={{padding:"24px"}}>页面出了点状况，刷新看看。要是还不行，麻烦把操作步骤发我（越具体越好）。</div>;
    }
    // 如果没有错误，正常渲染子组件
    return this.props.children;
  }
}
