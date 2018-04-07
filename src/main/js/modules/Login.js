import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const when = require('when');

const root = '/api';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }
  }

  // handleClick(event) {
  //   findUserByEmail(this.state.email);
  //   if (response === undefined) {
  //     this.setState({errorMessage: 'There is no such user!'})
  //   } else {
  //     if (response.enabled === false) {
  //       if (response.expireDate < now.Date) {
  //         this.setState({errorMessage: 'Your activation link is expired'});
  //         delete user;
  //       } else {
  //         this.setState({errorMessage: 'Please activate your account'})
  //       }
  //     }
  //
  //     Link to home page to = '/:userId'
  //   }
  // }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
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
export default Login;