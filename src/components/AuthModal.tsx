import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { FcGoogle } from "react-icons/fc";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auth = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await auth.signUpWithEmail(form.email, form.password);
      } else {
        await auth.signInWithEmail(form.email, form.password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      await auth.signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-xl font-bold text-center text-orange-600 mb-4">
                  {isSignUp ? "Create Your RewMo Account" : "Welcome Back"}
                </Dialog.Title>

                <div className="space-y-4">
                  <button
                    onClick={handleGoogleAuth}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium py-2 rounded-md transition"
                  >
                    <FcGoogle size={20} />
                    Continue with Google
                  </button>

                  <div className="relative my-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    — or use email —
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button
                    onClick={handleEmailAuth}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition"
                  >
                    {loading ? "Processing..." : isSignUp ? "Sign Up with Email" : "Sign In with Email"}
                  </button>

                  <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
