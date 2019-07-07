export default class TicTacToe {
    constructor(config){
        this.PLAYER = { X: 1, O: 2 }
        this.PLAYER_MARK = {1: 'X', 2: 'O'}

        this.GAME_BOARD = [
            [[-1], [-1], [-1]],
            [[-1], [-1], [-1]],
            [[-1], [-1], [-1]]
        ]

        /*
        The algorithm to determine a winner is to add the possible winning directions
        together, if they add up to 3 "X" wins, if they add up to 6 "O" wins
        */
        this.MARK_SET = [
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
            if(evt.keyCode === 38){ // up key
                this.cells[8].focus() 
            }
        })     
    }
   
    
    // the game can be won 8 ways
    // 3 in a row across 3 possible rows
    // 3 in a column across 3 possible columns
    // 3 in a row diagonally 2 ways
    checkWinner(){
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

    resetBoard(evt){
        this.hasWinner = false
        this.GAME_BOARD = [
            [[-1], [-1], [-1]],
            [[-1], [-1], [-1]],
            [[-1], [-1], [-1]]
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
        if(evt.keyCode !== 13){ // enter key
            evt.preventDefault();
        }
        let currIndex = Number(evt.target.dataset.index)
        switch (evt.keyCode) {
            case 38: // up
                if (currIndex >= 3) {
                    this.cells[currIndex - 3].focus()
                }
                break;
            case 40: // down
                if (currIndex < 6) {
                    this.cells[currIndex + 3].focus()
                } else {
                    this.reset.focus()
                }
                break;
            case 37: // left
                if (currIndex % 3 !== 0) {
                    this.cells[currIndex - 1].focus()
                }
                break;
            case 39: // right
                if (currIndex % 3 !== 2) {
                    this.cells[currIndex + 1].focus()
                }
                break;
            case 9: // tab
                if (!evt.shiftKey) {
                    this.reset.focus()
                }
            default:
                break;
        }
    }
}