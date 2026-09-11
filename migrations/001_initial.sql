CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS questions (
  id BIGINT PRIMARY KEY,
  study_order INTEGER UNIQUE NOT NULL,
  difficulty TEXT NOT NULL,
  title TEXT NOT NULL,
  frequency NUMERIC NOT NULL DEFAULT 0,
  link TEXT NOT NULL,
  topics TEXT NOT NULL,
  study_topic TEXT NOT NULL,
  leetcode_number INTEGER
);
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unsolved' CHECK (status IN ('unsolved','in_progress','solved')),
  is_starred BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);
