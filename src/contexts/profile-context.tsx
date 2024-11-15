import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface ProfileContextType {
  profile: Profile;
  updateBio: (bio: string) => Promise<void>;
  addRole: (name: string) => Promise<void>;
  archiveRole: (id: string) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  restoreRole: (id: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

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

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const defaultProfile: Profile = {
  bio: '',
  roles: [],
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async (newProfile: Profile) => {
    try {
      localStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const updateBio = async (bio: string) => {
    try {
      await saveProfile({ ...profile, bio });
      toast({
        title: 'Success',
        description: 'Bio updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bio',
        variant: 'destructive',
      });
    }
  };

  const addRole = async (name: string) => {
    try {
      const newRole: Role = {
        id: crypto.randomUUID(),
        name,
        color: getRandomColor(),
        archived: false,
        createdAt: new Date().toISOString(),
      };

      const newProfile = {
        ...profile,
        roles: [newRole, ...profile.roles],
      };

      await saveProfile(newProfile);
      toast({
        title: 'Success',
        description: 'Role added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add role',
        variant: 'destructive',
      });
    }
  };

  const archiveRole = async (id: string) => {
    try {
      const newRoles = profile.roles.map((role) =>
        role.id === id
          ? {
              ...role,
              archived: true,
              archivedAt: new Date().toISOString(),
            }
          : role
      );

      await saveProfile({ ...profile, roles: newRoles });
      toast({
        title: 'Success',
        description: 'Role archived successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive role',
        variant: 'destructive',
      });
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const newRoles = profile.roles.filter((role) => role.id !== id);
      await saveProfile({ ...profile, roles: newRoles });
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive',
      });
    }
  };

  const restoreRole = async (id: string) => {
    try {
      const newRoles = profile.roles.map((role) =>
        role.id === id
          ? {
              ...role,
              archived: false,
              archivedAt: undefined,
            }
          : role
      );

      await saveProfile({ ...profile, roles: newRoles });
      toast({
        title: 'Success',
        description: 'Role restored successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore role',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateBio,
        addRole,
        archiveRole,
        deleteRole,
        restoreRole,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}