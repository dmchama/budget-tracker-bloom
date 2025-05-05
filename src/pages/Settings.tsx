
import Navbar from "@/components/Navbar";

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-card-foreground">Application settings will be available here in future updates.</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
