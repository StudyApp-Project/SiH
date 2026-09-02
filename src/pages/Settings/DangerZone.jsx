import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../../components/ui/Button';
import { LogOut, AlertTriangle } from 'lucide-react';

export default function DangerZone() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your account? This action cannot be undone.")) {
      alert("Account reset functionality is simulated.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
          <AlertTriangle size={24} />
          Danger Zone
        </h2>
        <p className="text-sm text-(--text-secondary) mt-1">
          Irreversible and destructive actions. Proceed with caution.
        </p>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-(--text-primary)">Log out of all devices</h3>
            <p className="text-xs text-(--text-muted) mt-1">
              You will be returned to the login screen.
            </p>
          </div>
          <Button variant="outline" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-500/20 shrink-0" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </div>

        <div className="h-px bg-red-500/10 w-full" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-(--text-primary)">Reset Account Data</h3>
            <p className="text-xs text-(--text-muted) mt-1 max-w-md">
              Permanently delete all your study rooms, notes, flashcards, and progress. This action cannot be undone.
            </p>
          </div>
          <Button variant="danger" className="shrink-0" onClick={handleReset}>
            Reset Account
          </Button>
        </div>
      </div>
    </div>
  );
}
