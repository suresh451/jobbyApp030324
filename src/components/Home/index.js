import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
      <>
    <Header />
    <div className="home-bg-img">
      <h1>
        Find the Job That <br /> Fits You Life
      </h1>
      <p>
        Millions of people are searching for jobs, salary <br />
        informations, company reviews.Find the job that fits your
        <br /> abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  </>
  )
}


export default Home
