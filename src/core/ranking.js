export function getRankingWithChangedPositions(pontuations) {
  const prevPontuations = [...pontuations].sort((a, b) => b.prevPontuation - a.prevPontuation)
  const currentPontuations = [...pontuations].sort((a, b) => b.pontuation - a.pontuation)

  return currentPontuations.map((user, index) => {
    const prevUserIndex = prevPontuations.findIndex((prevUser) => prevUser.user === user.user)

    if (prevUserIndex === -1) return user

    return {
         ...user,
        hasBeenGoneUp: prevUserIndex > index,
        hasBeenGoneDown: index > prevUserIndex,
    }
  })
}

export function getWinners(users) {
  const firstPosition = users[0]
  
  return users.filter((user) => user.pontuation === firstPosition.pontuation)
}

export function getUpdatedAnswers(currentAnswers, newAnswer) {
  const hasAlreadyAnswered = currentAnswers.some((answer) => answer.questionIndex === newAnswer.questionIndex)

  if (!hasAlreadyAnswered) return [...currentAnswers, newAnswer]

  return currentAnswers.map((answer) => {
    if (answer.questionIndex === newAnswer.questionIndex) {
      return newAnswer
    }

    return answer
  })
}