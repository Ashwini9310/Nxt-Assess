import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import DefaultQuestion from '../DefaultQuestion'
import ImageQuestion from '../ImageQuestion'
import SingleSelectQuestion from '../SingleSelectQuestion'
import AssessmentSummary from '../AssessmentSummary'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Assessment extends Component {
  state = {
    assQuestions: [],
    currentQuestionIndex: 0,
    answeredQuestions: 0,
    unansweredQuestions: 0,
    timer: 600,
    selectedOptions: {},
    score: 0,
    isSelected: false,
    selectedQuestionIndex: null,
    apiStatus: apiStatusConstants.initial,
    timeUp: true,
    anyOptionSelected: false,
  }

  componentDidMount() {
    this.getData()
    this.startTimer()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/assess/questions')
    const data = await response.json()
    // console.log(data)
    if (response.ok === true) {
      const updatedData = data.questions.map(eachQuestion => ({
        id: eachQuestion.id,
        optionsType: eachQuestion.options_type,
        questionText: eachQuestion.question_text,
        options: eachQuestion.options.map(eachOption => ({
          optionId: eachOption.id,
          text: eachOption.text,
          isCorrect: eachOption.is_correct,
          imageUrl: eachOption.image_url,
        })),
      }))
      console.log(updatedData)
      this.setState({
        assQuestions: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  startTimer = () => {
    this.timerFunction = setInterval(() => {
      const {timer} = this.state
      if (timer > 0) {
        this.setState(prevState => ({timer: prevState.timer - 1}))
      } else {
        clearInterval(this.timerFunction)
        this.endAssessment()
        this.setState({timeUp: false})
      }
    }, 1000)
  }

  onClickRetryButton = () => {
    this.getData()
  }

  endAssessment = () => {
    const {history} = this.props
    const {timeUp} = this.state

    history.replace('/result', {timeUp})
    clearInterval(this.timerFunction)

    this.setState({
      timeUp: true,
    })
  }

  onSubmit = () => {
    const {history} = this.props
    const {score, timer} = this.state

    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60
    const formattedTimer = `${minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`

    history.replace('/result', {score, formattedTimer})
    clearInterval(this.timer)
  }

  renderAssessmentSuccess = () => {
    const {
      assQuestions,
      currentQuestionIndex,
      selectedOptions,
      timer,
      answeredQuestions,
      unansweredQuestions,
      score,
      isSelected,
      selectedQuestionIndex,
    } = this.state
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60
    const formattedTimer = `${minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`
    console.log(formattedTimer)
    const currentQuestion =
      assQuestions[
        selectedQuestionIndex !== null
          ? selectedQuestionIndex
          : currentQuestionIndex
      ]

    return (
      <>
        <div className="assessment-container">
          <div className="question-container">
            {currentQuestion && (
              <div>
                {currentQuestion.optionsType === 'DEFAULT' && (
                  <DefaultQuestion
                    question={currentQuestion}
                    selectedOption={selectedOptions}
                    handleOptionSelect={this.handleOptionSelect}
                    moveToNextQuestion={this.moveToNextQuestion}
                    questionNumber={
                      selectedQuestionIndex !== null
                        ? selectedQuestionIndex
                        : currentQuestionIndex
                    }
                  />
                )}
                {currentQuestion.optionsType === 'IMAGE' && (
                  <ImageQuestion
                    question={currentQuestion}
                    selectedOption={selectedOptions}
                    handleOptionSelect={this.handleOptionSelect}
                    moveToNextQuestion={this.moveToNextQuestion}
                    questionNumber={
                      selectedQuestionIndex !== null
                        ? selectedQuestionIndex
                        : currentQuestionIndex
                    }
                  />
                )}
                {currentQuestion.optionsType === 'SINGLE_SELECT' && (
                  <SingleSelectQuestion
                    question={currentQuestion}
                    selectedOption={selectedOptions}
                    handleOptionSelect={this.handleOptionSelect}
                    moveToNextQuestion={this.moveToNextQuestion}
                  />
                )}
              </div>
            )}
          </div>
          <div className="summary-timer-container">
            <div className="timer-container">
              <p className="time-heading">Time Left</p>
              <p className="timer">{formattedTimer}</p>
            </div>
            <div className="summary-card">
              <AssessmentSummary
                totalQuestions={assQuestions.length}
                answeredQuestions={answeredQuestions}
                unansweredQuestions={unansweredQuestions}
                currentQuestionNo={currentQuestionIndex}
                questions={assQuestions}
                isSelected={isSelected}
                onSubmit={this.onSubmit}
                onQuestionClick={this.handleQuestionClick}
                selectedQuestionIndex={selectedQuestionIndex}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  renderAssessmentFailure = () => (
    <div className="failure-container">
      <div className="failure-content-card">
        <img
          src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704822095/Group_7519_ed27tg.jpg"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="something-went-wrong">Oops! Something went wrong</h1>
        <p className="some-trouble">We are having some trouble</p>
        <button
          onClick={this.onClickRetryButton}
          className="retry-btn"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  renderAssessmentDetails = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAssessmentSuccess()
      case apiStatusConstants.failure:
        return this.renderAssessmentFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  handleOptionSelect = optionId => {
    const {assQuestions, currentQuestionIndex, selectedOptions} = this.state
    const currentQuestion = assQuestions[currentQuestionIndex]
    const selectedOptionData = currentQuestion.options.find(
      option => option.optionId === optionId,
    )

    if (selectedOptionData.isCorrect === 'true') {
      this.setState(prevState => ({
        score: prevState.score + 1,
        isSelected: true,
      }))
    } else if (selectedOptions) {
      this.setState(prevState => ({
        answeredQuestions: prevState.answeredQuestion + 1,
        anyOptionSelected: true,
      }))
    }
    this.setState({
      selectedOptions: optionId,
      isSelected: true,
      anyOptionSelected: true,
    })
  }

  moveToNextQuestion = () => {
    const {isSelected, anyOptionSelected} = this.state

    if (isSelected || anyOptionSelected) {
      this.setState(prevState => ({
        answeredQuestions: prevState.answeredQuestions + 1,
        isSelected: false,
        anyOptionSelected: false,
      }))
    }
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      selectedOptions: null,
    }))
  }

  handleQuestionClick = id => {
    const {assQuestions} = this.state
    const selectedQuestionData = assQuestions.findIndex(
      question => question.id === id,
    )

    console.log(selectedQuestionData)
    this.setState({
      selectedQuestionIndex: selectedQuestionData,
    })
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAssessmentDetails()}
      </>
    )
  }
}

export default Assessment
