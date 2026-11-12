import React, { useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  CalendarEventItem,
  createCalendarEvent,
  createGoogleForm,
  createGoogleTask,
  createWorkspaceContact,
  deleteCalendarEvent,
  deleteGoogleTask,
  deleteWorkspaceContact,
  getGoogleFormDetail,
  GmailMessageSummary,
  GoogleFormDetail,
  GoogleFormSummary,
  GoogleTaskItem,
  GoogleTaskListItem,
  listCalendarEvents,
  listGmailMessages,
  listGoogleForms,
  listTaskLists,
  listTasksInList,
  listWorkspaceContacts,
  sendGmailMessage,
  toggleGoogleTaskStatus,
  WorkspaceContact,
} from '../lib/workspaceApi';
import {
  BuiltinConnector,
  fetchConnectionsCatalog,
  linkConnection,
  LinkedConnection,
  unlinkConnection,
  VerifiedWorkspaceServices,
  verifyWorkspaceConnections,
} from '../lib/connectionsApi';
import {
  getWorkspaceAccessToken,
  initWorkspaceAuth,
  linkGoogleWorkspaceAccount,
  signInWithGoogleWorkspace,
  signOutWorkspace,
} from '../lib/workspaceAuth';
import { ThemeTokens } from '../types/settings';

type WorkspaceTab = 'gmail' | 'contacts' | 'calendar' | 'tasks' | 'forms' | 'connections';

interface PendingConfirmation {
  title: string;
  description: string;
  confirmLabel: string;
  isDestructive?: boolean;
  onConfirm: () => Promise<void>;
}

interface WorkspaceHubProps {
  tokens: ThemeTokens;
  onNotify: (message: string) => void;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({ tokens, onNotify }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('gmail');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmation | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  // Gmail state
  const [gmailQuery, setGmailQuery] = useState('');
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  // Contacts state
  const [contacts, setContacts] = useState<WorkspaceContact[]>([]);
  const [contactGiven, setContactGiven] = useState('');
  const [contactFamily, setContactFamily] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Calendar state
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [eventEnd, setEventEnd] = useState(() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [eventDesc, setEventDesc] = useState('');

  // Tasks state
  const [taskLists, setTaskLists] = useState<GoogleTaskListItem[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState('');
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Forms state
  const [forms, setForms] = useState<GoogleFormSummary[]>([]);
  const [selectedForm, setSelectedForm] = useState<GoogleFormDetail | null>(null);
  const [manualFormId, setManualFormId] = useState('');
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormQuestion, setNewFormQuestion] = useState('');

  // Connections & Linking API state
  const [connectors, setConnectors] = useState<BuiltinConnector[]>([]);
  const [linkedConnections, setLinkedConnections] = useState<LinkedConnection[]>([]);
  const [verifiedInfo, setVerifiedInfo] = useState<VerifiedWorkspaceServices | null>(null);
  const [verifyingConnections, setVerifyingConnections] = useState(false);
  const [linkProvider, setLinkProvider] = useState('linkedin');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkTargetUrl, setLinkTargetUrl] = useState('');

  const refreshConnectionsCatalog = useCallback(async () => {
    try {
      const catalog = await fetchConnectionsCatalog();
      setConnectors(catalog.connectors);
      setLinkedConnections(catalog.linked);
    } catch {
      // keep existing catalog if transient error
    }
  }, []);

  useEffect(() => {
    void refreshConnectionsCatalog();
  }, [refreshConnectionsCatalog]);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setVerifiedInfo(null);
        setNeedsAuth(true);
      }
    );
    return unsubscribe;
  }, []);

  const ensureToken = useCallback((): string | null => {
    const token = accessToken || getWorkspaceAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return null;
    }
    return token;
  }, [accessToken]);

  const loadTabData = useCallback(
    async (tab: WorkspaceTab, explicitToken?: string) => {
      const token = explicitToken || ensureToken();
      if (!token) return;

      setLoading(true);
      setErrorMsg(null);
      try {
        if (tab === 'gmail') {
          const items = await listGmailMessages(token, gmailQuery);
          setMessages(items);
        } else if (tab === 'contacts') {
          const items = await listWorkspaceContacts(token);
          setContacts(items);
        } else if (tab === 'calendar') {
          const items = await listCalendarEvents(token);
          setEvents(items);
        } else if (tab === 'tasks') {
          const lists = await listTaskLists(token);
          setTaskLists(lists);
          const targetId = selectedTaskListId || lists[0]?.id || '';
          if (targetId) {
            setSelectedTaskListId(targetId);
            const taskItems = await listTasksInList(token, targetId);
            setTasks(taskItems);
          } else {
            setTasks([]);
          }
        } else if (tab === 'forms') {
          const formList = await listGoogleForms(token);
          setForms(formList);
        } else if (tab === 'connections') {
          await refreshConnectionsCatalog();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to load Workspace data.';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    [ensureToken, gmailQuery, refreshConnectionsCatalog, selectedTaskListId]
  );

  useEffect(() => {
    if (!needsAuth && accessToken) {
      void loadTabData(activeTab, accessToken);
    }
  }, [activeTab, needsAuth, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerifyTokenConnections = async (explicitToken?: string) => {
    const token = explicitToken || ensureToken();
    if (!token) return;
    setVerifyingConnections(true);
    setErrorMsg(null);
    try {
      const result = await verifyWorkspaceConnections(token);
      setVerifiedInfo(result);
      onNotify(`Verified ${result.scopeCount} Workspace scopes`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to verify Workspace connection.';
      setErrorMsg(msg);
    } finally {
      setVerifyingConnections(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const { user: signedInUser, accessToken: freshToken } =
        await signInWithGoogleWorkspace();
      setUser(signedInUser);
      setAccessToken(freshToken);
      setNeedsAuth(false);
      onNotify(`Signed in as ${signedInUser.email || 'Google user'}`);
      await Promise.all([
        loadTabData(activeTab, freshToken),
        refreshConnectionsCatalog(),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.';
      setErrorMsg(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLinkOrSwitchAccount = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const { user: linkedUser, accessToken: freshToken } =
        await linkGoogleWorkspaceAccount();
      setUser(linkedUser);
      setAccessToken(freshToken);
      setNeedsAuth(false);
      setVerifiedInfo(null);
      onNotify(`Linked Google account ${linkedUser.email || ''}`);
      await Promise.all([
        loadTabData(activeTab, freshToken),
        refreshConnectionsCatalog(),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Account linking failed.';
      setErrorMsg(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOutWorkspace();
    setUser(null);
    setAccessToken(null);
    setVerifiedInfo(null);
    setNeedsAuth(true);
    setMessages([]);
    setContacts([]);
    setEvents([]);
    setTasks([]);
    setForms([]);
    setSelectedForm(null);
    onNotify('Disconnected Google Workspace session');
  };

  const executeConfirmedAction = async () => {
    if (!pendingConfirm) return;
    setConfirmBusy(true);
    setErrorMsg(null);
    try {
      await pendingConfirm.onConfirm();
      setPendingConfirm(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Workspace operation failed.';
      setErrorMsg(msg);
      setPendingConfirm(null);
    } finally {
      setConfirmBusy(false);
    }
  };

  const tabs: { id: WorkspaceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'gmail', label: 'Gmail', icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
    { id: 'contacts', label: 'Contacts', icon: <Users className="h-4 w-4" aria-hidden="true" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" aria-hidden="true" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-4 w-4" aria-hidden="true" /> },
    { id: 'forms', label: 'Forms', icon: <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> },
    { id: 'connections', label: 'Connections & Linking', icon: <Link2 className="h-4 w-4" aria-hidden="true" /> },
  ];

  return (
    <section id="workspace" className={`border-b py-14 lg:py-16 ${tokens.divider}`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#1D93FF] uppercase">
                GOOGLE WORKSPACE
              </span>
              <span className="h-[1.5px] w-12 bg-[#1D93FF]/70" aria-hidden="true" />
            </div>

            <h2
              className={`font-display text-balance text-2xl font-bold tracking-tight sm:text-[32px] ${tokens.textPrimary}`}
            >
              Client Operations Workspace
            </h2>

            <p className={`mt-2.5 text-sm leading-relaxed sm:text-[15px] ${tokens.textSecondary}`}>
              Connect your Google account to read and manage Gmail, Contacts, Calendar events, Tasks,
              and Forms directly with explicit confirmation before any change.
            </p>
          </div>

          {!needsAuth && user && (
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs ${tokens.cardBg} ${tokens.cardBorder}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    referrerPolicy="no-referrer"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
                )}
                <span className={`font-semibold ${tokens.textPrimary}`}>
                  {user.email || user.displayName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleLinkOrSwitchAccount()}
                disabled={isLoggingIn}
                className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <Link2 className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                <span>Link / Switch Account</span>
              </button>

              <button
                type="button"
                onClick={() => void loadTabData(activeTab)}
                disabled={loading}
                className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

        {/* Auth Gate or Connected Workspace */}
        {needsAuth ? (
          <div className="mt-7 space-y-5">
            <div
              className={`flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center sm:p-8 ${tokens.cardBg} ${tokens.cardBorder}`}
            >
              <div className="max-w-xl">
                <h3 className={`font-display text-lg font-bold ${tokens.textPrimary}`}>
                  Connect Google Workspace
                </h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${tokens.textSecondary}`}>
                  Sign in with your Google account to view and manage your Gmail messages, Contacts,
                  Calendar schedule, Tasks, and Forms. Your access token stays in memory for this
                  session only.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleLogin()}
                disabled={isLoggingIn}
                className="gsi-material-button shrink-0"
              >
                <div className="gsi-material-button-state" />
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      style={{ display: 'block' }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>

            {/* Public Connections Catalog & External Linking Panel */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                <div className="flex items-center justify-between gap-3">
                  <h4 className={`font-display flex items-center gap-2 text-sm font-bold ${tokens.textPrimary}`}>
                    <Link2 className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />
                    <span>Available API &amp; Channel Connectors</span>
                  </h4>
                  <span className={`font-mono-tabular text-[11px] ${tokens.textMuted}`}>
                    {connectors.length} endpoints
                  </span>
                </div>
                <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {connectors.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-xl border p-3 ${
                        tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${tokens.textPrimary}`}>{c.label}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            c.status === 'ready'
                              ? 'bg-[#10B981]/15 text-[#10B981]'
                              : 'bg-[#1684FF]/15 text-[#1D93FF]'
                          }`}
                        >
                          {c.status === 'ready' ? 'Ready' : 'Sign-in Required'}
                        </span>
                      </div>
                      <p className={`mt-1 truncate font-mono-tabular text-[11px] ${tokens.textMuted}`}>
                        {c.endpoint}
                      </p>
                    </div>
                  ))}
                </div>

                {linkedConnections.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-3.5">
                    <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                      Linked External Connections ({linkedConnections.length})
                    </div>
                    {linkedConnections.map((conn) => (
                      <div
                        key={conn.id}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                          tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className={`truncate font-semibold ${tokens.textPrimary}`}>
                            {conn.label}{' '}
                            <span className={`font-normal ${tokens.textMuted}`}>({conn.provider})</span>
                          </div>
                          <a
                            href={conn.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate font-mono-tabular text-[11px] text-[#1D93FF] hover:underline"
                          >
                            {conn.targetUrl}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingConfirm({
                              title: 'Remove Linked Connection?',
                              description: `Disconnect "${conn.label}" (${conn.targetUrl})?`,
                              confirmLabel: 'Disconnect',
                              isDestructive: true,
                              onConfirm: async () => {
                                await unlinkConnection(conn.id);
                                onNotify(`Disconnected ${conn.label}`);
                                await refreshConnectionsCatalog();
                              },
                            });
                          }}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/15"
                          aria-label={`Disconnect ${conn.label}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                <h4 className={`font-display text-sm font-bold ${tokens.textPrimary}`}>
                  Link External Connection
                </h4>
                <p className={`mt-1 text-xs ${tokens.textSecondary}`}>
                  Register a verified HTTPS profile, booking calendar, Google Form, or integration link via{' '}
                  <code className="font-mono-tabular">/api/connections/link</code>.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!linkTargetUrl.trim()) {
                      setErrorMsg('Please enter a target connection URL (https://..., mailto:, or tel:).');
                      return;
                    }
                    setPendingConfirm({
                      title: 'Link Connection?',
                      description: `Add "${linkLabel.trim() || linkProvider}" pointing to ${linkTargetUrl.trim()}?`,
                      confirmLabel: 'Link Connection',
                      onConfirm: async () => {
                        await linkConnection({
                          provider: linkProvider,
                          label: linkLabel.trim() || linkProvider,
                          targetUrl: linkTargetUrl.trim(),
                        });
                        setLinkLabel('');
                        setLinkTargetUrl('');
                        onNotify('Connection linked successfully');
                        await refreshConnectionsCatalog();
                      },
                    });
                  }}
                  className="mt-3.5 space-y-2.5"
                >
                  <select
                    value={linkProvider}
                    onChange={(e) => setLinkProvider(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                  >
                    <option value="linkedin">LinkedIn Profile</option>
                    <option value="github">GitHub Profile</option>
                    <option value="calendly">Booking / Calendar Link</option>
                    <option value="forms">Google Form Intake URL</option>
                    <option value="whatsapp">WhatsApp Channel</option>
                    <option value="custom-https">Custom HTTPS Integration</option>
                  </select>
                  <input
                    type="text"
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    placeholder="Connection label (e.g. Client Intake Form)"
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                  />
                  <input
                    type="url"
                    value={linkTargetUrl}
                    onChange={(e) => setLinkTargetUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                  />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Link Connection</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 space-y-5">
            {/* Service Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border-[#1D93FF] bg-[#1684FF] text-white shadow-sm'
                        : `${tokens.cardBg} ${tokens.cardBorder} ${tokens.textSecondary} ${tokens.cardBorderHover}`
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <div
                role="alert"
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-medium ${
                  tokens.isDark
                    ? 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                    : 'border-rose-300 bg-rose-50 text-rose-800'
                }`}
              >
                <span>{errorMsg}</span>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="shrink-0 opacity-80 hover:opacity-100"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* GMAIL PANEL */}
            {activeTab === 'gmail' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                      Recent Messages
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void loadTabData('gmail');
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={gmailQuery}
                        onChange={(e) => setGmailQuery(e.target.value)}
                        placeholder="Search inbox..."
                        className={`h-9 rounded-lg border px-3 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                      />
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1684FF] px-3 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                      >
                        <Search className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Search</span>
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {messages.length === 0 ? (
                      <p className={`py-6 text-center text-xs ${tokens.textMuted}`}>
                        {loading ? 'Loading messages...' : 'No messages found for this query.'}
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`rounded-xl border p-3.5 ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                              {msg.subject}
                            </div>
                            <span className={`shrink-0 text-[11px] ${tokens.textMuted}`}>
                              {msg.date.slice(0, 16)}
                            </span>
                          </div>
                          <div className={`mt-0.5 text-[11px] font-medium ${tokens.accentText}`}>
                            {msg.from}
                          </div>
                          <p className={`mt-1.5 text-xs leading-relaxed ${tokens.textSecondary}`}>
                            {msg.snippet}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Compose Email
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!token) return;
                      if (!mailTo.trim() || !mailSubject.trim() || !mailBody.trim()) {
                        setErrorMsg('Please enter recipient, subject, and message body.');
                        return;
                      }
                      setPendingConfirm({
                        title: 'Send Email via Gmail?',
                        description: `Send email "${mailSubject.trim()}" to ${mailTo.trim()}?`,
                        confirmLabel: 'Send Email',
                        onConfirm: async () => {
                          await sendGmailMessage(token, mailTo, mailSubject, mailBody);
                          setMailTo('');
                          setMailSubject('');
                          setMailBody('');
                          onNotify('Email sent via Gmail');
                          await loadTabData('gmail', token);
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="email"
                      value={mailTo}
                      onChange={(e) => setMailTo(e.target.value)}
                      placeholder="Recipient email"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <input
                      type="text"
                      value={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                      placeholder="Subject"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <textarea
                      rows={5}
                      value={mailBody}
                      onChange={(e) => setMailBody(e.target.value)}
                      placeholder="Write your message..."
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Review &amp; Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* CONTACTS PANEL */}
            {activeTab === 'contacts' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Google Contacts ({contacts.length})
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {contacts.length === 0 ? (
                      <p className={`py-6 text-center text-xs ${tokens.textMuted}`}>
                        {loading ? 'Loading contacts...' : 'No contacts found in this account.'}
                      </p>
                    ) : (
                      contacts.map((c) => (
                        <div
                          key={c.resourceName}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`truncate text-xs font-bold ${tokens.textPrimary}`}>
                              {c.name}
                            </div>
                            <div className={`mt-0.5 truncate text-[11px] ${tokens.textSecondary}`}>
                              {[c.email, c.phone].filter(Boolean).join(' · ') || 'No email or phone'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const token = ensureToken();
                              if (!token) return;
                              setPendingConfirm({
                                title: 'Delete Contact?',
                                description: `Permanently delete "${c.name}" from Google Contacts? This cannot be undone.`,
                                confirmLabel: 'Delete Contact',
                                isDestructive: true,
                                onConfirm: async () => {
                                  await deleteWorkspaceContact(token, c.resourceName);
                                  onNotify(`Deleted contact ${c.name}`);
                                  await loadTabData('contacts', token);
                                },
                              });
                            }}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/15"
                            aria-label={`Delete ${c.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Add Contact
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!token) return;
                      if (!contactGiven.trim()) {
                        setErrorMsg('Please enter at least a first name.');
                        return;
                      }
                      const fullName = `${contactGiven.trim()} ${contactFamily.trim()}`.trim();
                      setPendingConfirm({
                        title: 'Create Contact?',
                        description: `Add "${fullName}" to your Google Contacts?`,
                        confirmLabel: 'Save Contact',
                        onConfirm: async () => {
                          await createWorkspaceContact(
                            token,
                            contactGiven,
                            contactFamily,
                            contactEmail,
                            contactPhone
                          );
                          setContactGiven('');
                          setContactFamily('');
                          setContactEmail('');
                          setContactPhone('');
                          onNotify(`Added contact ${fullName}`);
                          await loadTabData('contacts', token);
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={contactGiven}
                        onChange={(e) => setContactGiven(e.target.value)}
                        placeholder="First name"
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                      />
                      <input
                        type="text"
                        value={contactFamily}
                        onChange={(e) => setContactFamily(e.target.value)}
                        placeholder="Last name"
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                      />
                    </div>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email address"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Phone number"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Add to Contacts</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* CALENDAR PANEL */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Upcoming Calendar Events
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {events.length === 0 ? (
                      <p className={`py-6 text-center text-xs ${tokens.textMuted}`}>
                        {loading ? 'Loading events...' : 'No upcoming events found.'}
                      </p>
                    ) : (
                      events.map((ev) => (
                        <div
                          key={ev.id}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`truncate text-xs font-bold ${tokens.textPrimary}`}>
                              {ev.summary}
                            </div>
                            <div className={`mt-0.5 font-mono-tabular text-[11px] ${tokens.textSecondary}`}>
                              {ev.start ? new Date(ev.start).toLocaleString() : 'All day'}
                            </div>
                            {ev.location && (
                              <div className={`mt-0.5 text-[11px] ${tokens.textMuted}`}>
                                {ev.location}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const token = ensureToken();
                              if (!token) return;
                              setPendingConfirm({
                                title: 'Delete Calendar Event?',
                                description: `Delete "${ev.summary}" from your primary Google Calendar?`,
                                confirmLabel: 'Delete Event',
                                isDestructive: true,
                                onConfirm: async () => {
                                  await deleteCalendarEvent(token, ev.id);
                                  onNotify(`Deleted event "${ev.summary}"`);
                                  await loadTabData('calendar', token);
                                },
                              });
                            }}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/15"
                            aria-label={`Delete ${ev.summary}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Schedule Event
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!token) return;
                      if (!eventTitle.trim() || !eventStart || !eventEnd) {
                        setErrorMsg('Please enter an event title, start time, and end time.');
                        return;
                      }
                      setPendingConfirm({
                        title: 'Create Calendar Event?',
                        description: `Schedule "${eventTitle.trim()}" on your primary Google Calendar?`,
                        confirmLabel: 'Create Event',
                        onConfirm: async () => {
                          await createCalendarEvent(
                            token,
                            eventTitle,
                            eventStart,
                            eventEnd,
                            eventDesc
                          );
                          setEventTitle('');
                          setEventDesc('');
                          onNotify('Calendar event created');
                          await loadTabData('calendar', token);
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Event title (e.g. Client Kickoff)"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={`mb-1 block text-[11px] font-semibold ${tokens.textMuted}`}>
                          Start
                        </label>
                        <input
                          type="datetime-local"
                          value={eventStart}
                          onChange={(e) => setEventStart(e.target.value)}
                          className={`w-full rounded-lg border px-2.5 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                        />
                      </div>
                      <div>
                        <label className={`mb-1 block text-[11px] font-semibold ${tokens.textMuted}`}>
                          End
                        </label>
                        <input
                          type="datetime-local"
                          value={eventEnd}
                          onChange={(e) => setEventEnd(e.target.value)}
                          className={`w-full rounded-lg border px-2.5 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                        />
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      placeholder="Agenda or meeting notes"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Schedule Event</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TASKS PANEL */}
            {activeTab === 'tasks' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                      Google Tasks
                    </h3>
                    {taskLists.length > 0 && (
                      <select
                        value={selectedTaskListId}
                        onChange={(e) => {
                          const nextId = e.target.value;
                          setSelectedTaskListId(nextId);
                          const token = ensureToken();
                          if (token) {
                            setLoading(true);
                            void listTasksInList(token, nextId)
                              .then(setTasks)
                              .catch((err) =>
                                setErrorMsg(err instanceof Error ? err.message : 'Failed to load tasks')
                              )
                              .finally(() => setLoading(false));
                          }
                        }}
                        className={`h-9 rounded-lg border px-3 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                      >
                        {taskLists.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {tasks.length === 0 ? (
                      <p className={`py-6 text-center text-xs ${tokens.textMuted}`}>
                        {loading ? 'Loading tasks...' : 'No tasks in this list.'}
                      </p>
                    ) : (
                      tasks.map((task) => {
                        const isDone = task.status === 'completed';
                        return (
                          <div
                            key={task.id}
                            className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                              tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const token = ensureToken();
                                if (!token || !selectedTaskListId) return;
                                setPendingConfirm({
                                  title: isDone ? 'Mark Task Incomplete?' : 'Complete Task?',
                                  description: `Update "${task.title}" status to ${
                                    isDone ? 'Needs Action' : 'Completed'
                                  }?`,
                                  confirmLabel: isDone ? 'Mark Incomplete' : 'Mark Completed',
                                  onConfirm: async () => {
                                    await toggleGoogleTaskStatus(token, selectedTaskListId, task);
                                    onNotify(`Updated task "${task.title}"`);
                                    const updated = await listTasksInList(token, selectedTaskListId);
                                    setTasks(updated);
                                  },
                                });
                              }}
                              className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
                            >
                              <CheckCircle2
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  isDone ? 'text-[#10B981]' : tokens.textMuted
                                }`}
                                aria-hidden="true"
                              />
                              <div className="min-w-0">
                                <div
                                  className={`text-xs font-bold ${
                                    isDone ? 'line-through opacity-65' : ''
                                  } ${tokens.textPrimary}`}
                                >
                                  {task.title}
                                </div>
                                {task.notes && (
                                  <p className={`mt-0.5 text-[11px] ${tokens.textSecondary}`}>
                                    {task.notes}
                                  </p>
                                )}
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const token = ensureToken();
                                if (!token || !selectedTaskListId) return;
                                setPendingConfirm({
                                  title: 'Delete Task?',
                                  description: `Delete "${task.title}" from Google Tasks?`,
                                  confirmLabel: 'Delete Task',
                                  isDestructive: true,
                                  onConfirm: async () => {
                                    await deleteGoogleTask(token, selectedTaskListId, task.id);
                                    onNotify(`Deleted task "${task.title}"`);
                                    const updated = await listTasksInList(token, selectedTaskListId);
                                    setTasks(updated);
                                  },
                                });
                              }}
                              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/15"
                              aria-label={`Delete ${task.title}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Create Task
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!token || !selectedTaskListId) return;
                      if (!newTaskTitle.trim()) {
                        setErrorMsg('Please enter a task title.');
                        return;
                      }
                      setPendingConfirm({
                        title: 'Add Google Task?',
                        description: `Create task "${newTaskTitle.trim()}" in your selected list?`,
                        confirmLabel: 'Create Task',
                        onConfirm: async () => {
                          await createGoogleTask(
                            token,
                            selectedTaskListId,
                            newTaskTitle,
                            newTaskNotes
                          );
                          setNewTaskTitle('');
                          setNewTaskNotes('');
                          onNotify('Task created');
                          const updated = await listTasksInList(token, selectedTaskListId);
                          setTasks(updated);
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task title"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <textarea
                      rows={4}
                      value={newTaskNotes}
                      onChange={(e) => setNewTaskNotes(e.target.value)}
                      placeholder="Optional task notes"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Add Task</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* FORMS PANEL */}
            {activeTab === 'forms' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                      Your Google Forms
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const token = ensureToken();
                        if (!token || !manualFormId.trim()) return;
                        setLoading(true);
                        setErrorMsg(null);
                        void getGoogleFormDetail(token, manualFormId)
                          .then((detail) => {
                            setSelectedForm(detail);
                            setForms((prev) => [
                              { id: detail.formId, name: detail.title, webViewLink: detail.responderUri },
                              ...prev.filter((f) => f.id !== detail.formId),
                            ]);
                          })
                          .catch((err) =>
                            setErrorMsg(err instanceof Error ? err.message : 'Unable to load form')
                          )
                          .finally(() => setLoading(false));
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={manualFormId}
                        onChange={(e) => setManualFormId(e.target.value)}
                        placeholder="Inspect Form ID..."
                        className={`h-9 rounded-lg border px-3 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                      />
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center rounded-lg bg-[#1684FF] px-3 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                      >
                        Load
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {forms.length === 0 ? (
                      <p className={`py-4 text-center text-xs ${tokens.textMuted}`}>
                        {loading ? 'Loading form...' : 'No Google Forms tracked yet. Enter a Form ID above or create a new form.'}
                      </p>
                    ) : (
                      forms.map((f) => (
                        <div
                          key={f.id}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`truncate text-xs font-bold ${tokens.textPrimary}`}>
                              {f.name}
                            </div>
                            <div className={`mt-0.5 font-mono-tabular text-[11px] ${tokens.textMuted}`}>
                              ID: {f.id}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const token = ensureToken();
                                if (!token) return;
                                setLoading(true);
                                void getGoogleFormDetail(token, f.id)
                                  .then(setSelectedForm)
                                  .catch((err) =>
                                    setErrorMsg(err instanceof Error ? err.message : 'Unable to open form')
                                  )
                                  .finally(() => setLoading(false));
                              }}
                              className="rounded-lg bg-[#1684FF]/15 px-3 py-1.5 text-xs font-semibold text-[#1D93FF] hover:bg-[#1684FF] hover:text-white"
                            >
                              Inspect
                            </button>
                            {f.webViewLink && (
                              <a
                                href={f.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${tokens.outlineButton}`}
                                aria-label={`Open ${f.name} in Google Forms`}
                              >
                                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {selectedForm && (
                    <div
                      className={`mt-4 rounded-xl border p-4 ${
                        tokens.isDark ? 'border-[#25447A] bg-[#060E1F]' : 'border-[#CBD8EE] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={`text-sm font-bold ${tokens.textPrimary}`}>
                            {selectedForm.title}
                          </div>
                          <div className={`mt-0.5 text-xs ${tokens.textMuted}`}>
                            {selectedForm.questionCount} questions · {selectedForm.responseCount}{' '}
                            responses
                          </div>
                        </div>
                        {selectedForm.responderUri && (
                          <a
                            href={selectedForm.responderUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D93FF] hover:underline"
                          >
                            <span>Responder Link</span>
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                      {selectedForm.questions.length > 0 && (
                        <ul className={`mt-3 space-y-1 text-xs ${tokens.textSecondary}`}>
                          {selectedForm.questions.map((q, idx) => (
                            <li key={q.id}>
                              {idx + 1}. {q.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Create New Form
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!token) return;
                      if (!newFormTitle.trim()) {
                        setErrorMsg('Please enter a form title.');
                        return;
                      }
                      setPendingConfirm({
                        title: 'Create Google Form?',
                        description: `Create a new Google Form titled "${newFormTitle.trim()}" in your Google account?`,
                        confirmLabel: 'Create Form',
                        onConfirm: async () => {
                          const detail = await createGoogleForm(
                            token,
                            newFormTitle,
                            newFormQuestion
                          );
                          setSelectedForm(detail);
                          setForms((prev) => [
                            { id: detail.formId, name: detail.title, webViewLink: detail.responderUri },
                            ...prev.filter((f) => f.id !== detail.formId),
                          ]);
                          setNewFormTitle('');
                          setNewFormQuestion('');
                          onNotify(`Created form "${detail.title}"`);
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      value={newFormTitle}
                      onChange={(e) => setNewFormTitle(e.target.value)}
                      placeholder="Form title (e.g. Client Intake Questionnaire)"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <input
                      type="text"
                      value={newFormQuestion}
                      onChange={(e) => setNewFormQuestion(e.target.value)}
                      placeholder="Initial question (optional)"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Create Form</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* CONNECTIONS & LINKING PANEL */}
            {activeTab === 'connections' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className={`rounded-2xl border p-5 lg:col-span-7 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                        Workspace &amp; API Connections
                      </h3>
                      <p className={`mt-0.5 text-xs ${tokens.textMuted}`}>
                        Verify your OAuth Bearer token and inspect linked endpoints.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleVerifyTokenConnections()}
                      disabled={verifyingConnections}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1684FF] px-3.5 text-xs font-semibold text-white hover:bg-[#0B6EF0] disabled:opacity-60"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{verifyingConnections ? 'Verifying...' : 'Verify Token & Scopes'}</span>
                    </button>
                  </div>

                  {verifiedInfo && (
                    <div
                      className={`mt-4 rounded-xl border p-3.5 text-xs ${
                        tokens.isDark
                          ? 'border-[#10B981]/40 bg-[#10B981]/10 text-emerald-200'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      }`}
                    >
                      <div className="font-bold">
                        Token Verified · {verifiedInfo.email || user?.email} ({verifiedInfo.scopeCount}{' '}
                        scopes)
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(['gmail', 'contacts', 'calendar', 'tasks', 'forms'] as const).map((svc) => (
                          <span
                            key={svc}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                              verifiedInfo.services[svc]
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {svc}: {verifiedInfo.services[svc] ? 'Connected' : 'Missing Scope'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {connectors.map((c) => {
                      const svcKey = c.provider as keyof VerifiedWorkspaceServices['services'];
                      const isVerifiedSvc =
                        c.category === 'workspace' && verifiedInfo?.services?.[svcKey];
                      const isConnected = !c.requiresOAuth || !needsAuth;
                      return (
                        <div
                          key={c.id}
                          className={`rounded-xl border p-3 ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-bold ${tokens.textPrimary}`}>{c.label}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isVerifiedSvc || isConnected
                                  ? 'bg-[#10B981]/15 text-[#10B981]'
                                  : 'bg-[#1684FF]/15 text-[#1D93FF]'
                              }`}
                            >
                              {isVerifiedSvc ? 'Verified' : isConnected ? 'Connected' : 'Pending'}
                            </span>
                          </div>
                          <p className={`mt-1 truncate font-mono-tabular text-[11px] ${tokens.textMuted}`}>
                            {c.endpoint}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {linkedConnections.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-white/10 pt-3.5">
                      <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                        Linked Connections ({linkedConnections.length})
                      </div>
                      {linkedConnections.map((conn) => (
                        <div
                          key={conn.id}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                            tokens.isDark ? 'border-[#1B335E] bg-[#081226]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`truncate font-semibold ${tokens.textPrimary}`}>
                              {conn.label}{' '}
                              <span className={`font-normal ${tokens.textMuted}`}>({conn.provider})</span>
                            </div>
                            <a
                              href={conn.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate font-mono-tabular text-[11px] text-[#1D93FF] hover:underline"
                            >
                              {conn.targetUrl}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPendingConfirm({
                                title: 'Remove Linked Connection?',
                                description: `Disconnect "${conn.label}" (${conn.targetUrl})?`,
                                confirmLabel: 'Disconnect',
                                isDestructive: true,
                                onConfirm: async () => {
                                  await unlinkConnection(conn.id);
                                  onNotify(`Disconnected ${conn.label}`);
                                  await refreshConnectionsCatalog();
                                },
                              });
                            }}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/15"
                            aria-label={`Disconnect ${conn.label}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`rounded-2xl border p-5 lg:col-span-5 ${tokens.cardBg} ${tokens.cardBorder}`}>
                  <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                    Link External Connection
                  </h3>
                  <p className={`mt-1 text-xs ${tokens.textSecondary}`}>
                    Attach a verified profile, calendar booking page, intake form, or HTTPS integration URL.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const token = ensureToken();
                      if (!linkTargetUrl.trim()) {
                        setErrorMsg('Please enter a target connection URL (https://..., mailto:, or tel:).');
                        return;
                      }
                      setPendingConfirm({
                        title: 'Link Connection?',
                        description: `Add "${linkLabel.trim() || linkProvider}" pointing to ${linkTargetUrl.trim()}?`,
                        confirmLabel: 'Link Connection',
                        onConfirm: async () => {
                          await linkConnection(
                            {
                              provider: linkProvider,
                              label: linkLabel.trim() || linkProvider,
                              targetUrl: linkTargetUrl.trim(),
                            },
                            token
                          );
                          setLinkLabel('');
                          setLinkTargetUrl('');
                          onNotify('Connection linked successfully');
                          await refreshConnectionsCatalog();
                        },
                      });
                    }}
                    className="mt-4 space-y-3"
                  >
                    <select
                      value={linkProvider}
                      onChange={(e) => setLinkProvider(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    >
                      <option value="linkedin">LinkedIn Profile</option>
                      <option value="github">GitHub Profile</option>
                      <option value="calendly">Booking / Calendar Link</option>
                      <option value="forms">Google Form Intake URL</option>
                      <option value="whatsapp">WhatsApp Channel</option>
                      <option value="custom-https">Custom HTTPS Integration</option>
                    </select>
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="Connection label"
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <input
                      type="url"
                      value={linkTargetUrl}
                      onChange={(e) => setLinkTargetUrl(e.target.value)}
                      placeholder="https://..."
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Link Connection</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explicit Confirmation Modal for Mutating / Destructive Operations */}
      {pendingConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={pendingConfirm.title}
        >
          <div
            className="fixed inset-0"
            onClick={() => !confirmBusy && setPendingConfirm(null)}
            aria-hidden="true"
          />
          <div
            className={`relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl ${tokens.modalBg}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  pendingConfirm.isDestructive
                    ? 'bg-rose-500/15 text-rose-400'
                    : 'bg-[#1684FF]/15 text-[#1D93FF]'
                }`}
              >
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className={`font-display text-base font-bold ${tokens.textPrimary}`}>
                  {pendingConfirm.title}
                </h3>
                <p className={`mt-1.5 text-xs leading-relaxed sm:text-sm ${tokens.textSecondary}`}>
                  {pendingConfirm.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => setPendingConfirm(null)}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => void executeConfirmedAction()}
                className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors ${
                  pendingConfirm.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#1684FF] hover:bg-[#0B6EF0]'
                }`}
              >
                {confirmBusy ? 'Processing...' : pendingConfirm.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
