import Routes from './routes';
import { SensorProvider } from './src/context/SensorContext';
import { AuthProvider } from './src/context/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <SensorProvider>
        <Routes />
        <Toast />
      </SensorProvider>
    </AuthProvider>
  );
}
