use edm_db;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(400)
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    name Varchar(150),
    description VARCHAR(500),
    priority  bool,
    user_id INTEGER REFERENCES users(id)
);

INSERT INTO users(name, lastname) VALUES
('Agustin', 'Parra'),
('Mauricio', 'Parra');

INSERT INTO tasks (name, description, priority, user_id) VALUES
('Task of Agustin', 'This is the description', true, 1),
('Task of Mauricio', 'This is the description', true, 1)