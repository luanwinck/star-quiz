import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalQuiz } from '../../../context'
import { useResult } from '../../../hooks'
import { Button } from '../../components'

import './results.css'

function Winner({
  winner,
  containerClassName,
  imageClassName,
  textClassName,
  image,
}) {
  if (!winner) return null

  return (
    <div className={`results_winner-container ${containerClassName}`}>
      <img 
        className={`results_winner-image ${imageClassName}`}
        src={image}
        alt=""
      />
      <span className={`results_winner-name ${textClassName}`}>{winner.name}</span>
      <span className={`results_winner-name ${textClassName}`}>Acertos: {winner.pontuation}</span>
    </div>
  )
}

export function ResultsScreen() {
  const { getUserPontuations } = useResult()
  const [winners, setWinners] = useState([])
  const [{ questions }] = useGlobalQuiz()
  const navigate = useNavigate()

  function handleWinners(winners) {
    const pontuationsObj = winners.reduce((acc, user) => {
      const pontuationUsers = acc[user.pontuation]

      if (pontuationUsers) {
        const newPontuationUsers = {
          name: `${pontuationUsers.name} e ${user.name}`,
          pontuation: user.pontuation,
        }

        return {
          ...acc,
          [user.pontuation]: newPontuationUsers,
        }
      }

      return {
        ...acc,
        [user.pontuation]: user,
      }
    }, {})

    return Object.values(pontuationsObj).sort((a, b) => b.pontuation - a.pontuation)
  }

  useEffect(() => {
    async function handleGetWinners() {
      const winners = await getUserPontuations() 

      setWinners(handleWinners(winners))
    }

    handleGetWinners()
  }, [questions])

  function handleGoToRanking() {
    navigate('/ranking')
  } 

  return (
    <div className="results_container">
      <h1 className="results_title">E os jedis vencedores são:</h1>

      <div className="results_winners-container">
        <Winner
          winner={winners[1]}
          containerClassName="results_winner-container-second"
          imageClassName="results_winner-image-second"
          image="https://bandodequadrados.com/img/imagem_noticia/7fa2a9372216dcc2beff8be6c4cba83d.jpg"
        />

        <Winner
          winner={winners[0]}
          containerClassName="results_winner-container-first"
          imageClassName="results_winner-image-first"
          textClassName="results_winner-name-first"
          image="https://bandodequadrados.com/img/imagem_noticia/895754c35dc717def2dbaff04a2551f4.jpg"
        />

        <Winner
          winner={winners[2]}
          containerClassName="results_winner-container-third"
          imageClassName="results_winner-image-third"
          image="https://bandodequadrados.com/img/imagem_noticia/983bbd0e58b56e74b3de67a851b53d70.jpg"
        />
      </div>

      <Button onClick={handleGoToRanking}>
        Ranking
      </Button>
    </div>
  )
}
