interface IStockfish {
  postMessage(cmd: string): void
  addMessageListener(listener: (message: string) => void): void
  removeMessageListener(listener: (message: string) => void): void
}

export interface MoveScore {
  move: string
  score: number
}

export class Engine {
  protected _sf: IStockfish | undefined
  depth: number
  numMoves: number

  constructor(depth: number, numMoves: number) {
    this._sf = undefined
    this.depth = depth
    this.numMoves = numMoves
  }

  /**
   * Loads the Stockfish engine and initializes it
   * @returns the initialized engine
   */
  protected async _loadEngine(): Promise<IStockfish> {
    // @ts-ignore
    const Stockfish = await import("stockfish.wasm")

    return Stockfish.default().then((sf: IStockfish) => {
      sf.postMessage('uci')
      sf.postMessage(`setoption name multipv value ${this.numMoves}`)
      sf.postMessage('isready')

      return sf
    })
  }

  /**
   * Waits for the engine to say its ready for the next command
   */
  protected async _waitForReady() {
    return new Promise((resolve, reject) => {
      const listener = (message: string) => {
        if (message.includes('readyok')) {
          this._sf?.removeMessageListener(listener)
          resolve(undefined)
        }
      }
      this._sf?.addMessageListener(listener);

      this._sf?.postMessage('isready')
    })
  }

  /**
   * Gets the `nummoves` best moves from the engine in the current position
   * given by `fen`
   * @param fen the FEN of the current position
   * @returns the `numMoves` best moves in the position
   */
  async getBestMoves(fen: string): Promise<MoveScore[]> {
    if (typeof this._sf === 'undefined') {
      this._sf = await this._loadEngine()
    }

    await this._waitForReady()

    return new Promise<MoveScore[]>((resolve, reject) => {
      const messages: MoveScore[] = []
      
      const listener = (message: string) => {
        if (message.includes(`info depth ${this.depth}`)) {
          const words = message.split(' ')
          messages.push({
            move: words[words.indexOf('pv') + 1],
            score: parseInt(words[words.indexOf('cp') + 1])
          })
        }

        if (message.includes('bestmove')) {
          (this._sf as IStockfish).removeMessageListener(listener)
          resolve(messages)
        }
      }
      this._sf?.addMessageListener(listener)

      this._sf?.postMessage('ucinewgame')
      this._sf?.postMessage(`position fen ${fen}`)
      this._sf?.postMessage(`go depth ${this.depth}`)
    })
  }

  /**
   * Closes the engine and clears all threads. Should always be called at the 
   * end to prevent leaking threads and such nonsense
   */
  quit() {
    this._sf?.postMessage('quit')
  }
}
