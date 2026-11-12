export interface GmailMessageSummary {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

export interface WorkspaceContact {
  resourceName: string;
  etag?: string;
  name: string;
  email: string;
  phone: string;
}

export interface CalendarEventItem {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  htmlLink?: string;
}

export interface GoogleTaskListItem {
  id: string;
  title: string;
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
}

export interface GoogleFormSummary {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GoogleFormDetail {
  formId: string;
  title: string;
  description?: string;
  responderUri?: string;
  questionCount: number;
  questions: { id: string; title: string }[];
  responseCount: number;
}

async function googleFetch<T>(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let detail = `Google API request failed (${res.status})`;
    try {
      const errJson = (await res.json()) as { error?: { message?: string } };
      if (errJson?.error?.message) {
        detail = errJson.error.message;
      }
    } catch {
      // ignore non-json body
    }
    throw new Error(detail);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

// ---------- GMAIL ----------
export async function listGmailMessages(
  accessToken: string,
  query = ''
): Promise<GmailMessageSummary[]> {
  const qParam = query.trim() ? `&q=${encodeURIComponent(query.trim())}` : '';
  const listData = await googleFetch<{ messages?: { id: string }[] }>(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8${qParam}`,
    accessToken
  );

  const ids = (listData.messages ?? []).slice(0, 8).map((m) => m.id);
  if (ids.length === 0) return [];

  const details = await Promise.all(
    ids.map((id) =>
      googleFetch<{
        id: string;
        snippet?: string;
        payload?: { headers?: { name: string; value: string }[] };
      }>(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(
          id
        )}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        accessToken
      )
    )
  );

  return details.map((d) => {
    const headers = d.payload?.headers ?? [];
    const getH = (name: string) =>
      headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
    return {
      id: d.id,
      subject: getH('Subject') || '(No Subject)',
      from: getH('From') || 'Unknown sender',
      date: getH('Date'),
      snippet: d.snippet ?? '',
    };
  });
}

function encodeBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const safeTo = to.replace(/[\r\n]/g, '').trim();
  const safeSubject = subject.replace(/[\r\n]/g, '').trim();
  const rawEmail = [
    `To: ${safeTo}`,
    `Subject: ${safeSubject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ].join('\r\n');

  await googleFetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ raw: encodeBase64Url(rawEmail) }),
    }
  );
}

// ---------- CONTACTS (PEOPLE API) ----------
export async function listWorkspaceContacts(
  accessToken: string
): Promise<WorkspaceContact[]> {
  const data = await googleFetch<{
    connections?: {
      resourceName: string;
      etag?: string;
      names?: { displayName?: string }[];
      emailAddresses?: { value?: string }[];
      phoneNumbers?: { value?: string }[];
    }[];
  }>(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=25&sortOrder=LAST_MODIFIED_DESCENDING',
    accessToken
  );

  return (data.connections ?? []).map((c) => ({
    resourceName: c.resourceName,
    etag: c.etag,
    name: c.names?.[0]?.displayName || '(Unnamed Contact)',
    email: c.emailAddresses?.[0]?.value || '',
    phone: c.phoneNumbers?.[0]?.value || '',
  }));
}

export async function createWorkspaceContact(
  accessToken: string,
  givenName: string,
  familyName: string,
  email: string,
  phone: string
): Promise<void> {
  await googleFetch(
    'https://people.googleapis.com/v1/people:createContact',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        names: [{ givenName: givenName.trim(), familyName: familyName.trim() }],
        ...(email.trim() ? { emailAddresses: [{ value: email.trim() }] } : {}),
        ...(phone.trim() ? { phoneNumbers: [{ value: phone.trim() }] } : {}),
      }),
    }
  );
}

export async function deleteWorkspaceContact(
  accessToken: string,
  resourceName: string
): Promise<void> {
  const safeResource = resourceName
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  await googleFetch(
    `https://people.googleapis.com/v1/${safeResource}:deleteContact`,
    accessToken,
    { method: 'DELETE' }
  );
}

// ---------- GOOGLE CALENDAR ----------
export async function listCalendarEvents(
  accessToken: string
): Promise<CalendarEventItem[]> {
  const timeMin = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const data = await googleFetch<{
    items?: {
      id: string;
      summary?: string;
      location?: string;
      htmlLink?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
    }[];
  }>(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=12&timeMin=${encodeURIComponent(
      timeMin
    )}`,
    accessToken
  );

  return (data.items ?? []).map((ev) => ({
    id: ev.id,
    summary: ev.summary || '(Untitled Event)',
    start: ev.start?.dateTime || ev.start?.date || '',
    end: ev.end?.dateTime || ev.end?.date || '',
    location: ev.location,
    htmlLink: ev.htmlLink,
  }));
}

export async function createCalendarEvent(
  accessToken: string,
  summary: string,
  startIso: string,
  endIso: string,
  description: string
): Promise<void> {
  await googleFetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: summary.trim(),
        description: description.trim(),
        start: { dateTime: new Date(startIso).toISOString() },
        end: { dateTime: new Date(endIso).toISOString() },
      }),
    }
  );
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  await googleFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(
      eventId
    )}`,
    accessToken,
    { method: 'DELETE' }
  );
}

// ---------- GOOGLE TASKS ----------
export async function listTaskLists(
  accessToken: string
): Promise<GoogleTaskListItem[]> {
  const data = await googleFetch<{ items?: { id: string; title: string }[] }>(
    'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
    accessToken
  );
  return data.items ?? [];
}

export async function listTasksInList(
  accessToken: string,
  taskListId: string
): Promise<GoogleTaskItem[]> {
  const data = await googleFetch<{
    items?: {
      id: string;
      title?: string;
      notes?: string;
      status?: 'needsAction' | 'completed';
      due?: string;
    }[];
  }>(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(
      taskListId
    )}/tasks?showCompleted=true&maxResults=25`,
    accessToken
  );

  return (data.items ?? []).map((t) => ({
    id: t.id,
    title: t.title || '(Untitled Task)',
    notes: t.notes,
    status: t.status === 'completed' ? 'completed' : 'needsAction',
    due: t.due,
  }));
}

export async function createGoogleTask(
  accessToken: string,
  taskListId: string,
  title: string,
  notes: string
): Promise<void> {
  await googleFetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(
      taskListId
    )}/tasks`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        title: title.trim(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }),
    }
  );
}

export async function toggleGoogleTaskStatus(
  accessToken: string,
  taskListId: string,
  task: GoogleTaskItem
): Promise<void> {
  const nextStatus = task.status === 'completed' ? 'needsAction' : 'completed';
  await googleFetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(
      taskListId
    )}/tasks/${encodeURIComponent(task.id)}`,
    accessToken,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    }
  );
}

export async function deleteGoogleTask(
  accessToken: string,
  taskListId: string,
  taskId: string
): Promise<void> {
  await googleFetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(
      taskListId
    )}/tasks/${encodeURIComponent(taskId)}`,
    accessToken,
    { method: 'DELETE' }
  );
}

// ---------- GOOGLE FORMS (Google Forms API) ----------
export async function listGoogleForms(
  _accessToken: string
): Promise<GoogleFormSummary[]> {
  // Google Drive integration removed; forms are managed directly via Google Forms API
  return [];
}

export async function getGoogleFormDetail(
  accessToken: string,
  formId: string
): Promise<GoogleFormDetail> {
  const safeFormId = encodeURIComponent(formId.trim());
  const [formData, responsesData] = await Promise.all([
    googleFetch<{
      formId: string;
      info?: { title?: string; description?: string };
      responderUri?: string;
      items?: { itemId?: string; title?: string; questionItem?: unknown }[];
    }>(`https://forms.googleapis.com/v1/forms/${safeFormId}`, accessToken),
    googleFetch<{ responses?: unknown[] }>(
      `https://forms.googleapis.com/v1/forms/${safeFormId}/responses`,
      accessToken
    ).catch(() => ({ responses: [] })),
  ]);

  const questions = (formData.items ?? [])
    .filter((item) => Boolean(item.questionItem))
    .map((item, idx) => ({
      id: item.itemId ?? `q-${idx}`,
      title: item.title || `Question ${idx + 1}`,
    }));

  return {
    formId: formData.formId,
    title: formData.info?.title || 'Untitled Form',
    description: formData.info?.description,
    responderUri: formData.responderUri,
    questionCount: questions.length,
    questions,
    responseCount: (responsesData.responses ?? []).length,
  };
}

export async function createGoogleForm(
  accessToken: string,
  title: string,
  firstQuestionTitle: string
): Promise<GoogleFormDetail> {
  const created = await googleFetch<{ formId: string }>(
    'https://forms.googleapis.com/v1/forms',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        info: {
          title: title.trim(),
          documentTitle: title.trim(),
        },
      }),
    }
  );

  const safeFormId = encodeURIComponent(created.formId);
  if (firstQuestionTitle.trim()) {
    await googleFetch(
      `https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: firstQuestionTitle.trim(),
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: { paragraph: false },
                    },
                  },
                },
                location: { index: 0 },
              },
            },
          ],
        }),
      }
    );
  }

  return getGoogleFormDetail(accessToken, created.formId);
}
