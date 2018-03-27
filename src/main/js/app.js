'use strict';

import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import FaPencil from 'react-icons/lib/fa/pencil'

const FilterableTable = require('react-filterable-table');
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const root = '/api';



class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {projects: []}
  };

  componentDidMount() {
    client({method: 'GET', path: root + '/projects'}).done(response => {
      this.setState({projects: response.entity._embedded.projects});
    });
  }

  render() {
    return (
      <Container>
        <ProjectList projects={this.state.projects}/>
        <DeveloperFilterList/>
      </Container>
    );
  }
};

class ProjectList extends React.Component {

  constructor(props) {
    super(props);
  };

  render() {
    let projects = this.props.projects.map(project =>
      <Project projectKey={project._links.self.href} project={project}/>
    );
    return (
      <div>
        <h2>My projects</h2>
        <ButtonGroup block="true" vertical>
          <Button color="primary" size="lg" block="true" onClick={this.toggle}>
            <h4 className="panel-title">+ New Project</h4>
          </Button>
          {projects}
        </ButtonGroup>
      </div>
    )
  }
}

class Project extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {collapse: false};
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }

  render() {
    return (
      <div>
        <Button color="success" size="lg" block="true" onClick={this.toggle}>
          <h4 className="panel-title">{this.props.project.title}</h4>
        </Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <TaskList taskListKey={this.props.projectKey}/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {tasks: [], developers: [], dropdownOpen: false};
  }

  componentDidMount() {
    client({method: 'GET', path: this.props.taskListKey + '/tasks'}).done(response => {
      this.setState({tasks: response.entity._embedded.tasks});
    });
    client({method: 'GET', path: root + "/developers"}).done(response => {
      this.setState({developers: response.entity._embedded.developers});
    });
  }

  toggle() {
    this.setState({dropdownOpen: !this.state.dropdownOpen});
  }

  render() {
    let tasks = this.state.tasks.map(task =>
      <Task task={task}/>
    );
    let developers = this.state.developers.map(developer =>
      <DeveloperToAddProject developer={developer}/>
    );
    return (
      <div>

        // TODO ONLY FOR MANAGER
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            <h5>Add Developer to Project</h5>
          </DropdownToggle>
          <DropdownMenu>
            {developers}
          </DropdownMenu>
        </ButtonDropdown>

        // TODO ONLY FOR DEVELOPER
        <strong><label className="pull-right"><input type="checkbox"/> only my tasks</label></strong>

        <table className="table table-hover" id="task-table">
          <thead>
          <tr>
            <th>Task</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
          {tasks}
          {/*<AddTask />*/}
          </tbody>
        </table>
      </div>
    )
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {developerFullName: ""};
  }

  componentDidMount() {
    client({method: 'GET', path: this.props.task._links.developer.href}).done(response => {
      this.setState({developerFullName: response.entity.firstName + " " + response.entity.lastName});
    });
  }

  render() {
    return (
      <tr>
        <td>{this.props.task.description}</td>
        <td>{this.state.developerFullName}</td>
        <td>{this.props.task.status}</td>
        <td>
          <Button color="warning"><FaPencil/></Button>
        </td>
      </tr>
    )
  }
}

class DeveloperToAddProject extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let developerFullName = this.props.developer.firstName + " " + this.props.developer.lastName;
    return (
      <DropdownItem>{developerFullName}</DropdownItem>
    )
  }
}

class DeveloperFilterList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {developers: []};
  }

  componentDidMount() {
    client({method: 'GET', path: root + "/developers"}).done(response => {
      this.setState({developers: response.entity._embedded.developers});
    });
  }

  render() {
    let data = this.state.developers;

    let fields = [
      {name: 'firstName', displayName: "First Name", inputFilterable: true, sortable: true},
      {name: 'lastName', displayName: "Last Name", inputFilterable: true, sortable: true}
    ];
    return (
      <FilterableTable
        namespace="Developers"
        initialSort="firstName"
        data={data}
        fields={fields}
        noRecordsMessage="There are no developers to display"
        noFilteredRecordsMessage="No developers match your filters!"
      />
    )
  }
}

// class AddTask extends React.Component {
//   render() {
//     return (
//       <tr>
//         <td>+</td>
//         <td><input placeholder="Description"/></td>
//         <td>
//           <select name="assignee" id="assignee">
//             <option value="Bred">Bred</option>
//             <option value="Bob">Bob</option>
//             <option value="Bryan">Bryan</option>
//           </select>
//         </td>
//         <td>
//           <select name="status" id="status">
//             <option value="WAITING">WAITING</option>
//             <option value="IMPLEMENTATION">IMPLEMENTATION</option>
//             <option value="VERIFYING">VERIFYING</option>
//             <option value="RELEASING">RELEASING</option>
//           </select>
//         </td>
//       </tr>
//     )
//   }
// }
//

// class Signup extends React.Component {
//
//   render() {
//     return ()
//   }
// }

function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting/>;
  }
  return <GuestGreeting/>;
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar color="dark" className="navbar-dark navbar-expand-sm">
        <NavbarBrand><Link to='/'>Simple Task Tracker</Link></NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>
                <Greeting isLoggedIn={false}/>,
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const App = () => (
  <div>
    <Header/>
    <Main/>
  </div>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Profile}/>
      {/*<Route path='/signup' component={Signup}/>*/}
      {/*<Route path='/logout' component={Logout}/>*/}
      <Route path='/projects/:number/tasks/:number' component={Task}/>
    </Switch>
  </main>
);

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('react'));
