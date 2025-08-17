"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Key, Copy, Eye, EyeOff, Plus, Trash2, BarChart3, Globe } from "lucide-react";

export function ApiSettings() {
    const [showApiKey, setShowApiKey] = React.useState(false);
    const [apiKeys, setApiKeys] = React.useState([
        {
            id: "1",
            name: "Production API Key",
            key: "sk_live_1234567890abcdef",
            created: "2024-01-15",
            lastUsed: "2024-01-20",
            requests: 1250,
            active: true,
        },
        {
            id: "2",
            name: "Development API Key",
            key: "sk_test_abcdef1234567890",
            created: "2024-01-10",
            lastUsed: "2024-01-19",
            requests: 450,
            active: true,
        },
    ]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("API key copied to clipboard!");
    };

    const generateNewKey = () => {
        const newKey = {
            id: Date.now().toString(),
            name: "New API Key",
            key: `sk_live_${Math.random().toString(36).substring(2, 18)}`,
            created: new Date().toISOString().split('T')[0],
            lastUsed: "Never",
            requests: 0,
            active: true,
        };
        setApiKeys([...apiKeys, newKey]);
        toast.success("New API key generated successfully!");
    };

    const revokeKey = (keyId: string) => {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast.success("API key revoked successfully!");
    };

    const toggleKeyStatus = (keyId: string) => {
        setApiKeys(apiKeys.map(key =>
            key.id === keyId ? { ...key, active: !key.active } : key
        ));
        toast.success("API key status updated!");
    };

    return (
        <div className="space-y-6">
            {/* API Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Access
                    </CardTitle>
                    <CardDescription>
                        Manage your API keys and integration settings for SnapFuse.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">2</div>
                            <div className="text-sm text-muted-foreground">Active Keys</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">1,700</div>
                            <div className="text-sm text-muted-foreground">Total Requests</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">99.9%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Keys Management */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>
                                Create and manage API keys for accessing SnapFuse programmatically.
                            </CardDescription>
                        </div>
                        <Button onClick={generateNewKey}>
                            <Plus className="h-4 w-4 mr-2" />
                            Generate New Key
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {apiKeys.map((apiKey) => (
                            <div key={apiKey.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">{apiKey.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={apiKey.active ? "default" : "secondary"}>
                                            {apiKey.active ? "Active" : "Inactive"}
                                        </Badge>
                                        <Switch
                                            checked={apiKey.active}
                                            onCheckedChange={() => toggleKeyStatus(apiKey.id)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={showApiKey ? apiKey.key : "sk_" + "•".repeat(apiKey.key.length - 3)}
                                            readOnly
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(apiKey.key)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => revokeKey(apiKey.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{apiKey.requests} requests made</span>
                                    <Button variant="ghost" size="sm">
                                        <BarChart3 className="h-4 w-4 mr-1" />
                                        View Usage
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* API Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>
                        Configure global settings for your API access.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                            <Input id="rate-limit" value="100" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                            <Input id="timeout" value="30" readOnly />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">Enable Webhooks</h4>
                                <p className="text-sm text-muted-foreground">
                                    Receive real-time notifications about generation status.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">API Logging</h4>
                                <p className="text-sm text-muted-foreground">
                                    Log API requests for debugging and monitoring.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">CORS Origins</h4>
                                <p className="text-sm text-muted-foreground">
                                    Allow cross-origin requests from specified domains.
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Configure
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Webhook Endpoints
                    </CardTitle>
                    <CardDescription>
                        Configure webhook URLs to receive real-time updates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                placeholder="https://your-app.com/webhooks/snapfuse"
                                className="flex-1"
                            />
                            <Button variant="outline">Test</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Events to Subscribe</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "generation.completed",
                                "generation.failed",
                                "credits.low",
                                "subscription.updated",
                            ].map((event) => (
                                <div key={event} className="flex items-center space-x-2">
                                    <input type="checkbox" id={event} defaultChecked />
                                    <label htmlFor={event} className="text-sm font-mono">
                                        {event}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button>Save Webhook Configuration</Button>
                </CardContent>
            </Card>

            {/* API Documentation */}
            <Card>
                <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                        Learn how to integrate SnapFuse into your applications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                            <h4 className="font-medium">Getting Started</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Quick start guide and authentication
                            </p>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                            <h4 className="font-medium">API Reference</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Complete API endpoints documentation
                            </p>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                            <h4 className="font-medium">SDKs & Libraries</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Official SDKs for popular languages
                            </p>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                            <h4 className="font-medium">Code Examples</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Sample code and integration examples
                            </p>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}