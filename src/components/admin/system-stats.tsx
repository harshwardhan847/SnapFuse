'use client';

import { useQuery } from 'convex/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Zap, CreditCard, TrendingUp } from 'lucide-react';
import { api } from '../../../convex/_generated/api';

// Note: You would need to create these admin queries in convex/admin.ts
// This is just a placeholder to show the structure

export function SystemStats() {
    // These queries would need to be implemented in convex/admin.ts
    // const totalUsers = useQuery(api.admin.getTotalUsers);
    // const totalCreditsUsed = useQuery(api.admin.getTotalCreditsUsed);
    // const totalRevenue = useQuery(api.admin.getTotalRevenue);
    // const activeSubscriptions = useQuery(api.admin.getActiveSubscriptions);

    // Placeholder data for demonstration
    const stats = {
        totalUsers: 1250,
        totalCreditsUsed: 45680,
        totalRevenue: 12450,
        activeSubscriptions: 340,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        +12% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCreditsUsed.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        +8% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        +15% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">
                        +5% from last month
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}