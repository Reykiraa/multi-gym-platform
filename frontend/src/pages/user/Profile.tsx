import { Link } from 'react-router-dom';
import { Settings, Bell, Shield, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

const Profile: React.FC = () => {
  const { user: rawUser } = useAuthStore();
  const user = rawUser as User | null;

  const menuItems = [
    { icon: <Settings size={20} />, label: "Edit Profile", path: "/user/profile/edit" },
    { icon: <Bell size={20} />, label: "Notifications", path: "/user/profile/notifications" },
    { icon: <Shield size={20} />, label: "Security", path: "/user/profile/security" },
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow container mx-auto max-w-xl px-4 py-6">
        {/* Header Profile */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-500 to-amber-700 rounded-full mb-4 shadow-xl border-4 border-zinc-900 flex items-center justify-center text-3xl font-bold text-white uppercase">
            {user?.name ? user.name.charAt(0) : '?'}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
          <p className="text-zinc-400 text-sm mb-3">{user?.email}</p>
          <Badge variant="warning" className="px-4 py-1 font-bold tracking-wider">
            {(user?.tier ?? 'MEMBER').toUpperCase()}
          </Badge>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="text-center p-4">
            <h3 className="text-zinc-400 text-sm mb-1">Total Visits</h3>
            <p className="text-2xl font-bold text-white">{user?.total_visits ?? 0}</p>
          </Card>
          <Card className="text-center p-4">
            <h3 className="text-zinc-400 text-sm mb-1">Member Since</h3>
            <p className="text-2xl font-bold text-white">{user?.member_since ?? '-'}</p>
          </Card>
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-3 mb-8">
          <h2 className="text-lg font-bold text-white mb-2 px-2">My Account</h2>
          {menuItems.map((item, idx) => (
            <Link key={idx} to={item.path}>
              <Card noPadding className="hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors">
                    <div className="text-zinc-500 group-hover:text-yellow-500 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Profile;
