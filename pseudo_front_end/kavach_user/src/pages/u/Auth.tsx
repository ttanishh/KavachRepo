
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Join the Community
        </h1>
        
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
