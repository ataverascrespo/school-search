import SearchComponent from './SearchComponent';

function App() {
  
  return (
    <div className="App">
      <h1 className="text-4xl font-bold text-center mt-12">TDSB School Search</h1>
      <h2 className='text-sm mx-4 text-center mb-6'>Search for a school below. LIO rankings are descending, so 1/460 is low but 460/460 is high</h2>
      <SearchComponent />
    </div>
  );
}

export default App
