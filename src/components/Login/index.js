import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showLoginError: false,
    loginErrMsg: '',
    loginLoading: '',
  }

  onLoginSuccess = jwtToken => {
    this.setState({loginLoading: false})
    Cookies.set('jwt_token', jwtToken, {expires: 7})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errMsg => {
    this.setState({
      loginLoading: false,
      showLoginError: true,
      loginErrMsg: errMsg,
    })
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    this.setState({loginLoading: true})
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label className="label-text" htmlFor="usernameInput">
          USERNAME
        </label>
        <input
          type="text"
          className="input-element"
          id="usernameInput"
          value={username}
          onChange={this.onChangeUsername}
        />
      </div>
    )
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label className="label-text" htmlFor="passwordInput">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-element"
          id="passwordInput"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  render() {
    const {showLoginError, loginErrMsg, loginLoading} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-background">
        {loginLoading ? (
          <div className="loader-background">
            <Loader type="ThreeDots" height={80} width={80} color="#f7931e" />
          </div>
        ) : (
          <>
            <div className="mobile-login-view">
              <div className="mobile-login-image-background">
                <img
                  src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1707904986/mobile-login-image_atvt0n.png"
                  alt="website login"
                />
              </div>
              <h1 className="mobile-login-text">Login</h1>
            </div>

            <div className="tablet-login-view-outer-form-background">
              <div className="login-form-background">
                <div className="tablet-login-view-logo-and-title-background">
                  <img
                    src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1707927996/tablet-login-tasty-kitchens-image_vmylms.png"
                    alt="website logo"
                  />
                  <p className="tablet-login-view-title">Tasty Kitchens</p>
                  <h1 className="tablet-login-text">Login</h1>
                </div>
                <form onSubmit={this.onSubmitLoginForm}>
                  {this.renderUsernameField()}
                  {this.renderPasswordField()}
                  {showLoginError && (
                    <p className="login-err-msg">*{loginErrMsg}</p>
                  )}
                  <button type="submit" className="login-btn">
                    Login
                  </button>
                </form>
              </div>
            </div>

            <div className="tablet-login-view">
              <img
                src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1707928810/tablet-login-image_dzbbxx.png"
                alt="website login"
                className="tablet-login-image"
              />
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Login
