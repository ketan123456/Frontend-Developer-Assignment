import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { patients } from '../data/patients';
import { auth, getFirebaseErrorMessage, isFirebaseConfigured, mapFirebaseUser } from '../lib/firebase';
import { getBrowserNotificationPermission } from '../lib/notifications';
import type {
  AuthMode,
  AuthStatus,
  AuthUser,
  BrowserNotificationPermission,
  NotificationRecord,
  PatientView,
} from '../types';

const demoCredentials = {
  email: 'demo@careaxis.health',
  password: 'Health123!',
};

const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

interface AppState {
  authMode: AuthMode;
  authStatus: AuthStatus;
  user: AuthUser | null;
  loginError: string | null;
  patientView: PatientView;
  activePatientId: string;
  notifications: NotificationRecord[];
  notificationPermission: BrowserNotificationPermission;
  bootstrapSession: () => VoidFunction | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLoginError: () => void;
  setPatientView: (view: PatientView) => void;
  setActivePatientId: (patientId: string) => void;
  addNotificationRecord: (record: NotificationRecord) => void;
  setNotificationPermission: (permission: BrowserNotificationPermission) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      authMode: isFirebaseConfigured ? 'firebase' : 'demo',
      authStatus: 'idle',
      user: null,
      loginError: null,
      patientView: 'grid',
      activePatientId: patients[0]?.id ?? '',
      notifications: [],
      notificationPermission: getBrowserNotificationPermission(),
      bootstrapSession: () => {
        set({
          authStatus: 'loading',
          authMode: isFirebaseConfigured ? 'firebase' : 'demo',
          notificationPermission: getBrowserNotificationPermission(),
        });

        if (isFirebaseConfigured && auth) {
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            set({
              user: firebaseUser ? mapFirebaseUser(firebaseUser) : null,
              authStatus: firebaseUser ? 'authenticated' : 'unauthenticated',
              authMode: 'firebase',
              loginError: null,
            });
          });

          return unsubscribe;
        }

        const persistedUser = get().user;

        set({
          authMode: 'demo',
          authStatus: persistedUser ? 'authenticated' : 'unauthenticated',
          user: persistedUser,
        });

        return undefined;
      },
      login: async (email, password) => {
        set({ authStatus: 'loading', loginError: null });

        if (isFirebaseConfigured && auth) {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (error) {
            set({
              authStatus: 'unauthenticated',
              loginError: getFirebaseErrorMessage(error),
              user: null,
            });
            throw error;
          }

          return;
        }

        await wait(700);

        if (
          email.trim().toLowerCase() === demoCredentials.email &&
          password === demoCredentials.password
        ) {
          set({
            authMode: 'demo',
            authStatus: 'authenticated',
            loginError: null,
            user: {
              uid: 'demo-user-1',
              name: 'ketan kritesh',
              email: demoCredentials.email,
              role: 'Operations Lead',
              mode: 'demo',
            },
          });
          return;
        }

        set({
          authMode: 'demo',
          authStatus: 'unauthenticated',
          loginError:
            'Demo mode is active. Use demo@careaxis.health / Health123! or configure Firebase env values.',
          user: null,
        });
      },
      logout: async () => {
        if (isFirebaseConfigured && auth) {
          await signOut(auth);
          return;
        }

        set({
          authMode: 'demo',
          authStatus: 'unauthenticated',
          user: null,
          loginError: null,
        });
      },
      clearLoginError: () => {
        set({ loginError: null });
      },
      setPatientView: (patientView) => {
        set({ patientView });
      },
      setActivePatientId: (activePatientId) => {
        set({ activePatientId });
      },
      addNotificationRecord: (record) => {
        set((state) => ({
          notifications: [record, ...state.notifications].slice(0, 6),
        }));
      },
      setNotificationPermission: (notificationPermission) => {
        set({ notificationPermission });
      },
    }),
    {
      name: 'careaxis-store',
      partialize: (state) => ({
        authMode: state.authMode,
        user: state.authMode === 'demo' ? state.user : null,
        patientView: state.patientView,
        activePatientId: state.activePatientId,
        notifications: state.notifications,
      }),
    },
  ),
);
