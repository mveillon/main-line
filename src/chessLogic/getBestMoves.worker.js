import { Engine } from "./Engine"

onmessage = (e) => {
  const engine = new Engine(20, 3)
  engine.getBestMoves(e.data).then((moves) => {
    engine.quit()
    postMessage(moves)
  })
}