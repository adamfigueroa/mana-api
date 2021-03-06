CREATE TABLE user_practice (
    id SERIAL PRIMARY KEY,
    practice_name TEXT NOT NULL,
    days_to_track INTEGER NOT NULL,
    date_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    day_of_week TEXT[],
    user_id INTEGER
    REFERENCES mana_users(id) ON DELETE CASCADE NOT NULL
);