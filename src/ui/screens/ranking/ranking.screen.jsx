import React, { useEffect, useState } from 'react'
import { useResult } from '../../../services'
import { Loader } from '../../components'

import './ranking.css'

const GOLD_MEDAL = '🥇'
const SILVER_MEDAL = '🥈'
const BRONZE_MEDAL = '🥉'
const TROPHY = '🏆'
const ARROW_UP = '⬆'
const ARROW_DOWN = '⬇'


const MEDALS = [GOLD_MEDAL, SILVER_MEDAL, BRONZE_MEDAL]

function UserPontuation({
  name,
  user,
  pontuation,
  prevPontuation,
  timesWon,
  hasBeenGoneUp,
  hasBeenGoneDown,
  index
}) {
  const diffPontuation = pontuation - prevPontuation
  const pontuationLabel = prevPontuation && diffPontuation
    ? `${pontuation} (+${diffPontuation})`
    : pontuation
  const hasMedal = !!MEDALS[index]
  const position = index + 1

  function renderPositionIcon() {
    if (hasBeenGoneUp) {
      return <span className="ranking_user-arrow-up">{ARROW_UP}</span>
    }

    if (hasBeenGoneDown) {
      return <span className="ranking_user-arrow-down">{ARROW_DOWN}</span>
    }

    return <span className="ranking_user-text">-</span>
  }

  return (
    <div className={`ranking_user-container ${index > 0 && 'ranking_user-container-border'}`}>
      <div className="ranking_user-text-container">
        <span className="ranking_user-text">{position}-</span>
        <span className="ranking_user-text">{name || user}</span>
        <span className="ranking_user-text">{pontuationLabel}</span>
      </div>

      {renderPositionIcon()}

      {hasMedal && <span className="ranking_user-medal">{MEDALS[index]}</span>}

      {!!timesWon && (
        <div className="ranking_user-trophy-container">
          {Array.from({ length: timesWon }).map(() => (
            <span className="ranking_user-trophy">{TROPHY}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export function RankingScreen() {
  const { getRanking } = useResult()
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function handleGetRanking() {
      const data = await getRanking()

      setUsers(data)
    }

    handleGetRanking()
  }, [])

  if (users.length === 0) return <Loader />

  return (
    <div className="ranking">
      <div className="ranking_container">
        <h1 className="ranking_title">Ranking</h1>

        {users.map((user, index) => (
          <UserPontuation
            {...user}
            key={user.user}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
