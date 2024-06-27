function App() {
  return (
    <div>
      <h1>Things to Learn</h1>

      <button
        type="button"
        onClick={() => {
          fetch("http://localhost:8000/")
            .then((response) => response.json())
            .then((payload) => {
              console.log(payload);
            });
        }}
      >
        Fetch List
      </button>
    </div>
  );
}

export default App;
