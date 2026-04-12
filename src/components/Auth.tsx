import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Mail, Lock, User, Check, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { supabase } from '../services/supabase';

type AuthMode = 'login' | 'signup' | 'reset';

const Auth: React.FC = () => {
  const { setUser } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const ADMIN_EMAIL = 'kelylo.ing@gmail.com';
  const ADMIN_PASSWORD = 'K5l6l4??';

  const buildUserFromAuth = (emailAddress: string, id = emailAddress.trim().toLowerCase(), nameOverride?: string) => {
    const normalizedEmail = emailAddress.trim().toLowerCase();
    return {
    id: normalizedEmail || id,
    email: normalizedEmail || emailAddress,
    name: nameOverride || emailAddress.split('@')[0],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcC3JJ6pbiJ4huGdQErp1HqdYXv5QSjjUVdzI5yxMSvCafZOcDElC70vwyd1yvnWQJIkA3SA3qV0hrcU_2aR21a_vYyL4__c5Vk5BMJnULE5kBRr0MVHbedGwSryNzECh11wQ0Gi7A4JRh44ZzxgSYBaozjBW6k6SNLpmcSxQ7sgHqQD_F8t7emA54L4Bk0Efhy-NicS6SGD4bOAOYC_NXfIGeo24tsTpoM26uqQn9erV_qKz6719c8vYXXpA-hWjbbQBp-e6tPA',
    preferences: {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      focusSound: 'Rain Forest',
      telegramChatId: '',
      customFocusSongName: '',
      customFocusSongDataUrl: '',
      notifications: {
        taskReminders: true,
        dailyScripture: true,
        streakProtection: false,
      },
    },
    };
  };

  const bootstrapSession = async (user: { id: string; email: string; name: string; role?: 'admin' | 'user' }) => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
    } catch (error) {
      console.warn('Session bootstrap failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    const normalizedEmail = email.trim().toLowerCase();

    // Admin bypass: no provider validation required.
    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = buildUserFromAuth(ADMIN_EMAIL, ADMIN_EMAIL, 'Admin') as { id: string; email: string; name: string; role?: 'admin' | 'user' };
      await bootstrapSession({ ...adminUser, role: 'admin' });
      setUser(adminUser);
      setIsLoading(false);
      return;
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!error) {
        const authUser = data.user;
        const nextUser = buildUserFromAuth(
            authUser?.email || normalizedEmail,
            authUser?.email || normalizedEmail,
            (authUser?.user_metadata?.full_name as string) || (authUser?.email || normalizedEmail).split('@')[0]
          ) as { id: string; email: string; name: string; role?: 'admin' | 'user' };
        await bootstrapSession(nextUser);
        setUser(nextUser);
        setIsLoading(false);
        return;
      }

      // Supabase login failed, fallback to backend auth service.
      try {
        const fallbackResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        });

        const fallbackData = await fallbackResponse.json();
        if (!fallbackResponse.ok || !fallbackData?.success || !fallbackData?.user) {
          setAuthError(error.message || fallbackData?.error || 'Login failed.');
          setIsLoading(false);
          return;
        }

        const nextUser = buildUserFromAuth(
            fallbackData.user.email || normalizedEmail,
            fallbackData.user.email || normalizedEmail,
            fallbackData.user.name || normalizedEmail.split('@')[0]
          ) as { id: string; email: string; name: string; role?: 'admin' | 'user' };
        await bootstrapSession(nextUser);
        setUser(nextUser);
        setIsLoading(false);
        return;
      } catch (fallbackError) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }
    }

    try {
      const fallbackResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const fallbackData = await fallbackResponse.json();
      if (!fallbackResponse.ok || !fallbackData?.success || !fallbackData?.user) {
        setAuthError(fallbackData?.error || 'Login failed.');
        setIsLoading(false);
        return;
      }

      const nextUser = buildUserFromAuth(
          fallbackData.user.email || normalizedEmail,
          fallbackData.user.email || normalizedEmail,
          fallbackData.user.name || normalizedEmail.split('@')[0]
        ) as { id: string; email: string; name: string; role?: 'admin' | 'user' };
      await bootstrapSession(nextUser);
      setUser(nextUser);
      setIsLoading(false);
    } catch (error) {
      setAuthError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      const authUser = data.user;
      const nextUser = buildUserFromAuth(
        authUser?.email || email,
        (authUser?.email || email).trim().toLowerCase(),
        (authUser?.user_metadata?.full_name as string) || fullName || email.split('@')[0]
      ) as { id: string; email: string; name: string; role?: 'admin' | 'user' };
      await bootstrapSession(nextUser);
      setUser(nextUser);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const nextUser = buildUserFromAuth(email || 'user@edenify.com', (email || 'user@edenify.com').trim().toLowerCase(), fullName || email.split('@')[0]) as { id: string; email: string; name: string; role?: 'admin' | 'user' };
      bootstrapSession(nextUser);
      setUser(nextUser);
      setIsLoading(false);
    }, 1500);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      alert(`Reset link sent to ${email}`);
      setEmail('');
      setMode('login');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      alert(`Reset link sent to ${email}`);
      setEmail('');
      setMode('login');
      setIsLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setAuthError('');
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-[#3d2b1f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative gradient backgrounds */}
      <div className="absolute -top-12 -right-12 w-64 h-80 bg-gradient-to-br from-[#d4a86a] to-[#964407] opacity-30 rounded-[3rem] rotate-12 blur-2xl"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-gradient-to-br from-[#d4a86a] to-[#964407] opacity-20 rounded-full blur-3xl"></div>

      {/* Back Button */}
      {mode !== 'login' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => switchMode('login')}
          className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </motion.button>
      )}

      <motion.main
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <img
            src="/edenify-logo.png"
            alt="Edenify"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-serif italic font-medium tracking-tight text-white">Edenify</span>
        </div>

        {/* Login Mode */}
        {mode === 'login' && (
          <div className="w-full space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-serif italic font-medium text-[#d4a86a] mb-3">Welcome back.</h1>
              <p className="text-[#a08060] font-body text-base">Sign in to your Edenify account</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
              {authError && (
                <p className="text-red-300 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2">{authError}</p>
              )}
              {/* Email Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Mail className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="Email or Telegram"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Lock className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 pr-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#6b5a4a] hover:text-[#d4a86a] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-[#d4a86a] text-sm font-medium hover:text-[#f8f3ec] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#c2652a] hover:bg-[#d67a3d] disabled:opacity-70 text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-xl shadow-[#1d1c18]/40 mt-4"
              >
                {isLoading ? <Loader2 className="inline animate-spin" size={20} /> : 'Log In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-[#a08060] text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-[#d4a86a] font-bold hover:text-[#f8f3ec] transition-colors ml-1"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Sign Up Mode */}
        {mode === 'signup' && (
          <div className="w-full space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-serif italic font-medium text-[#d4a86a] mb-3">Let's Get Started.</h1>
              <p className="text-[#a08060] font-body text-base">Create an account to access all features</p>
            </div>

            <form onSubmit={handleSignUp} className="w-full space-y-6">
              {authError && (
                <p className="text-red-300 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2">{authError}</p>
              )}
              {/* Full Name Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <User className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Mail className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Lock className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 pr-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#6b5a4a] hover:text-[#d4a86a] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Check className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 pr-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-[#6b5a4a] hover:text-[#d4a86a] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#c2652a] hover:bg-[#d67a3d] disabled:opacity-70 text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-xl shadow-[#1d1c18]/40 mt-4"
              >
                {isLoading ? <Loader2 className="inline animate-spin" size={20} /> : 'Sign Up'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-[#a08060] text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-[#d4a86a] font-bold hover:text-[#f8f3ec] transition-colors ml-1"
                >
                  Login here.
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Reset Password Mode */}
        {mode === 'reset' && (
          <div className="w-full space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-serif italic font-medium text-[#d4a86a] mb-3">Reset Password</h1>
              <p className="text-[#a08060] font-body text-base">Enter your email and we will send a reset link.</p>
            </div>

            <form onSubmit={handleReset} className="w-full space-y-8">
              {authError && (
                <p className="text-red-300 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2">{authError}</p>
              )}
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300 focus-within:ring-1 focus-within:ring-[#d4a86a]/20">
                  <Mail className="absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a] transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="name@edenify.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-gradient-to-r from-[#964407] to-[#c2652a] hover:from-[#b65c21] hover:to-[#d67a3d] disabled:opacity-70 text-white font-bold tracking-wider text-sm uppercase shadow-xl shadow-black/20 active:scale-95 transition-all duration-300"
              >
                {isLoading ? <Loader2 className="inline animate-spin" size={20} /> : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                onClick={() => switchMode('login')}
                className="text-white/60 hover:text-white transition-colors font-medium text-sm underline underline-offset-4"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default Auth;
