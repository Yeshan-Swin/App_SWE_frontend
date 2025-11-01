import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AuthModal({ open, onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
    try {
      const { data } = await api.post(endpoint, formData);
      onLogin(data.access_token, data.user);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="auth-modal">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Welcome Back" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {mode === "login" ? "Sign in to access your study groups" : "Get started with TimeAlign"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="form-group">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} required />
            </div>
          )}
          <div className="form-group">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData((s) => ({ ...s, password: e.target.value }))} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))} className="auth-switch-link">
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}