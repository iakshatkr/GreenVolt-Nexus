import { AppRouter } from './router/AppRouter';
import { useBootstrapAuth } from './hooks/useBootstrapAuth';

function App() {
  useBootstrapAuth();
  return <AppRouter />;
}

export default App;

