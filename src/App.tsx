import AuthContextProvider from './contexts/AuthContext';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  );
};

export default App;
