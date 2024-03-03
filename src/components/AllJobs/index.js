import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    apiStatus: apiStatusConstants.initial,
    checkboxInput: [],
    radioInput: '',
    apiJobStatus: apiJobStatusConstants,
    jobsList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseProfile = await fetch(apiUrl, options)
    if (responseProfile.ok) {
      const fetchedData = [await responseProfile.json()]
      console.log(fetchedData)
      const updatedData = fetchedData.map(profile => ({
        name: profile.profile_details.name,
        profileImage: profile.profile_details.profile_image_url,
        shortBio: profile.profile_details.short_bio,
      }))

      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
        responseSuccess: true,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsData = async () => {
    this.setState({
      apiJobStatus: apiJobStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInput, searchInput, radioInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsResponse = await fetch(apiUrl, options)

    if (jobsResponse.ok) {
      const fetchedData = await jobsResponse.json()
      console.log(fetchedData)
      const updatedData = fetchedData.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        location: eachJob.location,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
      }))

      this.setState({
        jobsList: updatedData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiJobStatusConstants.failure,
      })
    }
  }

  onChangeRadioInput = event => {
    this.setState(
      {
        radioInput: event.target.id,
      },
      this.getJobsData,
    )
  }

  renderRadioInputView = () => (
    <ul className="ul-side">
      {salaryRangesList.map(eachRadio => (
        <li key={eachRadio.salaryRangeId}>
          <input
            type="radio"
            id={eachRadio.salaryRangeId}
            onChange={this.onChangeRadioInput}
          />
          <label htmlFor={eachRadio.salaryRangeId}>{eachRadio.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetCheckboxOption = event => {
    const {checkboxInput} = this.state

    const inputNotInList = checkboxInput.filter(
      eachInput => eachInput === event.target.id,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filteredData = checkboxInput.filter(
        eachInput => eachInput !== event.target.id,
      )
      this.setState({checkboxInput: filteredData}, this.getJobsData)
    }
  }

  renderCheckboxView = () => (
    <ul className="ul-side">
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            onChange={this.onGetCheckboxOption}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  renderProfileSuccessData = () => {
    const {profileData, responseSuccess} = this.state

    if (responseSuccess) {
      const {profileImage, shortBio, name} = profileData[0]
      return (
        <div className="profile-bg">
          <img src={profileImage} alt="profile" className="profile-img" />
          <h1 className="profile-head">{name}</h1>
          <p className="profile-para">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  clickRetry = () => {
    this.getProfileData()
  }

  renderFailureView = () => {
    <div>
      <button type="button" onClick={this.clickRetry}>
        Retry
      </button>
    </div>
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  renderProfileData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  enterKey = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSubmitInput = () => {
    this.getJobsData()
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    const emptyJobsList = jobsList.length === 0

    return emptyJobsList ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className=""
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. try other filters</p>
      </div>
    ) : (
      <>
        <ul className="products-list">
          {jobsList.map(job => (
            <JobItem jobDetails={job} key={job.id} />
          ))}
        </ul>
      </>
    )
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  renderJobsFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops something went wrong</h1>

      <button type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsData = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiJobStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-main-div">
        <div>
          <div>{this.renderProfileData()}</div>
          <hr />
          <h1 className="emp-sal-head">Type of Employement</h1>
          {this.renderCheckboxView()}
          <hr />
          <h1 className="emp-sal-head">Salary Ranges</h1>
          {this.renderRadioInputView()}
        </div>
        <div className="jobitem-div">
          <div className="search-div">
            <input
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              onKeyDown={this.enterKey}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onSubmitInput}
              aria-label="Mute volume"
            >
              <AiOutlineSearch />
            </button>
          </div>
          {this.renderJobsData()}
        </div>
      </div>
    )
  }
}

export default AllJobs
