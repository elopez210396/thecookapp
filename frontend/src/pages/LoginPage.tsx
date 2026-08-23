import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <img src="/logo.png" alt="The Cook" className="mb-8 h-40 w-40 rounded-2xl object-cover shadow-md" />
      <LoginForm />
      <p className="mt-10 text-xs text-gray-400">© The Cook {new Date().getFullYear()}</p>
    </div>
  );
}
