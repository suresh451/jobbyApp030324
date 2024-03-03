import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
// import {BsBagDash} from 'react-icons/bs'
// import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemList: [],
    similarJobList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(eachJob => ({
        description: eachJob.job_description,
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        title: eachJob.title,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        location: eachJob.location,
        lifeAtCompany: {
          imageUrl: eachJob.life_at_company.image_url,
          description: eachJob.life_at_company.description,
        },
        skills: eachJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }))
      const updatedSimilarJobData = fetchedData.similar_jobs.map(
        eachSimilarData => ({
          title: eachSimilarData.title,
          packagePerAnnum: eachSimilarData.package_per_annum,
          description: eachSimilarData.job_description,
          id: eachSimilarData.id,
          companyLogoUrl: eachSimilarData.company_logo_url,
          rating: eachSimilarData.rating,
          location: eachSimilarData.location,
          employmentType: eachSimilarData.employment_type,
        }),
      )

      this.setState({
        jobItemList: updatedData,
        similarJobList: updatedSimilarJobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  retryBtn = () => {
    this.getJobData()
  }

  renderJobItemFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryBtn}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobItemSuccessView = () => {
    const {jobItemList, similarJobList} = this.state

    if (jobItemList.length >= 1) {
      const {
        rating,
        location,
        description,
        packagePerAnnum,
        companyWebsiteUrl,
        title,
        companyLogoUrl,
        skills,
        lifeAtCompany,
        employmentType,
      } = jobItemList[0]

      return (
        <div>
          <div className="main-div1 detailed-main-div">
            <div className="detailed-img-title">
              <img
                src={companyLogoUrl}
                className="detailed-img"
                alt="job details company logo"
              />
              <div>
                <h1>{title}</h1>
                <p className="rating">
                  <FaStar size={20} color="yellow" />
                  {rating}
                </p>
              </div>
            </div>

            <div className="detailed-location-div">
              <div className="detailed-location">
                <p>
                  <MdLocationOn /> {location}
                </p>
                <p className="emp-type">{employmentType} </p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="detailed-visit-div">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} className="detailed-visit">
                Visit
              </a>
            </div>

            <p>{description}</p>
            <h1>Skills</h1>
            <ul className="detailed-ul">
              {skills.map(eachSkill => (
                <li key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    className=""
                    alt={eachSkill.name}
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <h1>Life at Company</h1>

              <div className="detailed-lifeatCom">
                <p>{lifeAtCompany.description}</p>
                <img
                  src={lifeAtCompany.imageUrl}
                  className=""
                  alt="life at company"
                />
              </div>
            </div>
            <h1>Similar Jobs</h1>
            <ul className="detailed-ul">
              {similarJobList.map(eachProduct => (
                <SimilarJobs jobDetails={eachProduct} key={eachProduct.id} />
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return null
  }

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="">{this.renderJobItemDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
