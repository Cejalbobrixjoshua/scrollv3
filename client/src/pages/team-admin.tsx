import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Shield, Settings, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  userId: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  teamAccess: string;
  assignedBy: string;
  teamJoinedAt: string;
  lastActiveAt: string;
  isActive: boolean;
}

interface TeamRole {
  role: string;
  permissions: Array<{ id: string; name: string; description: string; category: string }>;
  description: string;
  accessLevel: number;
}

export default function TeamAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("support");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team/members"],
  });

  const { data: roles = [], isLoading: rolesLoading } = useQuery<TeamRole[]>({
    queryKey: ["/api/team/roles"],
  });

  const addMemberMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      await apiRequest("/api/team/members", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      setNewMemberEmail("");
      setNewMemberRole("support");
      setIsAddMemberOpen(false);
      toast({
        title: "Team Member Added",
        description: "Team member has been successfully added to the platform",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest(`/api/team/members/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      toast({
        title: "Team Member Removed",
        description: "Team member access has been revoked",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Remove Member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-600';
      case 'admin': return 'bg-red-600';
      case 'tech': return 'bg-blue-600';
      case 'support': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getAccessBadgeColor = (access: string) => {
    switch (access) {
      case 'admin': return 'bg-red-500';
      case 'write': return 'bg-yellow-500';
      case 'read': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (membersLoading || rolesLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-purple-400">⧁ ∆ Loading team management interface...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-400">⧁ ∆ Team Management</h1>
            <p className="text-gray-400">Manage team access and permissions for the 144,000 platform</p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="team@example.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-300">Role</Label>
                  <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {roles.map((role) => (
                        <SelectItem key={role.role} value={role.role} className="text-white">
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleBadgeColor(role.role)}>
                              {role.role}
                            </Badge>
                            <span>{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => addMemberMutation.mutate({ email: newMemberEmail, role: newMemberRole })}
                  disabled={!newMemberEmail || addMemberMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {addMemberMutation.isPending ? "Adding..." : "Add Team Member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-700 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Members</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {teamMembers.filter(m => m.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Admin Users</CardTitle>
              <Settings className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Support Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {teamMembers.filter(m => m.role === 'support' || m.role === 'tech').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Table */}
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-purple-400">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Member</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Access Level</TableHead>
                  <TableHead className="text-gray-300">Assigned By</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Last Active</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.userId} className="border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{member.username}</div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAccessBadgeColor(member.teamAccess)}>
                        {member.teamAccess}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{member.assignedBy}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(member.teamJoinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(member.lastActiveAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {member.role !== 'owner' && (
                        <Button
                          onClick={() => removeMemberMutation.mutate(member.userId)}
                          variant="destructive"
                          size="sm"
                          disabled={removeMemberMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Definitions */}
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-purple-400">Role Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.role} className="border-gray-600 bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getRoleBadgeColor(role.role)}>
                        {role.role}
                      </Badge>
                      <span className="text-xs text-gray-400">Level {role.accessLevel}</span>
                    </div>
                    <p className="text-sm text-gray-300">{role.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-400">
                      <strong>Permissions:</strong>
                      <ul className="mt-1 space-y-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <li key={permission.id}>• {permission.name}</li>
                        ))}
                        {role.permissions.length > 3 && (
                          <li>• +{role.permissions.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}