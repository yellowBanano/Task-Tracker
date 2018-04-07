import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const when = require('when');

const root = '/api';

class Registration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      token: ''
    }
  }

  handleClick(event) {
    let token = randomToken;
    let expireDate = now.Date + '7 days';
    this.setState({token: token});
    saveUserToDB();
    saveTokenWithExpireDateToDB();
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <TextField
              hintText="Enter your Name"
              floatingLabelText="First Name"
              onChange={(event, newValue) => this.setState({firstName: newValue})}
            />
            <br/>
            <TextField
              hintText="Enter your Surname"
              floatingLabelText="Last Name"
              onChange={(event, newValue) => this.setState({lastName: newValue})}
            />
            <br/>
            <TextField
              hintText="Enter your E-mail"
              floatingLabelText="E-mail"
              onChange={(event, newValue) => this.setState({email: newValue})}
            />
            <br/>
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) => this.setState({password: newValue})}
            />
            <br/>

            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Registration;