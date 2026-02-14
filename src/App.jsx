import {Routes, Route, useLocation} from 'react-router'
import Header from "./components/Header/Header"
import GameOptions from "./components/GameOptions/GameOptions"
import WhosThatPokemon from "./components/WhosThatPokemon/WhosThatPokemon"
import MemoryGame from "./components/MemoryGame/MemoryGame"
import TypeMatcher from "./components/TypeMatcher/TypeMatcher"

function App() {
  const location = useLocation();
  const isGameRoute = location.pathname !== '/';

  return (
    <>
      {!isGameRoute && <Header />}
      <Routes>
        <Route path="/" element={<GameOptions />} />
        <Route path="/whos-that-pokemon" element={<WhosThatPokemon />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/type-matcher" element={<TypeMatcher />} />
      </Routes>
    </>
  )
}

export default App
