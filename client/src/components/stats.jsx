import React from 'react';
import Login from './login';
import Logo from './logo';
import Results from './results';
import Search from './search';
import Footer from './footer';

const Stats = React.createClass({
  render: function() {
    return (
      <div>
        <Logo/>
        <Login/>
        <div>
          <Results/>
          <Search/>
          <Footer/>
        </div>
      </div>
    );
  }
});

export default Stats;