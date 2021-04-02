CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    practice_id INTEGER
    REFERENCES user_practice(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
    REFERENCES mana_users(id) ON DELETE CASCADE NOT NULL
);