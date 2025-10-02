CREATE TABLE IF NOT EXISTS auth (
    id TEXT PRIMARY KEY, -- agora aceita "creds", "keys", etc.
    data TEXT NOT NULL -- JSON stringificado
);