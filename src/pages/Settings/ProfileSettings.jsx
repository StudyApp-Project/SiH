import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../../components/ui/Button';

export default function ProfileSettings() {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-(--text-primary)">Profile Information</h2>
        <p className="text-sm text-(--text-secondary) mt-1">
          Update your account details and public profile.
        </p>
      </div>

      <div className="bg-(--bg-glass) backdrop-blur-md rounded-2xl border border-(--border-default) p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_var(--accent-hue))] shadow-(--shadow-glow) flex items-center justify-center text-white text-2xl font-bold">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <Button type="button" variant="outline" size="sm">Change Avatar</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-(--text-primary)">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-(--border-strong) bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-[color:oklch(0.58_0.22_var(--accent-hue))] transition-all duration-200"
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-(--text-primary)">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-(--border-strong) bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-[color:oklch(0.58_0.22_var(--accent-hue))] transition-all duration-200"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium text-(--text-primary)">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-(--border-strong) bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-[color:oklch(0.58_0.22_var(--accent-hue))] transition-all duration-200 resize-none"
                placeholder="Tell us a little about yourself"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-(--border-default)">
            <p className="text-sm text-green-500 font-medium opacity-0 transition-opacity data-[show=true]:opacity-100" data-show={saved}>
              Changes saved successfully!
            </p>
            <Button type="submit" disabled={isSaving || saved}>
              {isSaving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
