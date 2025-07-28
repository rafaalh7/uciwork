// App.jsx
import { Toaster } from 'react-hot-toast';
import UserProfileForm from './components/UserProfileForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <UserProfileForm />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;