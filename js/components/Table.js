import React from 'react';
import Row from './Row';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows : this.createTable(props),
      gameover: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== "gameover" && nextProps.status === "gameover") {
      this.setState({
        gameover: true
      });
    }

    if (this.props.status === "gameover" && nextProps.status === "clear") {
      this.setState({
        gameover: false
      });
    }

    if(this.props.openNum > nextProps.openNum || this.props.colNum !== nextProps.colNum){
      this.setState({
        rows: this.createTable(nextProps),
        gameover: false
      });
    }
  }

    createTable(props) {
        var mineTable = [];
        for(var row = 0; row < props.rowNum; row++){
            mineTable.push([]);
            for(var col = 0; col < props.colNum; col++){
                mineTable[row].push({
                    x : col,
                    y : row,
                    count : 0,
                    isOpened : false,
                    hasMine : false,
                    hasFlag : false
                });
            }
        }
        for(var i = 0; i < props.mineNum; i++){
            var cell = mineTable[Math.floor(Math.random()*props.rowNum)][Math.floor(Math.random()*props.colNum)];
            if(cell.hasMine){
                i--;
            } else {
                cell.hasMine = true;
            }
        }
        return mineTable;
    }
    open = (cell) => {
      if (this.state.gameover) {
        return;
      }
        var num = this.countMines(cell);
        var _rows = this.state.rows;
        if(!_rows[cell.y][cell.x].isOpened){
            this.props.addOpenNum();
        }
        _rows[cell.y][cell.x].isOpened = true;
        _rows[cell.y][cell.x].count = cell.hasMine ? "b" : num;
        this.setState({rows : _rows});
        if(_rows[cell.y][cell.x].hasFlag){
            _rows[cell.y][cell.x].hasFlag = false;
            this.props.checkFlagNum(-1);
        }
        if(!cell.hasMine && num === 0){
            this.openAround(cell);
        }
        if(cell.hasMine){
            this.props.gameOver();
        }
    }
  mark = (cell) => {
        if (this.state.gameover) {
          return
        }
        var _rows = this.state.rows;
        var _cell = _rows[cell.y][cell.x];
        if (_cell.hasFlag) {
          this.props.checkFlagNum(-1);
          _cell.hasFlag = false;
          _cell.hasQuestion = true;
          this.setState({rows : _rows});
        } else if (_cell.hasQuestion) {
          _cell.hasFlag = false;
          _cell.hasQuestion = false;
          this.setState({rows : _rows});
        } else {
          _cell.hasFlag = !_cell.hasFlag;
          _cell.hasQuestion = false;
          this.setState({rows : _rows});
          this.props.checkFlagNum(_cell.hasFlag ? 1 : -1);
        }
    }
    countMines(cell) {
        var aroundMinesNum = 0;
        for(var row = -1; row <= 1; row++){
            for(var col = -1; col <= 1; col++){
                if(cell.y-0 + row >= 0 && cell.x-0 + col >= 0 && cell.y-0 + row < this.state.rows.length && cell.x-0 + col < this.state.rows[0].length && this.state.rows[cell.y-0 + row][cell.x-0 + col].hasMine && !(row === 0 && col === 0)){
                    aroundMinesNum ++;
                }
            }
        }
        return aroundMinesNum;
    }
  openAroundAll = (cell) => {
      if (this.state.gameover) {
        return;
      }
        var _rows = this.state.rows;
        for(var row = -1; row <= 1; row++){
            for(var col = -1; col <= 1; col++){
                if(cell.y-0 + row >= 0 && cell.x-0 + col >= 0 && cell.y-0 + row < this.state.rows.length && cell.x-0 + col < this.state.rows[0].length && !this.state.rows[cell.y-0 + row][cell.x-0 + col].hasFlag && !this.state.rows[cell.y-0 + row][cell.x-0 + col].hasQuestion && !this.state.rows[cell.y-0 + row][cell.x-0 + col].isOpened){
                   this.open(_rows[cell.y-0 + row][cell.x-0 + col]);
                }
            }
        }
    }
    openAround(cell){
        var _rows = this.state.rows;
        for(var row = -1; row <= 1; row++){
            for(var col = -1; col <= 1; col++){
                if(cell.y-0 + row >= 0 && cell.x-0 + col >= 0 && cell.y-0 + row < this.state.rows.length && cell.x-0 + col < this.state.rows[0].length && !this.state.rows[cell.y-0 + row][cell.x-0 + col].hasMine && !this.state.rows[cell.y-0 + row][cell.x-0 + col].isOpened){
                   this.open(_rows[cell.y-0 + row][cell.x-0 + col]);
                }
            }
        }
    }

  getRow = (row, index) => {
    return (
      <Row key={`row-${index}`}
           cells={row}
           gameover={this.state.gameover}
           openAround={this.openAroundAll}
           open={this.open}
           mark={this.mark} />
    );
  }

  render() {
    const Rows = this.state.rows.map(this.getRow);
    return (
      <table className="Table">
        <tbody>
          {Rows}
        </tbody>
      </table>
    );
  }
}
