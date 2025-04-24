import "./App.css";
import AddMovie from "./components/AddMovie/AddMovie";
import Counter from "./components/Counter";
import MovieList from "./components/movielist/MovieList";

function App() {
  return (
    <>
      <AddMovie />
      <MovieList />
      <Counter />
    </>
  );
}

export default App;
