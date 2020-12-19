import React, { Component } from 'react';
import Card from './components/Card/Card';
import Score from './components/Score/Score';
import Wrapper from './components/Wrapper';
import Footer from './components/Footer/Footer';
import butterfly from './cards.json';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      butterfly,
      clickedButterflyIds: [],
      score: 0,
      goal: 9,
      status: '',
    };
  }

  shuffleScoreCard = (id) => {
    let clickedButterflyIds = this.state.clickedButterflyIds;

    if (clickedButterflyIds.includes(id)) {
      this.setState({ clickedButterflyIds: [], score: 0, status: 'Game Over! You lost. Click to play again!' });
      return;
    } else {
      clickedButterflyIds.push(id);

      if (clickedButterflyIds.length === 8) {
        this.setState({
          score: 8,
          status: 'You Won! Great Job, Smartie! Click to play again!',
          clickedButterflyIds: [],
        });
        console.log('You Win');
        return;
      }

      this.setState({ butterfly, clickedButterflyIds, score: clickedButterflyIds.length, status: ' ' });

      for (let i = butterfly.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [butterfly[i], butterfly[j]] = [butterfly[j], butterfly[i]];
      }
    }
  };

  render() {
    return (
      <div className='App'>
        <h1 id='rainbow'>The Butterflies Clicky Game</h1>
        <p>Try not to click the same image twice!</p>

        <Score total={this.state.score} goal={8} status={this.state.status} />
        <Wrapper>
          {this.state.butterfly.map((butterfly) => {
            return (
              <Card
                shuffleScoreCard={this.shuffleScoreCard}
                image={butterfly.image}
                key={butterfly.id}
                id={butterfly.id}
              />
            );
          })}
        </Wrapper>

        <Footer />
      </div>
    );
  }
}

export default App;
