import { Header } from '@/components/header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/profile-context';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Profile() {
  const { profile, updateBio, addRole, archiveRole, deleteRole, restoreRole } = useProfile();
  const [bio, setBio] = useState(profile.bio);
  const [newRole, setNewRole] = useState('');
  const userInitials = 'U'; // In a real app, this would come from user data

  const activeRoles = profile.roles.filter((role) => !role.archived);
  const archivedRoles = profile.roles.filter((role) => role.archived);

  const handleBioSave = () => {
    updateBio(bio);
  };

  const handleRoleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newRole.trim()) {
      addRole(newRole.trim());
      setNewRole('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary/10">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Your Profile</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Tell me about yourself</Label>
                  <Textarea
                    id="bio"
                    placeholder="Share your story - who you are, what drives you, and where you're headed..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Tell a story about who you are now, what you want to achieve, and what you want to do.
                  </p>
                </div>
                <Button onClick={handleBioSave}>Save Bio</Button>
              </div>

              <div className="grid w-full gap-4 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="roles">Your Current Roles</Label>
                  <Input
                    id="roles"
                    placeholder="Add a role (e.g., 'Software Engineer @ Company')"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={handleRoleSubmit}
                  />
                  <p className="text-sm text-muted-foreground">
                    Press enter to add a new role
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeRoles.map((role) => (
                    <DropdownMenu key={role.id}>
                      <DropdownMenuTrigger>
                        <Badge
                          variant="outline"
                          className={cn(
                            'cursor-pointer transition-colors',
                            role.color
                          )}
                        >
                          {role.name}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => archiveRole(role.id)}
                          className="text-yellow-600"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>

                {archivedRoles.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h3 className="font-medium">Archived Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {archivedRoles.map((role) => (
                          <DropdownMenu key={role.id}>
                            <DropdownMenuTrigger>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'cursor-pointer opacity-60 hover:opacity-100 transition-opacity',
                                  role.color
                                )}
                              >
                                {role.name}
                              </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => restoreRole(role.id)}
                                className="text-green-600"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteRole(role.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}