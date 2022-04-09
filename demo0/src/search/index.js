'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import '../../common';
import lion from './images/lion.jpeg';
import { funcA } from './tree-shaking';

class Search extends React.Component {

  constructor() {
    super(...arguments);
    this.state = { Text: null };   // 初始组件设置为 null
  }

  loadComponent() {
    // 懒加载组件
    // 基于 @babel/plugin-syntax-dynamic-import，可以用 ESM 的语法写动态 import
    import('./text.js').then(T => {
      this.setState({ Text: T.default });
    })
  }

  render() {

    // Tree-Shaking 掉
    if (false) {
      console.log(funcA());
    }

    // 如果没开 devtool: (source map)，这里会看到打包后的代码，而不是用户写的源代码，用户很难调试
    // debugger;

    // 故意报错, 看行列信息
    // a = 1;

    const { Text } = this.state;

    return (
      <>
        <div className="search-text">秋卡</div>

        {/* 动态引入的组件 */}
        {
          Text ? <Text /> : null
        }

        {/* 用一下 text，它就不会被 Tree-Shaking 掉 */}
        {/* <p>{funcA()}</p> */}

        <img src={lion} onClick={this.loadComponent.bind(this)} />
      </>
    )
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);