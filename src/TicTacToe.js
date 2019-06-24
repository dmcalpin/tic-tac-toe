export default class TicTacToe {
    static PLAYER = { X: 1, O: 2 }
    static PLAYER_MARK = {1: 'X', 2: 'O'}
    
    GAME_BOARD = [
        [[-1], [-1], [-1]],
        [[-1], [-1], [-1]],
        [[-1], [-1], [-1]]
    ]
    MARK_SET = [
        // Horizontal win
        () => this.GAME_BOARD[0][0] + this.GAME_BOARD[0][1] + this.GAME_BOARD[0][2],
        () => this.GAME_BOARD[1][0] + this.GAME_BOARD[1][1] + this.GAME_BOARD[1][2],
        () => this.GAME_BOARD[2][0] + this.GAME_BOARD[2][1] + this.GAME_BOARD[2][2],

        // Vertical win
        () => this.GAME_BOARD[0][0] + this.GAME_BOARD[1][0] + this.GAME_BOARD[2][0],
        () => this.GAME_BOARD[0][1] + this.GAME_BOARD[1][1] + this.GAME_BOARD[2][1],
        () => this.GAME_BOARD[0][2] + this.GAME_BOARD[1][2] + this.GAME_BOARD[2][2],

        // Diagonal win
        () => this.GAME_BOARD[0][0] + this.GAME_BOARD[1][1] + this.GAME_BOARD[2][2],
        () => this.GAME_BOARD[2][0] + this.GAME_BOARD[1][1] + this.GAME_BOARD[0][2]
    ]

    constructor(){
        this.hasWinner = false
        this.playersTurn = TicTacToe.PLAYER.X
    }
   
    
    // the game can be won 8 ways
    // 3 in a row across 3 possible rows
    // 3 in a column across 3 possible columns
    // 3 in a row diagonally 2 ways
    checkWinner(gameBoard){
        this.MARK_SET.forEach((group) => {
            let score = group.bind(this)()
            if (score === 3 || score === 6) {
                this.hasWinner = this.playersTurn
            }
        })
    }

    makeMark(player, location){
        this.GAME_BOARD[location.X][location.Y] = player
    }

    // Click Handler
    // Also the only function that should touch the DOM
    handleMark(evt){
        // if the cell hasnt been clicked && no winner yet
        if (!evt.target.textContent && !this.hasWinner) {
            // Reflect the players move in the data
            this.makeMark(this.playersTurn, {
                X: Number(evt.target.dataset.xCoordinate),
                Y: Number(evt.target.dataset.yCoordinate)
            })

            // update the UI
            evt.target.textContent = TicTacToe.PLAYER_MARK[this.playersTurn]

            this.checkWinner(this.GAME_BOARD)

            // Switch Turns
            this.playersTurn = this.playersTurn === TicTacToe.PLAYER.X ? TicTacToe.PLAYER.O : TicTacToe.PLAYER.X
        }
    }
}