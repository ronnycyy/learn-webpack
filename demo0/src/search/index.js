'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import '../../common';
import lion from './images/lion.jpeg';
import { funcA } from './tree-shaking';

class Search extends React.Component {

  render() {

    // Tree-Shaking 掉
    if (false) {
      console.log(funcA());
    }

    // 如果没开 devtool: (source map)，这里会看到打包后的代码，而不是用户写的源代码，用户很难调试
    // debugger;

    // 故意报错, 看行列信息
    // a = 1;

    return (
      <>
        <div className="search-text">秋卡</div>
        {/* 用一下 text，它就不会被 Tree-Shaking 掉 */}
        {/* <p>{funcA()}</p> */}
        <img src={lion} />
      </>
    )
  }

}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);