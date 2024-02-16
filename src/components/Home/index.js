import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {MdSort} from 'react-icons/md'
import {CiSquareChevLeft, CiSquareChevRight} from 'react-icons/ci'
import {FaSortDown} from 'react-icons/fa'
import {BsCheck2} from 'react-icons/bs'

import Header from '../Header'
import RestaurantItem from '../RestaurantItem'

import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Lowest',
    value: 'Lowest',
  },
  {
    id: 1,
    displayText: 'Highest',
    value: 'Highest',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

const limit = 9

class Home extends Component {
  state = {
    carouselImagesList: '',
    activeSortOptionValue: sortByOptions[0].value,
    carouselApiStatus: apiStatusConstants.initial,
    restaurantApiStatus: apiStatusConstants.initial,
    restaurantDetailsList: '',
    activePageNo: 1,
  }

  componentDidMount() {
    this.getCarouselAndRestaurantDetails()
  }

  getCarouselAndRestaurantDetails = () => {
    this.getCarouselDetails()
    this.getRestaurantDetails()
  }

  getCarouselDetails = async () => {
    this.setState({carouselApiStatus: apiStatusConstants.inProgress})

    const carouselApiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(carouselApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.setState({
        carouselImagesList: data.offers.map(eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
        })),
        carouselApiStatus: apiStatusConstants.success,
      })
    }
  }

  getFormattedData = restaurantDetails => ({
    costForTwo: restaurantDetails.cost_for_two,
    cuisine: restaurantDetails.cuisine,
    groupByTime: restaurantDetails.group_by_time,
    hasOnlineDelivery: restaurantDetails.has_online_delivery,
    hasTableBooking: restaurantDetails.has_table_booking,
    id: restaurantDetails.id,
    imageUrl: restaurantDetails.image_url,
    isDeliveringNow: restaurantDetails.is_delivering_now,
    location: restaurantDetails.location,
    menuType: restaurantDetails.menu_type,
    name: restaurantDetails.name,
    opensAt: restaurantDetails.opens_at,
    userRating: {
      rating: restaurantDetails.user_rating.rating,
      ratingColor: restaurantDetails.user_rating.rating_color,
      ratingText: restaurantDetails.user_rating.rating_text,
      totalReviews: restaurantDetails.user_rating.total_reviews,
    },
  })

  getRestaurantDetails = async () => {
    this.setState({restaurantApiStatus: apiStatusConstants.inProgress})

    const {activeSortOptionValue, activePageNo} = this.state
    const offset = (activePageNo - 1) * limit
    const restaurantsApiUrl = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}?sort_by_rating=${activeSortOptionValue}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(restaurantsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.setState({
        restaurantApiStatus: apiStatusConstants.success,
        restaurantDetailsList: data.restaurants.map(eachRestaurant =>
          this.getFormattedData(eachRestaurant),
        ),
      })
    }
  }

  renderRestaurantsSuccessView = () => {
    const {restaurantDetailsList} = this.state

    return (
      <div>
        <ul className="restaurant-details-list">
          {restaurantDetailsList.map(eachRestaurant => (
            <RestaurantItem
              key={eachRestaurant.id}
              restaurantDetails={eachRestaurant}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderRestaurants = () => {
    const {restaurantApiStatus} = this.state

    switch (restaurantApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderRestaurantsSuccessView()
      default:
        return null
    }
  }

  onChangeSortOption = event => {
    this.setState(
      {activeSortOptionValue: event.target.value},
      this.getRestaurantDetails,
    )
  }

  renderSortByFeature = () => {
    const {activeSortOptionValue} = this.state

    return (
      <div className="sort-by-feature-container">
        <div className="sort-by-icon-box">
          <MdSort className="sort-by-icon" />
        </div>
        <div>
          <span className="sort-by-text">Sort by</span>
          <select
            value={activeSortOptionValue}
            onChange={this.onChangeSortOption}
            id="selectElement"
          >
            {sortByOptions.map(eachOption => (
              <option
                key={eachOption.id}
                value={eachOption.value}
                className="sort-option"
              >
                {eachOption.displayText}
              </option>
            ))}
          </select>
          <FaSortDown />
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <>
      <Loader type="ThreeDots" color="#F7931E" height={50} width={50} />
    </>
  )

  renderCarouselImagesSuccessView = () => {
    const {carouselImagesList} = this.state
    const dotsClassName = 'dots-container'
    const settings = {
      dots: true,
      infinite: true,
      fade: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      appendDots: dots => (
        <div>
          <ul className={dotsClassName}>{dots}</ul>
        </div>
      ),
    }

    return (
      <div className="carousel-image-background">
        <Slider {...settings}>
          {carouselImagesList.map(eachCarousel => (
            <img
              src={eachCarousel.imageUrl}
              key={eachCarousel.id}
              alt="offer"
              className="carousel"
            />
          ))}
        </Slider>
      </div>
    )
  }

  renderCarouselImages = () => {
    const {carouselApiStatus} = this.state

    switch (carouselApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderCarouselImagesSuccessView()
      default:
        return null
    }
  }

  renderPagination = () => {
    const {activePageNo} = this.state
    return (
      <div className="pagination-background-container">
        <div className="pagination-container">
          <CiSquareChevLeft />
          <p>{`${activePageNo} of 20`}</p>
          <CiSquareChevRight />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="home-background">
        <Header />
        <div className="home-responsive-background">
          <div className="carousel-images-background">
            {this.renderCarouselImages()}
          </div>
          <h1 className="popular-restaurants-text">Popular Restaurants</h1>
          <p className="popular-restaurants-description">
            Select Your favorite restaurant special dish and make your day
            happy...
          </p>
          {this.renderSortByFeature()}
          <hr className="separator" />
          {this.renderRestaurants()}
          {this.renderPagination()}
        </div>
      </div>
    )
  }
}

export default Home
