import React from 'react';
import ArtTable from './ArtTable';
import "./App.css";

const App: React.FC = () => {
return (
<>
  <div className="p-4">
  <h1 className="text-center">Art Institute of Chicago - Artworks</h1>
  <ArtTable />
  </div>
</>
);
};


export default App;