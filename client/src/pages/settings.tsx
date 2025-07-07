import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Settings" subtitle="Configure your application settings" />
      
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="SupportHub Inc." className="mt-2" />
              </div>
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@supporthub.com" className="mt-2" />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Auto-assign tickets</h4>
                <p className="text-sm text-muted-foreground">Automatically assign new tickets to available agents</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email notifications</h4>
                <p className="text-sm text-muted-foreground">Send email notifications for ticket updates</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Two-factor authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Login alerts</h4>
                <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-end">
              <Button>Update Security</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
