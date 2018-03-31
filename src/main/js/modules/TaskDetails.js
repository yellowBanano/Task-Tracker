import React from "react";
import FaClock from "react-icons/lib/fa/clock-o";
import FaTrash from "react-icons/lib/fa/trash";

const ReactDOM = require('react-dom');

const client = require('../client');
const follow = require('../follow');

const root = '/api';

export default class TaskDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {task: {}, currentUser: {}, comments: [], projectTitle: '', attributes: []};
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }


  loadFromServer() {
    follow(client, root, [
      {rel: 'comments'}]
    ).then(commentsCollection => {
      return client({
        method: 'GET',
        path: commentsCollection.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
      });
    }).done(schema => {
      this.schema = schema.entity;
      this.setState({
        attributes: Object.keys(this.schema.properties)
      })
    });
  }

  onCreate(newComment) {
    let currentUser = this.state.currentUser;
    follow(client, root, ['comments']).then(commentsCollection => {
      return client({
        method: 'POST',
        path: commentsCollection.entity._links.self.href,
        entity: newComment,
        headers: {'Content-Type': 'application/json'}
      })
    }).done(commentsCollection => {
      client({
        method: 'PUT',
        path: commentsCollection.entity._links.task.href,
        entity: this.state.task,
        headers: {'Content-Type': 'text/uri-list'}
      });
      client({
        method: 'PUT',
        path: commentsCollection.entity._links.user.href,
        entity: currentUser,
        headers: {'Content-Type': 'text/uri-list'}
      })
    });
    this.loadFromServer();
  }

  onDelete(comment) {
    client({method: 'DELETE', path: comment._links.self.href}).done(response => {
      this.loadFromServer();
    });
  }


  componentDidMount() {
    let indexTask = this.props.match.params.indexTask;
    const rootTask = '/api/tasks/';
    client({method: 'GET', path: rootTask + indexTask}).done(response => {
      this.setState({task: response.entity});
    });
    client({method: 'GET', path: rootTask + indexTask + "/project"}).done(response => {
      this.setState({projectTitle: response.entity.title});
    });
    client({method: 'GET', path: rootTask + indexTask + "/comments"}).done(response => {
      this.setState({comments: response.entity._embedded.comments});
    });

    // --------------------- TEST USER ------------------------------
    client({method: 'GET', path: root + "/users/1"}).done(response => {
      this.setState({currentUser: response.entity});
    });
    // --------------------------------------------------------------

    this.loadFromServer();
  }

  render() {
    let task = this.state.taskSelfLink;
    let currentUser = this.state.currentUser;
    return (
      <div>
        <h1>{this.state.projectTitle}</h1>
        <h3>Task</h3>
        <i>{this.state.task.description}</i>
        <h3 className="pull-left">Comments</h3>

        <div className="message-wrap">
          <CommentList comments={this.state.comments}/>
          <CreateComment attributes={this.state.attributes}
                         task={task}
                         currentUser={currentUser}
                         onCreate={this.onCreate}
                         onDelete={this.onDelete}/>
        </div>
      </div>
    )
  }
}

class CreateComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let newComment = {};
    let textAttribute = this.props.attributes[2];
    newComment[textAttribute] = this.state.value;
    this.setState({value: ''});

    this.props.onCreate(newComment);
  }

  render() {
    let textAttribute = this.props.attributes[2]; // 0 - postTime, 1 - task, 2 - text, 3 - user
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <textarea value={this.state.value} onChange={this.handleChange} className="field"/>
          <button type="submit">Save</button>
        </form>
      </div>
    )
  }

}

class CommentList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let comments = this.props.comments.map(comment =>
      <Comment key={comment._links.self.href}
               attributes={this.props.attributes}
               comment={comment}
               onDelete={this.props.onDelete}
      />
    );
    return (
      <div className="msg-wrap">
        {comments}
      </div>
    )
  }
}

class Comment extends React.Component {
  constructor(props) {
    super(props);
    // this.handleDelete = this.handleDelete.bind(this);
    this.state = {text: '', authorFullName: ''};
  }

  componentDidMount() {
    this.setState({text: this.props.comment.text})
    client({method: 'GET', path: this.props.comment._links.self.href + '/user'}).done(response => {
      this.setState({authorFullName: response.entity.firstName + " " + response.entity.lastName});
    });
  }

  handleDelete() {
    this.props.onDelete(this.props.comment);
  }

  render() {
    return (
      <div className="media msg ">
        <a className="pull-left" href="#">
          <img className="media-object" data-src="holder.js/64x64" alt="64x64" style={{width: 32, height: 32}}
               src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"/>
        </a>
        <div className="media-body">
          <button onClick={this.handleDelete}><span><FaTrash/></span></button>
          {/*<UpdateDialog comment={this.props.comment}*/}
          {/*attributes={this.props.attributes}*/}
          {/*onUpdate={this.props.onUpdate}/>*/}
          <FaClock/>
          {this.props.comment.postTime}
          <h5 className="media-heading">{this.state.authorFullName}</h5>
          <small className="col-lg-10">
            {this.state.text}
          </small>
        </div>
      </div>
    )
  }
}