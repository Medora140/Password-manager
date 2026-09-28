import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import copyIcon from "../../assets/copy.png";
import copiedIcon from "../../assets/right.png";

interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password: string;
}

const STORAGE_KEY = "passwords";

function readPasswords(): PasswordEntry[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item): item is PasswordEntry =>
          item &&
          typeof item === "object" &&
          typeof item.site === "string" &&
          typeof item.username === "string" &&
          typeof item.password === "string",
      )
      .map((item) => ({
        ...item,
        id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      }));
  } catch {
    return [];
  }
}

const PasswordManager = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(readPasswords);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [query, setQuery] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
  }, [passwords]);

  const filteredPasswords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return passwords.filter((item) =>
      `${item.site} ${item.username}`.toLowerCase().includes(normalized),
    );
  }, [passwords, query]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const savePassword = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const site = form.site.trim();
    const username = form.username.trim();
    const password = form.password.trim();
    if (!site || !username || !password) {
      setError("Complete all three fields to save this login.");
      return;
    }
    setPasswords((current) => [
      { id: crypto.randomUUID(), site, username, password },
      ...current,
    ]);
    setForm({ site: "", username: "", password: "" });
    setError("");
  };

  const copyValue = async (value: string, id: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(`${id}:${field}`);
      window.setTimeout(
        () =>
          setCopiedId((current) =>
            current === `${id}:${field}` ? "" : current,
          ),
        1800,
      );
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  const deletePassword = (id: string) => {
    setPasswords((current) => current.filter((item) => item.id !== id));
    setVisiblePasswords((current) => current.filter((itemId) => itemId !== id));
  };

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  return (
    <main className="manager">
      <section className="dashboard" aria-labelledby="page-title">
        <header className="page-heading">
          <div>
            <p className="eyebrow">YOUR PRIVATE VAULT</p>
            <h1 id="page-title">
              Your passwords, <span>in one place.</span>
            </h1>
            <p className="intro">
              Keep the logins you use every day close at hand.
            </p>
          </div>
          <div className="vault-count">
            <strong>{passwords.length}</strong>
            <span>saved {passwords.length === 1 ? "login" : "logins"}</span>
          </div>
        </header>

        <section className="password-form-card" aria-labelledby="add-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GET ORGANIZED</p>
              <h2 id="add-title">Add a login</h2>
            </div>
            <span className="secure-label">
              <span aria-hidden="true">●</span> Stored on this device
            </span>
          </div>
          <form className="password-form" onSubmit={savePassword}>
            <label className="field">
              <span>Website</span>
              <input
                name="site"
                type="text"
                value={form.site}
                onChange={handleChange}
                placeholder="e.g. github.com"
                autoComplete="url"
              />
            </label>
            <label className="field">
              <span>Username or email</span>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="username"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="new-password"
              />
            </label>
            <button className="btn" type="submit">
              <span aria-hidden="true">＋</span> Save login
            </button>
          </form>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="saved-section" aria-labelledby="saved-title">
          <div className="saved-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2 id="saved-title">Saved logins</h2>
            </div>
            <label className="search-field">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>
              <span className="sr-only">Search logins</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search website or username"
              />
            </label>
          </div>
          {filteredPasswords.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                ⌑
              </span>
              <h3>
                {passwords.length
                  ? "No matching logins"
                  : "Your vault is ready"}
              </h3>
              <p>
                {passwords.length
                  ? "Try another website or username."
                  : "Add your first login above and it will appear here."}
              </p>
            </div>
          ) : (
            <div className="password-list" role="list">
              {filteredPasswords.map((item) => {
                const isVisible = visiblePasswords.includes(item.id);
                return (
                  <article
                    className="password-card"
                    key={item.id}
                    role="listitem"
                  >
                    <div className="site-mark" aria-hidden="true">
                      {item.site
                        .replace(/^https?:\/\//, "")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="entry-main">
                      <a
                        className="entry-site"
                        href={
                          /^https?:\/\//i.test(item.site)
                            ? item.site
                            : `https://${item.site}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.site}
                      </a>
                      <span className="entry-username">{item.username}</span>
                    </div>
                    <div className="entry-password">
                      <span
                        aria-label={
                          isVisible ? "Password visible" : "Password hidden"
                        }
                      >
                        {isVisible ? item.password : "••••••••••"}
                      </span>
                      <button
                        className="icon-button visibility-button"
                        type="button"
                        onClick={() => toggleVisibility(item.id)}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="entry-actions">
                      <button
                        className="icon-button copy-button"
                        type="button"
                        onClick={() => copyValue(item.site, item.id, "site")}
                        aria-label="Copy website"
                      >
                        {copiedId === `${item.id}:site`
                          ? "Copied site"
                          : "Copy site"}
                      </button>
                      <button
                        className="icon-button copy-button"
                        type="button"
                        onClick={() =>
                          copyValue(item.username, item.id, "username")
                        }
                        aria-label="Copy username"
                      >
                        {copiedId === `${item.id}:username`
                          ? "Copied user"
                          : "Copy user"}
                      </button>
                      <button
                        className="icon-button copy-button"
                        type="button"
                        onClick={() =>
                          copyValue(item.password, item.id, "password")
                        }
                        aria-label="Copy password"
                      >
                        <img
                          src={
                            copiedId === `${item.id}:password`
                              ? copiedIcon
                              : copyIcon
                          }
                          alt=""
                        />
                        {copiedId === `${item.id}:password`
                          ? "Copied"
                          : "Copy pass"}
                      </button>
                      <button
                        className="icon-button delete-button"
                        type="button"
                        onClick={() => deletePassword(item.id)}
                        aria-label={`Delete ${item.site}`}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <p className="privacy-note">
          <span aria-hidden="true">ⓘ</span> This demo stores passwords in this
          browser only. It does not encrypt or sync them.
        </p>
      </section>
    </main>
  );
};

export default PasswordManager;
