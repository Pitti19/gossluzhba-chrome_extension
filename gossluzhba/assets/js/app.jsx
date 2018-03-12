import React from 'react';
import ReactDOM from 'react-dom';
import Content from './components/content.jsx';

class App extends React.Component {
  render() {

    return (
        <div className="app">
            <Content />
        </div>
        )
  }

}

ReactDOM.render(<App/>, document.querySelector('.root'));
