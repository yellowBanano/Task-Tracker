import React from "react";

const ReactDOM = require('react-dom');

import FaClock from "react-icons/lib/fa/clock-o";
import FaPencil from "react-icons/lib/fa/pencil";
import FaTrash from "react-icons/lib/fa/trash";
import FaPlus from 'react-icons/lib/fa/plus';
import FaUpdate from 'react-icons/lib/fa/pencil-square';
import moment from "moment";

const client = require('../client');
const follow = require('../follow');
const when = require('when');

const root = '/api';

export default class TaskDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {task: {}, user: {}, comments: [], projectTitle: ''};
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }


    loadFromServer() {
        let indexTask = this.props.match.params.indexTask;
        follow(client, root, [
            {rel: 'tasks'}]
        ).then(tasksCollection => {
            return client({
                method: 'GET',
                path: tasksCollection.entity._links.self.href + '/' + indexTask + '/comments',
                headers: {'Accept': 'application/json'}
            });
        }).then(commentsCollection => {
            return commentsCollection.entity._embedded.comments.map(comment =>
                client({
                    method: 'GET',
                    path: comment._links.self.href
                })
            );
        }).then(commentPromises => {
            return when.all(commentPromises);
        }).done(comments => {
            this.setState({
                comments: comments
            });
        });
    }

    onCreate(newComment) {
        let secondChanceForComment = {};
        follow(client, root, ['comments']
        ).then(commentsCollection => {
            return client({
                method: 'POST',
                path: commentsCollection.entity._links.self.href,
                entity: newComment,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(comment => {
            secondChanceForComment = comment;
            return client({
                method: 'PUT',
                path: comment.entity._links.task.href,
                entity: this.state.task,
                headers: {'Content-Type': 'text/uri-list'}
            });
        }).then(() => {
            client({
                method: 'PUT',
                path: secondChanceForComment.entity._links.user.href,
                entity: this.state.user,
                headers: {'Content-Type': 'text/uri-list'}
            });
        }).done(response => {
            this.loadFromServer();
        });
    }

    onUpdate(comment, updatedComment) {
        client({
            method: 'PUT',
            path: comment.entity._links.self.href,
            entity: updatedComment,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': comment.headers.Etag
            }
        }).done(response => {
            this.loadFromServer();
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    comment.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }

    onDelete(comment) {
        client({method: 'DELETE', path: comment.entity._links.self.href}).done(response => {
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

        // --------------------- TEST USER ------------------------------
        client({method: 'GET', path: root + "/users/1"}).done(response => {
            this.setState({user: response.entity});
        });
        // --------------------------------------------------------------

        this.loadFromServer();
    }

    render() {
        return (
            <div>
                <h1>{this.state.projectTitle}</h1>
                <h3>Task</h3>
                <i>{this.state.task.description}</i>
                <div className="message-wrap col-lg-8">
                    <div className="alert alert-info msg-date">
                        <strong>Comments</strong>
                    </div>

                    <CommentList comments={this.state.comments}
                                 onDelete={this.onDelete}
                                 onUpdate={this.onUpdate}/>
                    <CreateComment onCreate={this.onCreate}/>
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
        let textAttribute = 'text';
        newComment[textAttribute] = this.state.value;
        this.setState({value: ''});

        this.props.onCreate(newComment);
    }

    render() {
        return (
            <div className="send-wrap ">
                <form>
        <textarea className="form-control send-message" rows="3" placeholder="Write a reply..."
                  value={this.state.value} onChange={this.handleChange}/>
                    <div className="btn-panel">
                        <a className=" col-lg-4 text-right btn send-message-btn pull-right" onClick={this.handleSubmit} role="button">
                            <FaPlus/> Send Comment</a>
                    </div>
                </form>
            </div>
        )
    }
}

class UpdateComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: this.props.comment.entity.text};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let updatedComment = {};
        let textAttribute = 'text';
        let postTimeAttribute = 'postTime';
        updatedComment[textAttribute] = this.state.value;
        updatedComment[postTimeAttribute] = this.props.comment.entity.postTime;

        this.props.onUpdate(this.props.comment, updatedComment);
        window.location = "#";
    }

    render() {
        let commentSelfLink = this.props.comment.entity._links.self.href;
        var commentId = "updateEmployee-" + commentSelfLink;

        return (
            <div key={commentSelfLink}>

                <a href={"#" + commentId}><FaPencil/></a>
                <div id={commentId} className="modalDialog">
                    <div>
                        <a href="#" role="button" title="Close" className="close">X</a>

                        <h2>Update a Comment</h2>

                        <form>
                            <textarea className="form-control vresize" value={this.state.value}
                                      onChange={this.handleChange}/>
                            <button className="pull-right" onClick={this.handleSubmit}><FaUpdate /> Update</button>
                        </form>
                    </div>
                </div>
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
            <Comment key={comment.entity._links.self.href}
                     attributes={this.props.attributes}
                     comment={comment}
                     onDelete={this.props.onDelete}
                     onUpdate={this.props.onUpdate}/>
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
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {authorFullName: ''};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.comment.entity._links.self.href + '/user'}).done(response => {
            this.setState({authorFullName: response.entity.firstName + " " + response.entity.lastName});
        });
    }

    handleDelete() {
        if (confirm("Are you sure about deleting?")) {
            this.props.onDelete(this.props.comment);
        }
    }

    render() {
        let datetime = moment(this.props.comment.entity.postTime).format("DD MMMM YYYY, kk:mm");
        return (
            <div className="media msg ">
                <a className="pull-left" href="#">
                    <img className="media-object" data-src="holder.js/64x64" alt="64x64"
                         style={{width: 32, height: 32}}
                         src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"/>
                </a>
                <div className="media-body">
                    <UpdateComment comment={this.props.comment} onUpdate={this.props.onUpdate}/>
                    <a onClick={this.handleDelete}><span><FaTrash/></span></a>
                    <small className="pull-right time"><FaClock/> {datetime}</small>
                    <h5 className="media-heading">{this.state.authorFullName}</h5>
                    <small className="col-lg-10">
                        {this.props.comment.entity.text}
                    </small>
                </div>
            </div>
        )
    }
}