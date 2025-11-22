import { useRouter } from 'expo-router';
import RegisterScreen from '../screens/RegisterScreen';

export default function SignUp() {
  const router = useRouter();
  
  const navigation = {
    navigate: (route: string) => {
      if (route === 'Login') {
        router.push('/');
      }
    }
  };

  return <RegisterScreen navigation={navigation} />;
}
