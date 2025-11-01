import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateEventModal({ open, onClose, onSubmit, slot }) {
  const [eventData, setEventData] = useState({ title: "", description: "", location: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
    setEventData({ title: "", description: "", location: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Study Session</DialogTitle>
          <DialogDescription>{slot && new Date(slot.start).toLocaleString()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" value={eventData.title} onChange={(e) => setEventData((s) => ({ ...s, title: e.target.value }))} placeholder="Study Session" required data-testid="event-title-input" />
          </div>
          <div>
            <Label htmlFor="event-description">Description (optional)</Label>
            <Input id="event-description" value={eventData.description} onChange={(e) => setEventData((s) => ({ ...s, description: e.target.value }))} placeholder="What are you studying?" data-testid="event-description-input" />
          </div>
          <div>
            <Label htmlFor="event-location">Location (optional)</Label>
            <Input id="event-location" value={eventData.location} onChange={(e) => setEventData((s) => ({ ...s, location: e.target.value }))} placeholder="Library, Room 101" data-testid="event-location-input" />
          </div>
          <Button type="submit" className="w-full" data-testid="create-event-submit-btn">Create Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}