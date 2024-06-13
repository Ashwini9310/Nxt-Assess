import './index.css'

const DefaultQuestion = props => {
  const {
    question,
    selectedOption,
    handleOptionSelect,
    moveToNextQuestion,
    questionNumber,
  } = props
  return (
    <div className="default-container">
      <h2 className="question-text">
        {questionNumber + 1}. {question.questionText}
      </h2>
      <hr className="horizontal-line" />
      <div className="option-container">
        {question.options.map(option => (
          <button
            type="button"
            key={option.optionId}
            className={
              selectedOption === option.optionId ? 'selected' : 'normal'
            }
            onClick={() => handleOptionSelect(option.optionId)}
          >
            {option.text}
          </button>
        ))}
      </div>
      <div className="btn-card">
        <button
          className="nxt-button"
          type="button"
          onClick={moveToNextQuestion}
        >
          Next Question
        </button>
      </div>
    </div>
  )
}

export default DefaultQuestion
