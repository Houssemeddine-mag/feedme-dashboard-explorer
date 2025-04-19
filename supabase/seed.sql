
-- Clear existing tables
DELETE FROM users;

-- Insert demo users
INSERT INTO users (id, username, email, password_hash, role, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'admin', 'admin@feedme.com', 'admin', 'admin', now(), now()),
  (gen_random_uuid(), 'chef', 'chef@feedme.com', 'chef', 'chef', now(), now()),
  (gen_random_uuid(), 'director', 'director@feedme.com', 'director', 'director', now(), now()),
  (gen_random_uuid(), 'cashier', 'cashier@feedme.com', 'cashier', 'cashier', now(), now());
