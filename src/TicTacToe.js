const KEYS = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    TAB: 9,
    ENTER: 13
}

export default class TicTacToe {
    constructor(config){
        this.PLAYER = { X: 1, O: 2 }
        this.PLAYER_MARK = {1: 'X', 2: 'O'}
        this.GAME_BOARD = [
            Array(3),
            Array(3),
            Array(3)
        ]

        this.hasWinner = false
        this.playersTurn = this.PLAYER.X
        this.cells = [...config.cells]
        this.message = config.message
        this.reset = config.reset

        // Event Listeners, bind `this` otherwise it would refer to the element
        this.cells.forEach((cell) => {
            cell.addEventListener('click', this.handleMark.bind(this))

            // Note: keydown is used here instead of keyup to trigger
            // the navigation before the default 'tab' event
            cell.addEventListener('keydown', this.handleNavigate.bind(this))
        })

        this.reset.addEventListener('click', this.resetBoard.bind(this))
        this.reset.addEventListener('keyup', (evt) => {
            if(evt.keyCode === KEYS.UP){
                this.cells[8].focus() 
            }
        })     
    }
   
    
    // the game can be won 8 ways
    // 3 in a row across 3 possible rows
    // 3 in a column across 3 possible columns
    // 3 in a row diagonally 2 ways
    checkWinner(){
        // Check Each Row and Column
        for(let i=0; i<this.GAME_BOARD.length; i++){
            let rowSequence = ''
            let colSequence = ''
            
            for(let j=0; j<this.GAME_BOARD[i].length; j++){
                rowSequence += this.GAME_BOARD[i][j]
                colSequence += this.GAME_BOARD[j][i]
            }
            if (rowSequence === this.winPattern() || colSequence === this.winPattern()) {
                this.hasWinner = true
                break
            }
        }

        // check the diagonals
        let topToBotDiag = ''
        let botToTopDiag = ''
        for(let i=0; i<this.GAME_BOARD.length; i++){
            topToBotDiag += this.GAME_BOARD[i][i]
            botToTopDiag += this.GAME_BOARD[2 - i][i]
            
            if (topToBotDiag === this.winPattern() || botToTopDiag === this.winPattern()) {
                this.hasWinner = true
                break
            }
        }
    }

    makeMark(playerTurn, location){
        this.GAME_BOARD[location.Y][location.X] = this.PLAYER_MARK[playerTurn]
    }

    winPattern(){
        // add 1 because technically the array is joined by the delimiter,
        // so we need one more element
        return Array(this.GAME_BOARD.length + 1).join(this.PLAYER_MARK[this.playersTurn])
    }

    resetBoard(evt){
        this.hasWinner = false
        this.GAME_BOARD = [
            Array(3),
            Array(3),
            Array(3)
        ]
        this.cells.forEach((cell) => {
            cell.textContent = ''
        })
        this.playersTurn = this.PLAYER.X
        this.message.textContent = ''
    }

    // Click Handler for placing a mark
    handleMark(evt){
        // if the cell hasnt been clicked && no winner yet
        if (!evt.target.textContent && !this.hasWinner) {
            // Reflect the players move in the data
            this.makeMark(this.playersTurn, {
                X: Number(evt.target.dataset.xCoordinate),
                Y: Number(evt.target.dataset.yCoordinate)
            })

            // update the UI
            evt.target.textContent = this.PLAYER_MARK[this.playersTurn]

            this.checkWinner(this.GAME_BOARD)

            if (this.hasWinner) {
                this.message.textContent = `${this.PLAYER_MARK[this.playersTurn]} is the winner!`
            }

            // Switch Turns
            this.playersTurn = this.playersTurn === this.PLAYER.X ? this.PLAYER.O : this.PLAYER.X
        }
    }

    // Keyboard accessibility with arrows
    handleNavigate (evt) {
        if(evt.keyCode !== KEYS.ENTER){
            evt.preventDefault();
        }
        let currIndex = Number(evt.target.dataset.index)
        switch (evt.keyCode) {
            case KEYS.UP:
                if (currIndex >= 3) {
                    this.cells[currIndex - 3].focus()
                }
                break;
            case KEYS.DOWN:
                if (currIndex < 6) {
                    this.cells[currIndex + 3].focus()
                } else {
                    this.reset.focus()
                }
                break;
            case KEYS.LEFT:
                if (currIndex % 3 !== 0) {
                    this.cells[currIndex - 1].focus()
                }
                break;
            case KEYS.RIGHT:
                if (currIndex % 3 !== 2) {
                    this.cells[currIndex + 1].focus()
                }
                break;
            case KEYS.TAB:
                if (!evt.shiftKey) {
                    this.reset.focus()
                }
            default:
                break;
        }
    }
}