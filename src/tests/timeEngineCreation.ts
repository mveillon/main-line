import { Engine } from "../chessLogic/Engine"

interface UCI {
  postMessage(cmd: string): void
  addMessageListener(listener: (message: string) => void): void
  removeMessageListener(listener: (message: string) => void): void
}

class EngineFriend extends Engine {
  set uci(val: UCI) {
    this._uci = val
  }

  async loadEngine(): Promise<UCI> {
    return this._loadEngine()
  }

  async waitForReady(): Promise<void> {
    return this._waitForReady()
  }
}

const timeEngineCreation = async (): Promise<string> => {
  let totalSeconds = 0
  const numIters = 100
  
  for (let i = 0; i < numIters; i++) {
    const start = Date.now()
    
    const e = new EngineFriend(20, 3)
    e.uci = await e.loadEngine()
    await e.waitForReady()
    
    const elapsed = Date.now() - start
    totalSeconds += elapsed / 1000
    e.quit()
  }

  const avgTime = (totalSeconds / numIters).toLocaleString(
    'en-us',
    {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }
  )
  return avgTime + ' seconds'
}

timeEngineCreation().then(time => console.log(time))

