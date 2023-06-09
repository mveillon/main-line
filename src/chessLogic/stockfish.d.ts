declare module "stockfish" {
  function Stockfish(): () => Promise<UCI>
  export default Stockfish
}