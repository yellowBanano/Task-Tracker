import React from "react";
import FaClock from 'react-icons/lib/fa/clock-o'
import FaTrash from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaPlus from 'react-icons/lib/fa/plus'

const client = require('../client');

export default class TaskDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {task: {}, projectTitle: '', comments: []};
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
  }

  render() {
    return (
      <div>
        <h1>{this.state.projectTitle}</h1>
        <h3>Task</h3>
        <i>{this.state.task.description}</i>
        <h3 className="pull-left">Comments</h3>

        <div className="message-wrap">
          <div className="msg-wrap">
            <div className="media msg ">
              <a className="pull-left" href="#">
                <img className="media-object" data-src="holder.js/64x64" alt="64x64" style={{width: 32, height: 32}}
                     src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"/>
              </a>
              <div className="media-body">
                <div className="pull-right lead">
                  <FaTrash/>
                  <FaPencil/>
                </div>
                <small className="pull-right time">
                  <FaClock/>
                  12:10am
                </small>
                <h5 className="media-heading">Naimish Sakhpara</h5>
                <small className="col-lg-10">
                  Location H-2, Ayojan Nagar, Near Gate-3, Near
                  Shreyas Crossing Dharnidhar Derasar,
                  Paldi, Ahmedabad 380007, Ahmedabad,
                  India
                  Phone 091 37 669307
                  Email aapamdavad.district@gmail.com
                </small>
              </div>
            </div>
            <div className="media msg">
              <a className="pull-left" href="#">
                <img className="media-object" data-src="holder.js/64x64" alt="64x64" style={{width: 32, height: 32}}
                     src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"/>
              </a>
              <div className="media-body">
                <div className="pull-right lead">
                  <FaTrash/>
                  <FaPencil/>
                </div>
                <small className="pull-right time">
                  <FaClock/>
                  12:10am
                </small>
                <h5 className="media-heading">Naimish Sakhpara</h5>
                <small className="col-lg-10">Arnab Goswami: "Some people close to Congress Party and close to the
                  government had a #secret #meeting in a farmhouse in Maharashtra in which Anna Hazare send some
                  representatives and they had a meeting in the discussed how to go about this all fast and how
                  eventually this will end."
                </small>
              </div>
            </div>
            <div className="media msg">
              <a className="pull-left" href="#">
                <img className="media-object" data-src="holder.js/64x64" alt="64x64" style={{width: 32, height: 32}}
                     src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"/>
              </a>
              <div className="media-body">
                <div className="pull-right lead">
                  <FaTrash/>
                  <FaPencil/>
                </div>
                <small className="pull-right time"><i className="fa fa-clock-o"/> 12:10am</small>
                <h5 className="media-heading">Naimish Sakhpara</h5>
                <small className="col-lg-10">Arnab Goswami: "Some people close to Congress Party and close to the
                  government had a #secret #meeting in a farmhouse in Maharashtra in which Anna Hazare send some
                  representatives and they had a meeting in the discussed how to go about this all fast and how
                  eventually this will end."
                </small>
              </div>
            </div>
          </div>
          <div className="send-wrap ">
            <textarea className="form-control send-message" rows={3} style={{resize: 'none'}}
                      placeholder="Write a reply..." defaultValue={""}/>
          </div>
          <div className="btn-panel">
            <a href className=" col-lg-4 text-right btn   send-message-btn pull-right" role="button">
              <FaPlus/> Send Message
            </a>
          </div>
        </div>
      </div>
    )
  }
}