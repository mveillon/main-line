import { full } from "../utils/numJS"

interface UCI {
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
  protected _uci: UCI | undefined
  depth: number
  readonly numMoves: number
  protected _dead: boolean[]
  protected readonly _intervalTime = 500

  /**
   * A Stockfish wrapper
   * @param depth what depth to run at
   * @param numMoves how many of the best moves to return
   */
  constructor(depth: number, numMoves: number) {
    this._uci = undefined
    this.depth = depth
    this.numMoves = numMoves
    this._dead = []
  }

  protected _initialMessages = (uci: UCI) => {
    uci.postMessage('uci')
    uci.postMessage(`setoption name multipv value ${this.numMoves}`)
  }

  /**
   * Loads the Stockfish engine and initializes it
   * @returns the initialized engine
   */
  protected async _loadEngine(): Promise<UCI> {
    let getSF: () => Promise<UCI>
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

    return getSF().then((sf: UCI) => {
      this._initialMessages(sf)
      return sf
    })
  }

  /**
   * Waits for the engine to say its ready for the next command
   */
  protected async _waitForReady() {
    const deadInd = this._dead.push(false)

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this._uci?.removeMessageListener(listener)
        clearInterval(interval)
        this._dead[deadInd] = true
        resolve(undefined)
      }

      const listener = (message: string) => {
        if (message.includes('readyok')) {
          cleanup()
        }
      }

      const interval = setInterval(() => {
        if (this._dead[deadInd]) {
          cleanup()
        }
      }, this._intervalTime)

      this._uci?.addMessageListener(listener);
      this._uci?.postMessage('isready')
    })
  }

  /**
   * Gets the `nummoves` best moves from the engine in the current position
   * given by `fen`
   * @param fen the FEN of the current position
   * @returns the `numMoves` best moves in the position
   */
  async getBestMoves(fen: string): Promise<MoveScore[]> {
    if (typeof this._uci === 'undefined') {
      this._uci = await this._loadEngine()
    }

    await this._waitForReady()

    const deadInd = this._dead.push(false)

    return new Promise<MoveScore[]>((resolve, reject) => {
      const messages: MoveScore[] = []
      const includedMoves = new Set<string>()

      const cleanup = () => {
        messages.sort((ms1, ms2) => ms2.score - ms1.score)
        this._uci?.removeMessageListener(listener)
        clearInterval(interval)
        this._dead[deadInd] = true
        resolve(messages)
      }

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
          cleanup()
        }
      }

      const interval = setInterval(() => {
        if (this._dead[deadInd]) {
          cleanup()
        }
      }, this._intervalTime)

      this._uci?.addMessageListener(listener)

      this._uci?.postMessage('ucinewgame')
      this._uci?.postMessage(`position fen ${fen}`)
      this._uci?.postMessage(`go depth ${this.depth}`)
    })
  }

  /**
   * Closes the engine and clears all threads. Should always be called at the 
   * end to prevent leaking threads and such nonsense
   */
  quit() {
    this._uci?.postMessage('quit')
  }

  /**
   * Stops the engine's calculations as soon as possible
   */
  async stop() {
    return new Promise<void>((resolve, reject) => {
      const listener = (message: string) => {
        if (message.includes('bestmove')) {
          this._uci?.removeMessageListener(listener)
          this.quit()

          this._loadEngine().then((engine) => {
            this._uci = engine
            resolve(undefined)
          })
        }
      }

      this._dead = full([this._dead.length], true) as boolean[]
      this._uci?.addMessageListener(listener)
      this._uci?.postMessage('stop')
      
    })
  }
}
