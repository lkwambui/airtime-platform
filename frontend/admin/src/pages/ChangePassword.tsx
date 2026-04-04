import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";

export default function ChangePassword() {
  return (
    <div className="app-section">
      <PageHeader
        eyebrow="Account"
        title="Change Password"
        description="Update your administrator credentials regularly to keep access secure."
      />

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input type="password" label="Current Password" />
          <Input type="password" label="New Password" />
        </div>
        <Button className="mt-6">Update Password</Button>
      </Card>
    </div>
  );
}
