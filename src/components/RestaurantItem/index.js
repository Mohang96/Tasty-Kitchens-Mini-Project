import {Link} from 'react-router-dom'

import './index.css'

const RestaurantItem = props => {
  const {restaurantDetails} = props
  const {id, imageUrl, name, menuType, userRating} = restaurantDetails
  const {rating, totalReviews} = userRating

  return (
    <Link to={`/restaurant/${id}`} className="link-item">
      <li className="restaurant-item">
        <img src={imageUrl} alt="restaurant" className="restaurant-image" />
        <div className="restaurant-item-details-background">
          <div>
            <h1 className="restaurant-name">{name}</h1>
            <p className="menu-type">{menuType}</p>
            <div className="rating-container">
              <img
                src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1708069308/star-filled-image_ywf1ba.png"
                alt="star"
                className="star-image"
              />
              <p className="rating">{rating}</p>
              <p className="rating ratings-count">{`(${totalReviews} ratings)`}</p>
            </div>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default RestaurantItem
