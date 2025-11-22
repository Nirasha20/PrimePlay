import { useRouter } from 'expo-router';
import LoginScreen from '../screens/LoginScreen';

export default function Login() {
  const router = useRouter();
  
  const navigation = {
    navigate: (route: string) => {
      if (route === 'SignUp') {
        router.push('/signup');
      }
    }
  };

  return <LoginScreen navigation={navigation} />;
}
