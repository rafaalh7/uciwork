// App.jsx
import DocumentTable from './components/DocumentTable';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Gestión de Documentos</h1>
      </header>
      <main className="app-main">
        <DocumentTable />
      </main>
    </div>
  );
}

export default App;