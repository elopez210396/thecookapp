import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <h1 className="mb-8 text-3xl font-extrabold text-red-600">THE COOK</h1>
      <LoginForm />
      <p className="mt-10 text-xs text-gray-400">© The Cook {new Date().getFullYear()}</p>
    </div>
  );
}
