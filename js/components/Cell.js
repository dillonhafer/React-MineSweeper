import React from 'react';
import classNames from 'classnames';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMine: props.cell.hasMine,
      hasFlag: props.cell.hasFlag,
      hasQuestion: props.cell.hasQuestion,
      isOpened: props.cell.isOpened,
      count: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpened: nextProps.cell.isOpened,
      hasMine: nextProps.cell.hasMine,
      hasFlag: nextProps.cell.hasFlag,
      hasQuestion: nextProps.cell.hasQuestion,
      count: nextProps.cell.count
    });
  }

  open = () => {
    this.props.open(this.props.cell);
  }

  openAround = (e) => {
    e.preventDefault();
    this.props.openAround(this.props.cell);
  }

  mark = (e) => {
    e.preventDefault();
    if(!this.state.isOpened){
      this.props.mark(this.props.cell);
    }
  }

  getCellType = () => {
    const openCell = this.isOpen();

    let cellType = "closed";
    if (openCell && this.state.hasMine) {
      cellType = "mine";
    } else if (openCell) {
      cellType = "number";
    } else if (this.state.hasFlag) {
      cellType = "flag";
    } else if (this.state.hasQuestion) {
      cellType = "question";
    }
    return cellType;
  }

  isOpen = () => {
    const gameOverMine = (this.props.gameover && this.state.hasMine);
    return this.state.isOpened || gameOverMine;
  }

  getCell() {
    const coverClasses = classNames(
      "Cell__cover",
      {
        "open-bomb": this.state.hasMine && this.isOpen(),
        "Cell__cover--opened": this.state.isOpened
      }
    );

    const cellType = this.getCellType();
    const cellClasses = {
      mine: "Cell__bomb",
      number: "Cell__number"+this.state.count,
      flag: "Cell__flag",
      question: "Cell__flag"
    }

    const cellContent = {
      mine: "💥",
      number: this.state.count > 0 ? this.state.count : '',
      flag: "🚩",
      question: "❓"
    }

    return (
      <div className={coverClasses}>
        <span className={cellClasses[cellType]}>{cellContent[cellType]}</span>
      </div>
    );
  }

  render() {
    const handleOnContextMenu = this.state.isOpened ? this.openAround : this.mark;
    return (
      <td className="Cell" onClick={this.open} onContextMenu={handleOnContextMenu}>
        {this.getCell()}
      </td>
    );
  }
}
