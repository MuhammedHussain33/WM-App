import React, { useEffect, useState } from 'react';
import AdminPickupAssign from './AdminPickupAssign';
import AdminReports from './AdminReports';
// import AdminProfile from './AdminProfile';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('assign');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userData =
      JSON.parse(localStorage.getItem('ecoWasteUsers')) ||
      JSON.parse(localStorage.getItem('blog-usersDB')) ||
      [];
    setUsers(userData);
  }, []);

  const toggleStatus = (userId) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const newStatus = u.status === 'Suspended' ? 'Active' : 'Suspended';
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('ecoWasteUsers', JSON.stringify(updatedUsers));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'assign':
        return <AdminPickupAssign />;
      case 'reports':
        return <AdminReports />;
      case 'users':
        return (
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-green-700">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border-l-4 border-green-500"
                >
                  <img
                    src={user.imageUrl || 'https://i.pravatar.cc/100?u=' + user.email}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-lg font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <p className="text-sm">
                      <span className="font-medium">Role:</span> {user.role || 'Resident'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{' '}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          user.status === 'Suspended'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-700'
                        }`}
                        onClick={() => toggleStatus(user.id)}
                        title="Click to toggle status"
                      >
                        {user.status || 'Active'}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return <AdminProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-lg px-6 py-8">
        <h2 className="text-2xl font-bold mb-8 text-green-600">Admin Panel</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('assign')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'assign' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Assign Pickups
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'reports' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'profile' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">{renderTab()}</div>
    </div>
  );
};

export default AdminUsers;
