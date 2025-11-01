import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar as CalendarIcon, Plus, LogOut, GitBranch } from "lucide-react";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import GroupDetail from "@/components/groups/GroupDetail";
import DevOpsDashboard from "@/components/DevOpsDashboard";

export default function Dashboard({ user, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("groups"); // 'groups' | 'devops'

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (name) => {
    try {
      const { data } = await api.post("/groups", { name });
      setGroups((s) => [...s, data]);
      toast.success("Group created successfully!");
      setShowCreateGroup(false);
    } catch {
      toast.error("Failed to create group");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="logo">
            <CalendarIcon className="logo-icon" />
            <span>TimeAlign</span>
          </div>

          <div className="nav-center">
            <button className={`nav-tab ${activeView === "groups" ? "active" : ""}`} onClick={() => setActiveView("groups")} data-testid="nav-groups-tab">
              <Users className="w-4 h-4" /> Groups
            </button>
            <button className={`nav-tab ${activeView === "devops" ? "active" : ""}`} onClick={() => setActiveView("devops")} data-testid="nav-devops-tab">
              <GitBranch className="w-4 h-4" /> DevOps
            </button>
          </div>

          <div className="nav-right">
            <div className="user-info"><span>{user.name}</span></div>
            <Button onClick={onLogout} variant="outline" size="sm" data-testid="logout-btn">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {activeView === "devops" ? (
          <DevOpsDashboard />
        ) : selectedGroup ? (
          <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} onUpdate={fetchGroups} />
        ) : (
          <div className="groups-container">
            <div className="groups-header">
              <h1>Your Study Groups</h1>
              <Button onClick={() => setShowCreateGroup(true)} data-testid="create-group-btn">
                <Plus className="w-4 h-4 mr-2" /> Create Group
              </Button>
            </div>

            {groups.length === 0 ? (
              <Card className="empty-state">
                <CardContent>
                  <Users className="empty-icon" />
                  <h3>No groups yet</h3>
                  <p>Create your first study group to get started</p>
                  <Button onClick={() => setShowCreateGroup(true)} data-testid="empty-create-group-btn">
                    Create Group
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="groups-grid">
                {groups.map((g) => (
                  <Card key={g.id} className="group-card" data-testid={`group-card-${g.id}`} onClick={() => setSelectedGroup(g)}>
                    <CardHeader>
                      <CardTitle>{g.name}</CardTitle>
                      <CardDescription>
                        {g.members.length} member{g.members.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="group-members">
                        {g.members.slice(0, 3).map((m) => (
                          <div key={m.id} className="member-avatar" title={m.name}>
                            {m.avatar_url ? <img src={m.avatar_url} alt={m.name} /> : m.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {g.members.length > 3 && <div className="member-avatar">+{g.members.length - 3}</div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreateGroupModal open={showCreateGroup} onClose={() => setShowCreateGroup(false)} onCreate={handleCreateGroup} />
    </div>
  );
}