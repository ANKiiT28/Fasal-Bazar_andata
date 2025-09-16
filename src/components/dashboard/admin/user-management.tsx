
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { updateUser } from "@/lib/user-store";

const initialUsers = [
    { id: 1, name: "Ramesh Kumar", role: "Farmer", status: "Active", joined: "2023-01-15", avatar: "https://picsum.photos/seed/ramesh/100" },
    { id: 2, name: "Anjali Singh", role: "Buyer", status: "Active", joined: "2023-03-22", avatar: "https://picsum.photos/seed/anjali/100" },
    { id: 3, name: "Suresh Patil", role: "Delivery", status: "Inactive", joined: "2023-05-10", avatar: "https://picsum.photos/seed/suresh/100" },
    { id: 4, name: "Priya Sharma", role: "Buyer", status: "Active", joined: "2023-02-11", avatar: "https://picsum.photos/seed/priya/100" },
];

export function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const { toast } = useToast();

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
        setUsers(storedUsers);
    };

    useEffect(() => {
        loadUsers();
        window.addEventListener('storage', loadUsers);
        return () => window.removeEventListener('storage', loadUsers);
    }, []);

    const handleSuspendUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
            updateUser(userId, { status: newStatus });
            loadUsers();
            toast({ title: "User Status Updated" });
        }
    };

    const handleDeleteUser = (userId: string) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        loadUsers();
        toast({ title: "User Deleted", variant: "destructive" });
    };

    const handleToggleTrusted = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user && user.role === 'farmer') {
            const isTrusted = !user.isTrusted;
            updateUser(userId, { isTrusted });
            loadUsers();
            toast({ title: isTrusted ? 'Farmer marked as trusted' : 'Farmer trust badge removed' });
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View, manage, and verify platform users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {user.isTrusted && <ShieldCheck className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "outline"}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/profile?user=${user.name}&role=${user.role.toLowerCase()}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                {user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                            </DropdownMenuItem>
                             {user.role === 'farmer' && (
                                <DropdownMenuItem onClick={() => handleToggleTrusted(user.id)}>
                                    {user.isTrusted ? 'Remove Trust Badge' : 'Mark as Trusted'}
                                </DropdownMenuItem>
                             )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
