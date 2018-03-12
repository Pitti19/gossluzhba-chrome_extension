import React from 'react';
import ReactDOM from 'react-dom';
import Messager from '../messager.js';

class Actions extends React.Component {
    render() {
        return <div className="actions-container">
                <Scrap updateVacancies={this.props.updateVacancies}/>
            </div>
    }
}

class Scrap extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return <button style={{margin: '5px 10px 0px'}}
            className="btn btn-danger"
            onClick={this.handleClick}>Собрать вакансии</button>
    }
    handleClick() {
        document.querySelector('.loader').classList.remove('hidden');
        Messager.sendScrap(this.props.updateVacancies);
    }
}


ReactDOM.render(<Actions/>, document.querySelector('.actions'));

export default Actions;
