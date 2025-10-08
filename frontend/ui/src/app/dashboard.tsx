import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">App Status</CardTitle>
          <span className="h-4 w-4 text-muted-foreground">✅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Operational</div>
          <p className="text-xs text-muted-foreground">
            All systems are functioning normally.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Wipe</CardTitle>
          <span className="h-4 w-4 text-muted-foreground">🗓️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2 days ago</div>
          <p className="text-xs text-muted-foreground">
            Certificate ID: #WC123456
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          <span className="h-4 w-4 text-muted-foreground">⚠️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">
            Review new security update
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Activity</CardTitle>
          <span className="h-4 w-4 text-muted-foreground">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 active sessions</div>
          <p className="text-xs text-muted-foreground">
            Last login: 10 minutes ago
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
