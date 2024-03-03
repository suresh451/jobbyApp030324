import {Link, withRouter} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

const Header = props => {
  const clickLogout = () => {
    Cookie.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-img"
        />
      </Link>

      <ul className="header-ul">
        <li>
          <Link to="/" className="link-item">
            Home
          </Link>
        </li>
        <li className="header-ul-li">
          <Link to="/jobs" className="link-item">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" onClick={clickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
