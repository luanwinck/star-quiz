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