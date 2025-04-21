import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      signUp: async (email, password, name, phone) => {
        try {
          set({ loading: true, error: null });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: name });
          set({ 
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: name,
              phoneNumber: phone
            },
            loading: false 
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          set({ 
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              phoneNumber: userCredential.user.phoneNumber
            },
            loading: false 
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          
          set({ 
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              phoneNumber: result.user.phoneNumber
            },
            loading: false,
            error: null
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      setUser: (user) => {
        if (user) {
          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber
            }
          });
        } else {
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;