import './index.css'

const SingleSelectQuestion = props => {
  const {question, selectedOption, handleOptionSelect, moveToNextQuestion} =
    props
  return (
    <div className="bg-card">
      <div className="center-card">
        <h2>{question.questionText}</h2>
        <select
          value={selectedOption}
          onChange={e => handleOptionSelect(e.target.value)}
        >
          <option value="">Select an option</option>
          {question.options.map(option => (
            <option key={option.optionId} value={option.optionId}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <button className="nxt-button" type="button" onClick={moveToNextQuestion}>
        Next Question
      </button>
    </div>
  )
}

export default SingleSelectQuestion
