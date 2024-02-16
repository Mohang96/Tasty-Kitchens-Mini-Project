import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoIosCloseCircle} from 'react-icons/io'

import './index.css'

const tabItemsList = [
  {
    tabId: 1,
    displayText: 'Home',
  },
  {
    tabId: 2,
    displayText: 'Cart',
  },
]

class Header extends Component {
  state = {showNavItems: false}

  onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onClickMenuIcon = () => {
    this.setState(prevState => ({
      showNavItems: !prevState.showNavItems,
    }))
  }

  render() {
    const {showNavItems} = this.state

    return (
      <div className="header-background">
        <div className="header-responsive-background">
          <div className="header-logo-and-title-background">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1707927996/tablet-login-tasty-kitchens-image_vmylms.png"
                alt="website logo"
                className="header-logo"
              />
            </Link>
            <p className="header-title-text">Tasty Kitchens</p>
          </div>

          <ul className="tablet-view-nav-items-list">
            <li className="tablet-view-nav-item">
              <Link to="/" className="link-item">
                Home
              </Link>
            </li>
            <li className="tablet-view-nav-item">
              <Link to="/cart" className="link-item">
                Cart
              </Link>
            </li>
            <li className="tablet-view-nav-item">
              <button
                type="button"
                onClick={this.onClickLogoutBtn}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </ul>

          <div className="menu-icon-background">
            <GiHamburgerMenu
              onClick={this.onClickMenuIcon}
              className="menu-icon"
            />
          </div>
        </div>

        {showNavItems && (
          <div className="mobile-nav-items-view">
            <ul className="mobile-view-nav-items-list">
              <li className="mobile-view-nav-item">
                <Link to="/" className="link-item">
                  Home
                </Link>
              </li>
              <li className="mobile-view-nav-item">
                <Link to="/" className="link-item">
                  Cart
                </Link>
              </li>
              <li className="mobile-view-nav-item">
                <button
                  type="button"
                  onClick={this.onClickLogoutBtn}
                  className="logout-btn"
                >
                  Logout
                </button>
              </li>
            </ul>

            <div className="menu-icon-background">
              <IoIosCloseCircle
                onClick={this.onClickMenuIcon}
                className="menu-icon"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
