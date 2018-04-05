'use strict';

import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody, CardHeader,
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
  NavLink,
  Table
} from "reactstrap";
import FaPencil from 'react-icons/lib/fa/pencil'
import FaPlus from 'react-icons/lib/fa/plus'
import TaskDetails from "./modules/TaskDetails";

const FilterableTable = require('react-filterable-table');
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const when = require('when');

const root = '/api';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {projects: [], currentUser: {}, isManager: false}
  };

  componentDidMount() {
    // --------------------- TEST USER ------------------------------
    client({method: 'GET', path: root + "/users/7"}).done(response => {
      this.setState({
        currentUser: response.entity,
        isManager: response.entity._links.self.href.includes('managers')
      });
    });
    // --------------------------------------------------------------
    this.loadProjectsFromServer();
  }

  // --------------------- LOAD ALL PROJECTS (ONLY FOR TESTS) ------------------------------
  // loadProjectsFromServer() {
  //   follow(client, root, [
  //     {rel: 'projects'}]
  //   ).then(projectsCollection => {
  //     return client({
  //       method: 'GET',
  //       path: projectsCollection.entity._links.self.href,
  //       headers: {'Accept': 'application/json'}
  //     });
  //   }).then(projectsCollection => {
  //     return projectsCollection.entity._embedded.projects.map(project =>
  //       client({
  //         method: 'GET',
  //         path: project._links.self.href
  //       })
  //     );
  //   }).then(projectPromises => {
  //     return when.all(projectPromises);
  //   }).done(projects => {
  //     this.setState({
  //       projects: projects
  //     });
  //   });
  // }
  // ---------------------------------------------------------------------------------------

  loadProjectsFromServer() {
    follow(client, root, [
      {rel: 'users'}]
    ).then(usersCollection => {
      return client({
        method: 'GET',
        path: usersCollection.entity._links.self.href,
        headers: {'Accept': 'application/json'}
      });
    }).done(usersCollection => {
      let projectsLink = this.state.isManager === true ? '/myProjects' : '/projects';
      let managersAndDevelopers = usersCollection.entity._embedded;
      let usersWithRole = this.state.isManager ? managersAndDevelopers.managers : managersAndDevelopers.developers;
      return usersWithRole
        .filter(user => user.email === this.state.currentUser.email)
        .map(user => {
          client({
            method: 'GET',
            path: user._links.self.href + projectsLink
          }).done(projects => {
            this.setState({
              projects: projects.entity._embedded.projects
            });
          });
        });
    });
  }

  onCreate(newProject) {
    follow(client, root, ['projects']
    ).then(projectsCollection => {
      return client({
        method: 'POST',
        path: projectsCollection.entity._links.self.href,
        entity: newProject,
        headers: {'Content-Type': 'application/json'}
      });
    }).done(project => {
      return client({
        method: 'PUT',
        path: project.entity._links.manager.href,
        entity: this.state.currentUser,
        headers: {'Content-Type': 'text/uri-list'}
      });
    });
    this.loadProjectsFromServer();
  }

  render() {
    let developerFilterList = this.state.isManager ? <DeveloperFilterList/> : '';

    return (
      <div>
        <ProjectList currentUser={this.state.currentUser} projects={this.state.projects}
                     isManager={this.state.isManager}/>
        {developerFilterList}
      </div>
    )
  }
}

class ProjectList extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {collapse: false, title: ''};
  };

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }

  handleChange(event) {
    this.setState({title: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (confirm("Your life begins to change the day you take responsibility for it.")) {
      let newProject = {};
      let titleAttribute = 'title';
      let statusAttribute = 'status';
      newProject[titleAttribute] = this.state.title;
      newProject[statusAttribute] = 'WAITING';
      this.props.onCreate(newProject);
    }
    this.setState({title: '', collapse: false})
  }

  render() {
    let projects = this.props.projects.map(project =>
      <Project key={project._links.self.href} project={project}
               currentUser={this.props.currentUser}
               isManager={this.props.isManager}/>
    );
    if (this.props.isManager === true) {
      return (
        <div>
          <h2>My projects</h2>
          <ButtonGroup block="true" vertical>
            <Table>
              <tbody>
              {projects}
              <Button color="primary" size="lg" block="true" onClick={this.toggle}>
                <h4 className="panel-title">+ New Project</h4>
              </Button>
              <Collapse isOpen={this.state.collapse}>
                <Card>
                  <CardHeader>
                    <form onSubmit={this.handleSubmit}>
                      <ButtonGroup>
                        <input className="form-control" type="text" value={this.state.title}
                               onChange={this.handleChange} placeholder="Better think twice."/>
                        <Button color="warning" type="submit"> Create New Project</Button>
                      </ButtonGroup>
                    </form>
                  </CardHeader>
                  <CardBody>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0031/3912/products/randy_rage_1024x1024.jpg?v=1289506282"/>
                  </CardBody>
                </Card>
              </Collapse>
              </tbody>
            </Table>
          </ButtonGroup>
        </div>
      )
    } else {
      return (
        <div>
          <h2>My projects</h2>
          <ButtonGroup block="true" vertical>
            <Table>
              <tbody>
              {projects}
              </tbody>
            </Table>
          </ButtonGroup>
        </div>
      )
    }
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
      <tr>
        <Button color="success" size="lg" block="true" onClick={this.toggle}>
          <h4 className="panel-title">{this.props.project.title}</h4>
        </Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <TaskList key={'key-' + this.props.project._links.self.href}
                        projectSelfLink={this.props.project._links.self.href}
                        project={this.props.project}
                        currentUser={this.props.currentUser}
                        isManager={this.props.isManager}/>
            </CardBody>
          </Card>
        </Collapse>
      </tr>
    )
  }
}

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleNotInProjectDeveloperClick = this.handleNotInProjectDeveloperClick.bind(this);
    this.state = {
      tasks: [],
      allDevelopers: [],
      developersInProject: [],
      checkboxChecked: false
    };
  }

  handleCheckboxClick() {
    this.setState({checkboxChecked: !this.state.checkboxChecked});
    this.loadTasksFromServer();
  }

  handleNotInProjectDeveloperClick(developer) {
    client({
      method: 'POST',
      path: developer._links.projects.href,
      entity: this.props.project,
      headers: {'Content-Type': 'text/uri-list'}
    });
    this.loadTasksFromServer();
  }

  loadDevelopersFromServer() {
    client({method: 'GET', path: root + "/developers"}).done(response => {
      this.setState({allDevelopers: response.entity._embedded.developers});
    });
    client({method: 'GET', path: this.props.project._links.self.href + "/developers"}).done(response => {
      this.setState({developersInProject: response.entity._embedded.developers});
    });
  }

  loadTasksFromServer() {
    follow(client, root, [
      {rel: 'tasks'}]
    ).then(() => {
      return client({
        method: 'GET',
        path: this.props.project._links.tasks.href,
        headers: {'Accept': 'application/json'}
      });
    }).then(tasksCollection => {
      return tasksCollection.entity._embedded.tasks.map(task =>
        client({
          method: 'GET',
          path: task._links.self.href
        })
      );
    }).then(taskPromises => {
      return when.all(taskPromises);
    }).done(tasks => {
      this.setState({
        tasks: tasks
      });
    });
    this.loadDevelopersFromServer();
  }

  componentDidMount() {
    this.loadTasksFromServer();
  }

  onCreate(newTask) {
    follow(client, root, ['tasks']
    ).then(tasksCollection => {
      return client({
        method: 'POST',
        path: tasksCollection.entity._links.self.href,
        entity: newTask,
        headers: {'Content-Type': 'application/json'}
      });
    }).done(task => {
      return client({
        method: 'PUT',
        path: task.entity._links.project.href,
        entity: this.props.project,
        headers: {'Content-Type': 'text/uri-list'}
      });
    });
    this.loadTasksFromServer();
  }

  onUpdate(task, updatedTask) {
    client({
      method: 'PATCH',
      path: task.entity._links.self.href,
      entity: {status: updatedTask.status},
      headers: {'Content-Type': 'application/json'}
    });
    client({
      method: 'PUT',
      path: task.entity._links.developer.href,
      entity: updatedTask.developer,
      headers: {'Content-Type': 'text/uri-list'}
    });
    this.loadTasksFromServer();
  }

  render() {
    let developersInProject = this.state.developersInProject;
    let tasks = this.state.tasks.map(task =>
      <Task key={task.entity._links.self.href}
            task={task}
            developers={developersInProject}
            checkboxState={this.state.checkboxChecked}
            onUpdate={this.onUpdate}
            currentUser={this.props.currentUser}
            isManager={this.props.isManager}/>
    );
    let emailsOfDevelopersInProject = developersInProject.map(developerInProject => developerInProject.email);
    let filteredAllDevelopers = this.state.allDevelopers.filter(developer => !emailsOfDevelopersInProject.includes(developer.email));
    let developersNotInProject = filteredAllDevelopers.map(developer =>
      <DeveloperFullNameInDropdown key={developer._links.self.href}
                                   developer={developer}
                                   handleNotInProjectDeveloperClick={this.handleNotInProjectDeveloperClick}
                                   currentUser={this.props.currentUser}/>
    );
    let addDeveloperToProject = this.props.isManager
      ? <AddDeveloperToProject developersNotInProject={developersNotInProject}/>
      : <strong><label className="pull-right"><input type="checkbox" onClick={this.handleCheckboxClick}/> only my tasks</label></strong>;
    return (
      <div>
        {addDeveloperToProject}

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
          <AddTaskToProject onCreate={this.onCreate}/>
          </tbody>
        </table>
      </div>
    )
  }
}

class AddDeveloperToProject extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {dropdownOpen: false}
  }

  toggle() {
    this.setState({dropdownOpen: !this.state.dropdownOpen});
  }

  render() {
    return (
      <ButtonDropdown color="info" size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="info" outline size="sm" caret>

          <h5>Add Developer to Project</h5>
        </DropdownToggle>
        <DropdownMenu>
          {this.props.developersNotInProject}
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

function AddTaskToProjectSwitcher(props) {
  if (props.addTaskButtonPushed === false) {
    return (
      <tr>
        <td colSpan="4">
          <ButtonGroup>
            <input className="form-control" type="text" placeholder="You can't touch my..." disabled/>
            <Button color="primary" onClick={props.handleButtonChange}><FaPlus/> Add Task</Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan="4">
        <form onSubmit={props.handleSubmit}>
          <ButtonGroup>
            <input className="form-control" type="text" onChange={props.handleInputChange}
                   placeholder="Stop! You can't do it!"/>
            <Button color="success" type="submit"> Save Task</Button>
          </ButtonGroup>
        </form>
      </td>
    </tr>
  );
}

class AddTaskToProject extends React.Component {

  constructor(props) {
    super(props);
    this.state = {addTaskButtonPushed: false, value: ''};
    this.handleButtonChange = this.handleButtonChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let newTask = {};
    let descriptionAttribute = 'description';
    let statusAttribute = 'status';
    newTask[descriptionAttribute] = this.state.value;
    newTask[statusAttribute] = "WAITING";
    this.props.onCreate(newTask);
    this.setState({value: ''});
    this.handleButtonChange();
  }

  handleButtonChange() {
    this.setState({addTaskButtonPushed: !this.state.addTaskButtonPushed});
  }

  handleInputChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <AddTaskToProjectSwitcher
        addTaskButtonPushed={this.state.addTaskButtonPushed}
        handleButtonChange={this.handleButtonChange}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}/>
    )
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {assignedDeveloper: {}, currentStatus: this.props.task.entity.status};
  }

  componentDidMount() {
    client({method: 'GET', path: this.props.task.entity._links.developer.href}).done(response => {
      this.setState({assignedDeveloper: response.entity});
    });
  }

  render() {
    let indexTask = this.props.task.entity._links.self.href.slice(32);
    let currentStatus = this.state.currentStatus;
    let developerFullName =
      this.state.assignedDeveloper.firstName === undefined || this.state.assignedDeveloper.lastName === undefined
        ? ''
        : this.state.assignedDeveloper.firstName + " " + this.state.assignedDeveloper.lastName;
    let currentUserFullName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    if (this.props.checkboxState === false || currentUserFullName === developerFullName) {
      return (
        <tr key={indexTask}>
          <td><Link to={`/tasks/${indexTask}`}>{this.props.task.entity.description}</Link></td>
          <td>{developerFullName}</td>
          <td>{currentStatus}</td>
          <td>
            <UpdateTask
              task={this.props.task}
              currentStatus={currentStatus}
              assignedDeveloper={this.state.assignedDeveloper}
              developers={this.props.developers}
              currentUser={this.props.currentUser}
              onUpdate={this.props.onUpdate}
              isManager={this.props.isManager}/>
          </td>
        </tr>
      )
    } else {
      return ('')
    }
  }
}

class UpdateTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedDeveloper: this.props.assignedDeveloper, selectedStatus: this.props.currentStatus};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStatusRadioBtnClick = this.handleStatusRadioBtnClick.bind(this);
    this.handleDeveloperRadioBtnClick = this.handleDeveloperRadioBtnClick.bind(this);
  }

  handleDeveloperRadioBtnClick(developer) {
    this.setState({selectedDeveloper: developer})
  }

  handleStatusRadioBtnClick(status) {
    this.setState({selectedStatus: status})
  }

  handleSubmit(e) {
    e.preventDefault();
    let updatedTask = {};
    let statusAttribute = 'status';
    let developerAttribute = 'developer';
    updatedTask[statusAttribute] = this.state.selectedStatus;
    updatedTask[developerAttribute] = this.state.selectedDeveloper;

    this.props.onUpdate(this.props.task, updatedTask);
    window.location = "#";
  }

  render() {
    let commentSelfLink = this.props.task.entity._links.self.href;
    let commentId = "updateTask-" + commentSelfLink;
    let developers = this.props.developers;
    let dropdownListOfDevelopers = this.props.isManager === true
      ? <DropdownOfListDevelopers developers={developers}
                                  chosenDeveloper={this.state.selectedDeveloper}
                                  handleDeveloperRadioBtnClick={this.handleDeveloperRadioBtnClick}/>
      : '';

    return (
      <div key={commentSelfLink}>
        <Button color="warning" outline href={"#" + commentId}><FaPencil/></Button>
        <div id={commentId} className="modalDialog">
          <div>
            <a href="#" role="button" title="Close" className="close">X</a>

            <h2>Update Task</h2>

            <form>
              <ButtonGroup>
                {dropdownListOfDevelopers}
                <DropdownOfListStatus handleStatusRadioBtnClick={this.handleStatusRadioBtnClick}
                                      chosenStatus={this.state.selectedStatus}/>
                <Button color="success" onClick={this.handleSubmit}>Update</Button>
              </ButtonGroup>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

class DropdownOfListDevelopers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownOpen: false};
    this.onDeveloperClick = this.onDeveloperClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({dropdownOpen: !this.state.dropdownOpen});
  }

  onDeveloperClick(developer) {
    this.props.handleDeveloperRadioBtnClick(developer);
  }

  render() {

    let developers = this.props.developers.map(developer =>
      <DropdownItem key={developer.firstName} color="info" onClick={() => this.onDeveloperClick(developer)}>
        {developer.firstName + ' ' + developer.lastName}
      </DropdownItem>
    );
    let chosenDeveloperFullName =
      this.props.chosenDeveloper.firstName === undefined || this.props.chosenDeveloper.lastName === undefined
        ? 'Developer'
        : this.props.chosenDeveloper.firstName + ' ' + this.props.chosenDeveloper.lastName;

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="primary" caret>
          {chosenDeveloperFullName}
        </DropdownToggle>
        <DropdownMenu>
          {developers}
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

class DropdownOfListStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownOpen: false};
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({dropdownOpen: !this.state.dropdownOpen});
  }

  onRadioBtnClick(status) {
    this.props.handleStatusRadioBtnClick(status);
  }

  render() {
    let arrayOfStatus = [
      'WAITING',
      'IMPLEMENTATION',
      'VERIFYING',
      'RELEASING'
    ].map(status => <DropdownItem key={status} color="info"
                                  onClick={() => this.onRadioBtnClick(status)}>{status}</DropdownItem>);
    let chosenStatus =
      this.props.chosenStatus === undefined || this.props.chosenStatus === ''
        ? 'Status'
        : this.props.chosenStatus;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="primary" caret>
          {chosenStatus}
        </DropdownToggle>
        <DropdownMenu>
          {arrayOfStatus}
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

class DeveloperFullNameInDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.onDeveloperClick = this.onDeveloperClick.bind(this);
  }

  onDeveloperClick(developer) {
    this.props.handleNotInProjectDeveloperClick(developer);
  }

  render() {
    let developerFullName = this.props.developer.firstName + " " + this.props.developer.lastName;
    return (
      <DropdownItem key={developerFullName} color="info" onClick={() => this.onDeveloperClick(this.props.developer)}>
        {developerFullName}
      </DropdownItem>
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

function UserGreeting(props) {
  return <h5>Welcome back!</h5>;
}

function GuestGreeting(props) {
  return <h5>Please sign up</h5>;
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
                <Greeting isLoggedIn={false}/>
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
    <Container>
      <Main/>
    </Container>
  </div>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Profile}/>
      {/*<Route path='/signup' component={Signup}/>*/}
      {/*<Route path='/logout' component={Logout}/>*/}
      <Route path='/tasks/:indexTask' component={TaskDetails}/>
    </Switch>
  </main>
);

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('react'));
