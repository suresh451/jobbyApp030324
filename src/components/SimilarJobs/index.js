import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    location,
    packagePerAnnum,
    employmentType,
    description,
    rating,
  } = jobDetails

  return (
    <li className="similar-list-item">
      <div className="profile-div">
        <img
          src={companyLogoUrl}
          className="similar-img"
          alt="similar job company logo"
        />
        <div>
          <h1 className="item-head">{title}</h1>
          <p className="rating">
            <FaStar size={20} className="icon-color" />
            {rating}
          </p>
        </div>
      </div>
      <hr />
      <h1>Description</h1>
      <p>{description}</p>
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
    </li>
  )
}

export default SimilarJobs
