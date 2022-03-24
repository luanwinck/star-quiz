import React, { useEffect, useState } from 'react'
import { useResult } from '../../../services'
import { Loader } from '../../components'

import './ranking.css'

const GOLD_MEDAL = '🥇'
const SILVER_MEDAL = '🥈'
const BRONZE_MEDAL = '🥉'

const MEDALS = [GOLD_MEDAL, SILVER_MEDAL, BRONZE_MEDAL]

function UserPontuation({ name, user, pontuation, prevPontuation, index }) {
  const pontuationLabel = prevPontuation
    ? `${pontuation} (+${pontuation - prevPontuation})`
    : pontuation
  const hasMedal = !!MEDALS[index]
  const position = index + 1

  return (
    <div className={`ranking_user-container ${index > 0 && 'ranking_user-container-border'}`}>
      <span className="ranking_user-text">{position}-</span>
      <span className="ranking_user-text">{name || user}</span>
      <span className="ranking_user-text">{pontuationLabel}</span>
      {hasMedal && <span className="ranking_user-text">{MEDALS[index]}</span>}
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
        <h1>Ranking</h1>

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
