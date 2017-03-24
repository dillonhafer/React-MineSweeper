import React from 'react';
import Table from './Table.js';

export default class MineSweeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.state = {
      level: "easy",
      mineNum : 10,
      rowNum : 9,
      colNum : 9,
      flagNum : 0,
      openNum : 0,
      time : 0,
      status : "playing"   // playing, clear, gameover
    };
  }

  componentWillUpdate() {
    if(this.state.status === "playing"){
      this.judge();
    }
  }

  componentWillMount() {
    this.intervals = [];
  }

  tick() {
    if(this.state.openNum > 0 && this.state.status === "playing"){
      this.setState({time: this.state.time + 1});
    }
  }

  judge() {
    if(this.state.mineNum + this.state.openNum >= this.state.rowNum * this.state.colNum){
      this.setState({status: "clear"});
    }
  }

  gameOver() {
    this.setState({status: "gameover"});
  }

  checkFlagNum(update) {
    this.setState({flagNum: this.state.flagNum + update});
  }

  setMine(){
    var mineTable = this.state.mineTable;
    for(var i = 0; i < this.state.mineNum; i++){
      var cell = mineTable[Math.floor(Math.random()*10)][Math.floor(Math.random()*10)];
      if(cell.hasMine){
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    this.setState({
      mineTable: mineTable
    });
  }

  addOpenNum() {
    if(this.state.openNum === 0){
      this.interval = setInterval(this.tick.bind(this), 1000);
    }
    this.setState({
      openNum : ++ this.state.openNum
    });
  }

  reset() {
    clearInterval(this.interval);
    this.setState({openNum: 0, flagNum: 0, time: 0, status: "playing"});
  }

  handleLevelChange(e) {
    clearInterval(this.interval);
    const options = {
      easy:   {mineNum: 10,  rowNum: 9,  colNum: 9},
      normal: {mineNum: 40,  rowNum: 16, colNum: 16},
      hard:   {mineNum: 100, rowNum: 16, colNum: 30}
    };

    const level = Object.keys(options).includes(e.target.value) ? e.target.value : "easy";
    const mineOptions = Object.assign(
      {},
      options[level],
      {
        level,
        openNum: 0,
        flagNum: 0,
        time: 0,
        status: "playing"
      }
    );

    this.setState(mineOptions);
  }

  render() {
    return (
      <div>
        <div className="MineSweeper__level">
          <input type="radio"
                 id="levelEasy"
                 name="level"
                 value="easy"
                 checked={this.state.level === "easy"}
                 onChange={this.handleLevelChange} />
          <label htmlFor="levelEasy">Easy</label>
          <input type="radio"
                 id="levelNormal"
                 name="level"
                 value="normal"
                 onChange={this.handleLevelChange} />
          <label htmlFor="levelNormal">Normal</label>
          <input type="radio"
                 id="levelHard"
                 name="level"
                 value="hard"
                 onChange={this.handleLevelChange} />
          <label htmlFor="levelHard">Hard</label>
        </div>
        <div className={"MineSweeper " + this.state.level}>
          <span className="MineSweeper__flagNum"> {this.state.mineNum - this.state.flagNum}</span>
          <span className="MineSweeper__face" onClick={this.reset.bind(this)}>
            <span className={"button " + this.state.status}></span>
          </span>
          <span className="MineSweeper__time"> {this.state.time}</span>
          <Table status={this.state.status} openNum={this.state.openNum} mineNum={this.state.mineNum} rowNum={this.state.rowNum} colNum={this.state.colNum} gameOver={this.gameOver.bind(this)} addOpenNum={this.addOpenNum.bind(this)} checkFlagNum={this.checkFlagNum.bind(this)}/>
        </div>
      </div>
    );
  }
}
