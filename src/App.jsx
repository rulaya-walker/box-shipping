import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import QuoteBody from "./components/QuoteBody"
import GetAQuote from "./pages/GetAQuote"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new-quote" element={<GetAQuote />} />
    </Routes>
  )
}

export default App
