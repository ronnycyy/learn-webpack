'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import lion from './images/lion.jpeg';

class Search extends React.Component {

  render() {
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