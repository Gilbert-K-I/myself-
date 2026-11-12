export interface BuiltinConnector {
  id: string;
  provider: string;
  label: string;
  category: 'workspace' | 'messaging' | 'social' | 'integration';
  endpoint: string;
  localApi?: string;
  requiresOAuth: boolean;
  requiredScopes?: string[];
  status: 'ready' | 'oauth-required';
}

export interface LinkedConnection {
  id: string;
  provider: string;
  label: string;
  targetUrl: string;
  category: 'workspace' | 'messaging' | 'social' | 'integration';
  verified: boolean;
  accountEmail?: string;
  linkedAt: string;
}

export interface ConnectionsCatalogResponse {
  ok: boolean;
  connectors: BuiltinConnector[];
  linked: LinkedConnection[];
}

export interface VerifiedWorkspaceServices {
  ok: boolean;
  email: string | null;
  expiresIn: number | null;
  scopeCount: number;
  services: {
    gmail: boolean;
    contacts: boolean;
    calendar: boolean;
    tasks: boolean;
    forms: boolean;
  };
}

export async function fetchConnectionsCatalog(): Promise<ConnectionsCatalogResponse> {
  const res = await fetch('/api/connections');
  if (!res.ok) {
    throw new Error('Unable to load connections catalog.');
  }
  return (await res.json()) as ConnectionsCatalogResponse;
}

export async function verifyWorkspaceConnections(
  accessToken: string
): Promise<VerifiedWorkspaceServices> {
  const res = await fetch('/api/connections/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });

  const payload = (await res.json().catch(() => ({}))) as VerifiedWorkspaceServices & {
    error?: string;
  };

  if (!res.ok) {
    throw new Error(payload.error || 'Failed to verify Workspace connection token.');
  }

  return payload;
}

export async function linkConnection(
  input: {
    provider: string;
    label: string;
    targetUrl: string;
  },
  accessToken?: string | null
): Promise<LinkedConnection> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch('/api/connections/link', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    connection?: LinkedConnection;
    error?: string;
  };

  if (!res.ok || !payload.connection) {
    throw new Error(payload.error || 'Failed to link connection.');
  }

  return payload.connection;
}

export async function unlinkConnection(id: string): Promise<void> {
  const res = await fetch(`/api/connections/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || 'Failed to unlink connection.');
  }
}
