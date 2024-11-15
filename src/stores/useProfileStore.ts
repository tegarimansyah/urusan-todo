import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'

interface Role {
  id: string;
  name: string;
  color: string;
  archived: boolean;
  createdAt: string;
  archivedAt?: string;
}

interface Profile {
  bio: string;
  roles: Role[];
}

interface ProfileStore {
  profile: Profile;
  updateBio: (bio: string) => void;
  addRole: (name: string) => void;
  archiveRole: (id: string) => void;
  deleteRole: (id: string) => void;
  restoreRole: (id: string) => void;
  checkNoRoles: () => boolean;
}

const COLORS = [
  'bg-red-100 hover:bg-red-200 text-red-800',
  'bg-blue-100 hover:bg-blue-200 text-blue-800',
  'bg-green-100 hover:bg-green-200 text-green-800',
  'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
  'bg-purple-100 hover:bg-purple-200 text-purple-800',
  'bg-pink-100 hover:bg-pink-200 text-pink-800',
  'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
  'bg-orange-100 hover:bg-orange-200 text-orange-800',
];

const getRandomColor = (): string => 
  COLORS[Math.floor(Math.random() * COLORS.length)];

const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: {
        bio: '',
        roles: []
      },
      updateBio: (bio: string) => {
        set((state) => ({ profile: { ...state.profile, bio } }));
        toast.success('Bio updated successfully');
      },
      addRole: (name: string) => {
        const newRole: Role = {
          id: crypto.randomUUID(),
          name,
          color: getRandomColor(),
          archived: false,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          profile: {
            ...state.profile,
            roles: [newRole, ...state.profile.roles]
          }
        }));
        toast.success('Role added successfully');
      },
      archiveRole: (id: string) => {
        set((state) => ({
          profile: {
            ...state.profile,
            roles: state.profile.roles.map((role) =>
              role.id === id
                ? {
                    ...role,
                    archived: true,
                    archivedAt: new Date().toISOString(),
                  }
                : role
            )
          }
        }));
        toast.success('Role archived successfully');
      },
      deleteRole: (id: string) => {
        set((state) => ({
          profile: {
            ...state.profile,
            roles: state.profile.roles.filter((role) => role.id !== id)
          }
        }));
        toast.success('Role deleted successfully');
      },
      restoreRole: (id: string) => {
        set((state) => ({
          profile: {
            ...state.profile,
            roles: state.profile.roles.map((role) =>
              role.id === id
                ? {
                    ...role,
                    archived: false,
                    archivedAt: undefined,
                  }
                : role
            )
          }
        }));
        toast.success('Role restored successfully');
      },
      checkNoRoles: () => {
        return get().profile.roles.length === 0;
      }
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useProfileStore 