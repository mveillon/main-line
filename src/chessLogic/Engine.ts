import { appendFile, writeFileSync } from "fs"
import { Worker } from "worker_threads"
import Stockfish from "stockfish"

writeFileSync("./log.txt", '')

const log = (message: string) => {
  appendFile("./log.txt", message + '\n', (err) => { if (err) throw err })
}

interface UCI {
  postMessage(message: string): void
  onmessage(event: MessageEvent<string>): void
}

export interface MoveScore {
  move: string
  score: number
  line: string[]
}

export class Engine {
  protected _uci: UCI | undefined
  readonly depth: number
  readonly numMoves: number
  protected _pending: { promise: Promise<any>, dead: boolean }[]
  protected readonly _intervalTime: number = 500

  /**
   * A Stockfish wrapper
   * @param depth what depth to run at
   * @param numMoves how many of the best moves to return
   */
  constructor(depth: number, numMoves: number) {
    // this._uci = new Worker("./node_modules/stockfish/src/stockfish.js")
    this._uci = undefined
    this.depth = depth
    this.numMoves = numMoves
    this._pending = []
  }

  /**
   * Clears the UCI message listener
   */
  protected _clearListener() {
    this._setListener((_) => {})
  }

  /**
   * Sets the UCI message listener
   * @param listener the listener to use
   */
  protected _setListener(listener: (message: string) => void) {
    if (typeof this._uci === 'undefined') {
      throw new Error('UCI not initialized yet')
    }
    this._uci.onmessage = (e: MessageEvent<string>) => {
      listener(e.data)
    }

    // this._uci?.on('message', listener)
  }

  /**
   * Posts a message to the UCI engine
   * @param message the message to send
   */
  protected _postMessage(message: string) {
    this._uci?.postMessage(message)
  }

  /**
   * Initializes the engine
   */
  protected async _init() {
    // this._uci?.on('error', (err) => { log(err.message); throw err })
    this._uci = await Stockfish()()
    this._postMessage('uci')
    this._postMessage(`setoption name multipv value ${this.numMoves}`)
    this._postMessage('setoption name Use NNUE value true')
  }

  /**
   * Waits for the engine to say it's ready for the next command
   */
  protected async _waitForReady() {
    if (typeof this._uci === 'undefined') {
      await this._init()
    }
    const promiseInd = this._pending.length
    const p = new Promise((resolve, reject) => {
      const cleanup = () => {
        if (!this._pending[promiseInd].dead) {
          this._clearListener()
          resolve(undefined)
          clearInterval(interval)
          this._pending[promiseInd].dead = true
        }
      }

      const listener = (message: string) => {
        if (message.includes('readyok')) {
          cleanup()
        }
      }

      this._setListener(listener)
      this._postMessage('isready')

      const interval = setInterval(() => {
        if (this._pending[promiseInd]?.dead) {
          cleanup()
        }
      }, this._intervalTime)
    })

    this._pending.push({
      promise: p,
      dead: false
    })

    return p
  }

  /**
   * Gets the `nummoves` best moves from the engine in the current position
   * given by `fen`
   * @param fen the FEN of the current position
   * @returns the `numMoves` best moves in the position
   */
  async getBestMoves(fen: string): Promise<MoveScore[]> {
    await this._waitForReady()

    const promiseInd = this._pending.length
    const p = new Promise<MoveScore[]>((resolve, reject) => {
      const messages: MoveScore[] = []
      const includedMoves = new Set<string>()

      const cleanup = () => {
        if (!this._pending[promiseInd].dead) {
          messages.sort((ms1, ms2) => ms2.score - ms1.score)
          this._clearListener()
          resolve(messages)
          clearInterval(interval)
          this._pending[promiseInd].dead = true
        }
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
      this._setListener(listener)

      this._postMessage('ucinewgame')
      this._postMessage(`position fen ${fen}`)
      this._postMessage(`go depth ${this.depth}`)

      const interval = setInterval(() => {
        if (this._pending[promiseInd]?.dead) {
          cleanup()
        }
      }, this._intervalTime)
    })

    this._pending.push({
      promise: p,
      dead: false
    })

    return p
  }

  /**
   * Stops the engine's calculation as soon as possible
   */
  async stop() {
    return new Promise<void>((resolve, reject) => {
      const listener = (message: string) => {
        if (message.includes('bestmove')) {
          this._clearListener()
          resolve(undefined)
        }
      }

      for (let i = 0; i < this._pending.length; i++) {
        this._pending[i].dead = true
      }

      this._setListener(listener)
      this._postMessage('stop')
    })
  }

  /**
   * Closes the engine and clears all threads. Should always be called at the 
   * end to prevent leaking threads and such nonsense
   */
  quit() {
    this._postMessage('quit')
    // this._uci?.terminate()
  }
}
