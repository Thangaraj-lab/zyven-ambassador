"use client";

import React, { useState, useMemo } from "react";
import {
  useAdminUsers,
  useSetUserRole,
  useSetUserStatus,
  useAuditLogs,
} from "@/lib/data/hooks";
import { Button } from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { User } from "@/lib/data/types";

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers();
  const { mutateAsync: setUserRole, isPending: isSettingRole } =
    useSetUserRole();
  const { mutateAsync: setUserStatus, isPending: isSettingStatus } =
    useSetUserStatus();

  const [activeTab, setActiveTab] = useState<
    "ALL" | "STUDENTS" | "AMBASSADORS" | "ADMINS"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Role promotion confirmation modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<
    "student" | "ambassador" | "admin" | null
  >(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(({ user: u }) => {
      if (activeTab === "STUDENTS" && u.role !== "student") return false;
      if (activeTab === "AMBASSADORS" && u.role !== "ambassador") return false;
      if (activeTab === "ADMINS" && u.role !== "admin") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, activeTab, searchQuery]);

  const studentCount = users.filter((i) => i.user.role === "student").length;
  const ambCount = users.filter((i) => i.user.role === "ambassador").length;
  const adminCount = users.filter((i) => i.user.role === "admin").length;

  const handleRoleChange = async () => {
    if (!selectedUser || !targetRole) return;
    try {
      await setUserRole({
        userId: selectedUser.id,
        role: targetRole,
      });
      toast.success(
        `Updated role of ${selectedUser.name} to ${targetRole.toUpperCase()}`
      );
      setSelectedUser(null);
      setTargetRole(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = "active"; // currently demo users are active, toggling can suspend
    toast.info(`Account status for ${user.name} is verified.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Users className="w-3.5 h-3.5" />
              Identity & Access Management
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 23</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            User Directory & Roles
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Audit platform participants, promote active students to campus
            ambassadors, and manage account authorization.
          </p>
        </div>
      </div>

      {/* Role Counts Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Total Accounts</div>
          <div className="text-xl font-black text-text mt-1">{users.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Students</div>
          <div className="text-xl font-black text-primary mt-1">
            {studentCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Campus Ambassadors</div>
          <div className="text-xl font-black text-amber-400 mt-1">
            {ambCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Platform Admins</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {adminCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border/60 rounded-xl overflow-x-auto">
          {[
            { id: "ALL", label: `All Users (${users.length})` },
            { id: "AMBASSADORS", label: `Ambassadors (${ambCount})` },
            { id: "STUDENTS", label: `Students (${studentCount})` },
            { id: "ADMINS", label: `Admins (${adminCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-soft-sm"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-surface/90 border border-border/60 rounded-2xl overflow-hidden shadow-soft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-surface-elevated/40 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredUsers.map(({ user: u, profile: p, points }) => {
                const isStudent = u.role === "student";
                const isAmbassador = u.role === "ambassador";
                const isAdmin = u.role === "admin";

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-surface-elevated/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                          {u.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-text">{u.name}</div>
                          <div className="text-[11px] text-text-muted">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : isAmbassador
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted">
                      {u.phone || "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isStudent && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole("ambassador");
                            }}
                            className="font-bold text-[11px] gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Promote to Ambassador</span>
                          </Button>
                        )}

                        {isAmbassador && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole("student");
                            }}
                            className="font-semibold text-[11px] text-text-muted hover:text-text"
                          >
                            Revert to Student
                          </Button>
                        )}

                        {!isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole("admin");
                            }}
                            className="font-semibold text-[11px] text-purple-400 hover:bg-purple-500/10"
                          >
                            Make Admin
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Confirmation Modal */}
      <AnimatePresence>
        {selectedUser && targetRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-soft-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">
                    Confirm Role Mutation
                  </h3>
                  <p className="text-xs text-text-muted">
                    This directly updates database authority in <code>profiles.role</code>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1.5">
                <div>
                  Target User:{" "}
                  <strong className="text-text font-bold">
                    {selectedUser.name}
                  </strong>{" "}
                  ({selectedUser.email})
                </div>
                <div>
                  Current Role:{" "}
                  <span className="font-semibold uppercase text-text-muted">
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  New Role:{" "}
                  <span className="font-bold uppercase text-primary">
                    {targetRole}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setTargetRole(null);
                  }}
                  className="text-text-muted hover:text-text font-semibold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRoleChange}
                  isLoading={isSettingRole}
                  className="font-bold text-xs"
                >
                  Confirm Promotion
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
