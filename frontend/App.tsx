import Routes from './routes';
import { SensorProvider } from './src/context/SensorContext';

export default function App() {
  return (
    <SensorProvider>
      <Routes />
    </SensorProvider>
  );
}
