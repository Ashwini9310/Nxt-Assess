import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Result = props => {
  const {location} = props
  const {state} = location
  const {score, formattedTimer, timeUp} = state

  return (
    <>
      <Header />

      <div className="bt-container">
        <div className="result-container">
          {timeUp ? (
            <>
              <img
                src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1705260308/calender_1_1_fttxjx.jpg"
                alt="time up"
                className="result-image"
              />
              <h1 className="congrats-head">Time is up</h1>
              <p className="about-time">
                You did not complete the assessment within the time
              </p>
            </>
          ) : (
            <>
              <img
                src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704821915/Layer_2_prwvp6.jpg"
                alt="submit"
                className="result-image"
              />
              <h1 className="congrats-head">
                Congrats! You completed the assessment.
              </h1>
              <p className="about-time">Time Taken: {formattedTimer}</p>
              <p className="about-score">Your Score: {score}</p>
            </>
          )}

          <Link to="/assessment">
            <button type="button" className="re-btn">
              Reattempt
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Result
