'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import lion from './images/lion.jpeg';

class Search extends React.Component {

  render() {

    // 如果没开 devtool: (source map)，这里会看到打包后的代码，而不是用户写的源代码，用户很难调试
    // debugger;


    a = 1;

    return (
      <>
        <div className="search-text">秋卡</div>
        <img src={lion} />
      </>
    )
  }

}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);