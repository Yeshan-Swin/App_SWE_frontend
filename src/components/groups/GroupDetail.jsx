import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import CreateEventModal from "@/components/schedule/CreateEventModal";

export default function GroupDetail({ group: initialGroup, onBack, onUpdate }) {
  const [group, setGroup] = useState(initialGroup);
  const [activeTab, setActiveTab] = useState("schedule");
  const [inviteEmails, setInviteEmails] = useState("");
  const [dateRange, setDateRange] = useState({ from: new Date(), to: null });
  const [duration, setDuration] = useState(60);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchGroupDetails = async () => {
    try {
      const { data } = await api.get(`/groups/${group.id}`);
      setGroup(data);
    } catch {
      toast.error("Failed to load group details");
    }
  };

  const handleInvite = async () => {
    const emails = inviteEmails.split(",").map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return;

    try {
      await api.post(`/groups/${group.id}/invite`, { emails });
      toast.success("Invitations sent!");
      setInviteEmails("");
      fetchGroupDetails();
      onUpdate?.();
    } catch {
      toast.error("Failed to send invitations");
    }
  };

  const handleFindTimes = async () => {
    if (!dateRange.to) {
      toast.error("Please select an end date");
      return;
    }
    setLoadingSuggestions(true);
    try {
      const { data } = await api.post("/schedule/suggest", {
        group_id: group.id,
        range_start: dateRange.from.toISOString(),
        range_end: dateRange.to.toISOString(),
        duration_mins: duration,
        granularity_mins: 15,
        min_coverage: 0.7,
      });
      setSuggestions(data);
      if (data.length === 0) toast.info("No available time slots found. Try a different range or lower duration.");
    } catch {
      toast.error("Failed to find available times");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await api.post("/schedule/create", {
        group_id: group.id,
        start: selectedSlot.start,
        end: selectedSlot.end,
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
      });
      toast.success("Event created successfully!");
      setShowEventModal(false);
      setSelectedSlot(null);
    } catch {
      toast.error("Failed to create event");
    }
  };

  const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    });

  return (
    <div className="group-detail">
      <div className="group-header">
        <Button onClick={onBack} variant="outline" data-testid="back-to-groups-btn">← Back to Groups</Button>
        <h1>{group.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="group-tabs">
        <TabsList>
          <TabsTrigger value="schedule" data-testid="schedule-tab">Schedule</TabsTrigger>
          <TabsTrigger value="members" data-testid="members-tab">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="schedule-tab">
          <div className="schedule-content">
            <Card className="schedule-config">
              <CardHeader>
                <CardTitle>Find Available Times</CardTitle>
                <CardDescription>Select a date range and duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Date Range</Label>
                  <Calendar mode="range" selected={dateRange} onSelect={setDateRange} className="calendar-picker" numberOfMonths={2} />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} min="15" step="15" data-testid="duration-input" />
                </div>

                <Button onClick={handleFindTimes} className="w-full" disabled={loadingSuggestions || !dateRange.to} data-testid="find-times-btn">
                  {loadingSuggestions ? "Finding times..." : "Find Available Times"}
                </Button>
              </CardContent>
            </Card>

            <div className="suggestions-list">
              <h3>Suggested Time Slots</h3>
              {suggestions.length === 0 ? (
                <Card className="empty-suggestions">
                  <CardContent>
                    <Clock className="empty-icon" />
                    <p>No suggestions yet. Configure and search for available times.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="suggestions-grid">
                  {suggestions.map((slot, idx) => (
                    <Card key={idx} className="suggestion-card" data-testid={`suggestion-${idx}`}>
                      <CardHeader>
                        <div className="suggestion-header">
                          <CardTitle>{formatDateTime(slot.start)}</CardTitle>
                          <Badge variant={slot.coverage_ratio >= 0.9 ? "default" : "secondary"}>
                            {Math.round(slot.coverage_ratio * 100)}% available
                          </Badge>
                        </div>
                        <CardDescription>
                          Duration: {duration} minutes • {slot.available_members}/{slot.total_members} members
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full"
                          onClick={() => { setSelectedSlot(slot); setShowEventModal(true); }}
                          data-testid={`create-event-btn-${idx}`}
                        >
                          Create Event
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="members-tab">
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>
                {group.members.length} member{group.members.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="members-list">
                {group.members.map((m) => (
                  <div key={m.id} className="member-item" data-testid={`member-${m.id}`}>
                    <div className="member-avatar-large">
                      {m.avatar_url ? <img src={m.avatar_url} alt={m.name} /> : m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">{m.name}</div>
                      <div className="member-email">{m.email}</div>
                    </div>
                    {m.id === group.owner_id && <Badge>Owner</Badge>}
                  </div>
                ))}
              </div>

              <div className="invite-section">
                <Label htmlFor="invite-emails">Invite Members</Label>
                <div className="invite-input-group">
                  <Input id="invite-emails" value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} placeholder="email1@example.com, email2@example.com" data-testid="invite-emails-input" />
                  <Button onClick={handleInvite} data-testid="send-invites-btn">Send Invites</Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Separate multiple emails with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateEventModal
        open={showEventModal}
        onClose={() => { setShowEventModal(false); setSelectedSlot(null); }}
        onSubmit={handleCreateEvent}
        slot={selectedSlot}
      />
    </div>
  );
}