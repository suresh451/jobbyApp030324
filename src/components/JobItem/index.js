import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    location,
    packagePerAnnum,
    employmentType,
    jobDescription,
    rating,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="list-item">
        <div className="profile-div">
          <img src={companyLogoUrl} className="item-img" alt="company logo" />
          <div>
            <h1 className="item-head">{title}</h1>
            <p className="rating">
              <FaStar size={20} className="icon-color" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-div">
          <div className="profile-div">
            <p className="location">
              <MdLocationOn />
              {location}
            </p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="item-hr" />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
