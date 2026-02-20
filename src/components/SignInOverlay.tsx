// src/components/SignInOverlay.tsx
import { useAuth } from "@/lib/AuthProvider";

interface SignInOverlayProps {
  title?: string;
  description?: string;
}

export default function SignInOverlay({ 
  title = "Sign in to unlock this feature",
  description = "Create a free account to access all features and start earning rewards."
}: SignInOverlayProps) {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#003B49]/80 backdrop-blur-sm" />
      
      <div className="relative z-10 bg-[#004D5C] border border-white/20 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#FF9151]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-8 h-8 text-[#FF9151]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-white/70 mb-6">{description}</p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="text-left bg-white/5 rounded-lg p-4 mt-4">
          <p className="text-sm font-medium text-[#15C5C1] mb-2">Why sign in?</p>
          <ul className="text-sm text-white/60 space-y-1">
            <li> Track your shopping rewards</li>
            <li> Access AI-powered training</li>
            <li> Earn referral bonuses</li>
            <li> Save your progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
