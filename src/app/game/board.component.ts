import { Component, Input, OnInit } from '@angular/core';
import { ComputerMove } from '../gamelogic/computermove';
import { Game } from '../models/game';
import { GameLogicService } from '../shared/game-logic.service';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'ttt-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [ GameLogicService ]
})
export class BoardComponent implements OnInit {
  @Input() game: Game;
  @Input() boardActive;
  board = [];
  turns = 0;

  constructor(private _gameService: GameService, private _gamelogicService: GameLogicService) {}

  ngOnInit(): void {
    console.log(this.game);
    this.board = this.createBoard();
  }

  createBoard(){
    let board = [];
    for( let i = 0; i < 9; i ++ ){
      let currstate = this.game.board.charAt(i);
      if(currstate == '_') currstate = null;
      else this.turns++;

      board.push( { id: i, state: currstate } )
    };
    return board;
  }

  makeMoveOnBoard(boxIndex: number) {
    let activePlayer = this.game.xTurn ? 'X' : 'O';
    console.log(this.game.xTurn, activePlayer, boxIndex);
    this.board[boxIndex] = { id: boxIndex, state: activePlayer };
    this.turns++;

    if(this._gamelogicService.checkWinner(this.board)) {
      this.game.result = (activePlayer === 'X' ? "You" : "Opponent") + " Won!";
    }

    if(this.game.result || this.turns >= 9) {
      this.game.isComplete = true;
      if(!this.game.result) this.game.result = "It's a DRAW!"
      this.boardActive = false;
    }

    this.game.xTurn = !this.game.xTurn;
  }

  makeMove(boxIndex: number) {
    this.makeMoveOnBoard(boxIndex);

    if(this.game.isComplete) return;

    if(this.game.gameMode === 1) {
      let player = this.game.xTurn ? 'X' : 'O';

      let moveIndex = this._gamelogicService.getComputerMove(this.board, player);

      this.makeMoveOnBoard(moveIndex);
    }
  }

  // async makeMove(boxIndex: number) {
  //   this.makeMoveOnBoard(boxIndex);
  //   await this._gameService.makeMove(this.game.xPlayerId, this.game.id, boxIndex);

  //   if(this.game.gameMode === 1)
  //     await this.makeComputerMove();
  // }

  // async makeComputerMove() {
  //   await this._gameService.getMove(this.game.xPlayerId, this.game.id);
  //   let index: number = this._gameService.bestMove;
  //   await this._gameService.makeMove(this.game.xPlayerId, this.game.id, index);
  //   this.makeMoveOnBoard(index);
  // }
}
