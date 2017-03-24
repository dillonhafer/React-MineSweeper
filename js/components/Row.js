import React from 'react';
import Cell from './Cell';

export default class Row extends React.Component {
  constructor(props) {
    super(props);
    this.getCell = this.getCell.bind(this);
    this.state = {
      cells: props.cells
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({cells : nextProps.cells});
  }

  getCell(cell, index) {
    return <Cell key={`cell-${index}`}
                 cell={cell}
                 openAround={this.props.openAround}
                 gameover={this.props.gameover}
                 open={this.props.open}
                 mark={this.props.mark} />
  }

  render() {
    const Cells = this.state.cells.map(this.getCell);
    return <tr>{Cells}</tr>;
  }
}
