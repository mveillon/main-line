import Color from "./Color"
import { fenToParts } from "./fenPGN"

interface IStockfish {
  postMessage(cmd: string): void
  addMessageListener(listener: (message: string) => void): void
  removeMessageListener(listener: (message: string) => void): void
}

export interface MoveScore {
  move: string
  score: number
  line: string[]
}

export class Engine {
  protected _sf: IStockfish | undefined
  depth: number
  readonly numMoves: number

  /**
   * A Stockfish wrapper
   * @param depth what depth to run at
   * @param numMoves how many of the best moves to return
   */
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
    let getSF: () => Promise<IStockfish>
    if (process.env.NODE_ENV === 'test') {
      // @ts-ignore
      const Stockfish = await import("../../public/stockfish.wasm")
      getSF = Stockfish.default
    } else if (typeof process.env.NODE_ENV === 'undefined') {
      // @ts-ignore
      const Stockfish = await import("../../../public/stockfish.wasm/stockfish")
      getSF = Stockfish.default
    } else {
      // @ts-ignore
      getSF = window.Stockfish
    }

    return getSF().then((sf: IStockfish) => {
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
      const includedMoves = new Set<string>()

      const listener = (message: string) => {
        if (message.includes(`info depth ${this.depth} seldepth`)) {
          const words = message.split(' ')
          const moveInd = words.indexOf('pv') + 1
          if (!includedMoves.has(words[moveInd])) {
            includedMoves.add(words[moveInd])
            messages.push({
              move: words[moveInd],
              score: parseInt(words[words.indexOf('cp') + 1]),
              line: words.slice(moveInd + 1)
            })

            if (isNaN(messages[messages.length - 1].score)) {
              reject(`NaN score in "${message}"`)
            }
          }
        }

        if (message.includes('bestmove')) {
          messages.sort((ms1, ms2) => ms2.score - ms1.score)

          this._sf?.removeMessageListener(listener)
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
