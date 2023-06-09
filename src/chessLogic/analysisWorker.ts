import { Engine } from "./Engine"

const engine = new Engine(20, 3)
self.onmessage = (e: MessageEvent<string>) => {
  switch (e.data) {
    case "quit":
      engine.quit()
      break
    case "stop": 
      engine.stop()
      break
    default:
      engine.getBestMoves(e.data).then((moves) => {
        postMessage(moves)
      })
  }
}
