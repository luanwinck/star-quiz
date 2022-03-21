import React from 'react'
import { Button } from '../../components'

import './results.css'

export function ResultsScreen() {
  return (
    <div className="results_container">
      <h1 className="results_title">E os jedis vencedores são:</h1>

      <div className="results_winners-container">
        <div className="results_winner-container results_winner-container-second">
          <img 
            className="results_winner-image results_winner-image-second"
            src="https://bandodequadrados.com/img/imagem_noticia/7fa2a9372216dcc2beff8be6c4cba83d.jpg"
            alt=""
          />
          <span className="results_winner-name">Rafael Fumegalli</span>
        </div>

        <div className="results_winner-container results_winner-container-first">
          <img 
            className="results_winner-image results_winner-image-first"
            src="https://bandodequadrados.com/img/imagem_noticia/895754c35dc717def2dbaff04a2551f4.jpg"
            alt=""
          />
          <span className="results_winner-name results_winner-name-first">Luan Winck</span>
        </div>

        <div className="results_winner-container results_winner-container-third">
          <img 
            className="results_winner-image results_winner-image-third"
            src="https://bandodequadrados.com/img/imagem_noticia/983bbd0e58b56e74b3de67a851b53d70.jpg"
            alt=""
          />
          <span className="results_winner-name">Leo Marcos</span>
        </div>
      </div>

      <Button>
        Ranking
      </Button>
    </div>
  )
}
