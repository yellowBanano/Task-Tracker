'use strict';

// import 'bootstrap/dist/css/bootstrap.css';
const React = require('react');
const ReactDOM = require('react-dom');

const root = '/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {managers: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/managers'}).done(response => {
            this.setState({managers: response.entity._embedded.managers});
        });
    }

    render() {
        return (
			<ManagerList managers={this.state.managers}/>
        )
    }
}

class ManagerList extends React.Component{
    render() {
        var managers = this.props.managers.map(manager =>
			<Manager key={manager._links.self.href} manager={manager}/>
        );
        return (
			<table>
				<tbody>
				<tr>
					<th>E-mail</th>
					<th>First Name</th>
					<th>Last Name</th>
				</tr>
                {managers}
				</tbody>
			</table>
        )
    }
}

class Manager extends React.Component{
    render() {
        return (
			<tr>
				<td>{this.props.manager.email}</td>
				<td>{this.props.manager.firstName}</td>
				<td>{this.props.manager.lastName}</td>
			</tr>
        )
    }
}

ReactDOM.render(
	<App />,
    document.getElementById('react')
)

