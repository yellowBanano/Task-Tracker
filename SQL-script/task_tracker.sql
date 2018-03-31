CREATE DATABASE task_tracker;
USE task_tracker;
# DROP DATABASE task_tracker;

CREATE TABLE users (
  id         BIGINT AUTO_INCREMENT,
  email      VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  first_name VARCHAR(50)  NOT NULL,
  last_name  VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE developers (
  id_user BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (id_user),
  FOREIGN KEY (id_user) REFERENCES users (id)
);

CREATE TABLE managers (
  id_user BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (id_user),
  FOREIGN KEY (id_user) REFERENCES users (id)
);

CREATE TABLE projects (
  id         BIGINT AUTO_INCREMENT,
  id_manager BIGINT       NOT NULL,
  title      VARCHAR(100) NOT NULL UNIQUE,
  status     VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_manager) REFERENCES managers (id_user)
);

CREATE TABLE project_developer (
  id_project   BIGINT NOT NULL,
  id_developer BIGINT NOT NULL,
  PRIMARY KEY (id_project, id_developer),
  FOREIGN KEY (id_project) REFERENCES projects (id),
  FOREIGN KEY (id_developer) REFERENCES developers (id_user)
);

CREATE TABLE tasks (
  id           BIGINT AUTO_INCREMENT,
  id_project   BIGINT       NOT NULL,
  id_developer BIGINT,
  description  VARCHAR(100) NOT NULL,
  status       VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_project) REFERENCES projects (id),
  FOREIGN KEY (id_developer) REFERENCES developers (id_user)
);

CREATE TABLE comments (
  id        BIGINT AUTO_INCREMENT,
  id_task   BIGINT,
  id_user   BIGINT,
#   version   BIGINT,
  text      VARCHAR(300) NOT NULL,
  post_time DATETIME     NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_task) REFERENCES tasks (id),
  FOREIGN KEY (id_user) REFERENCES users (id)
);


INSERT INTO users (email, password, first_name, last_name) VALUES ('email1@hot.co', 'password', 'Marianne', 'Hanson');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email2@hot.co', 'password', 'Adam', 'Perkins');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email3@hot.co', 'password', 'Jeffrey', 'Stevens');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email4@hot.co', 'password', 'Julio', 'Chapman');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email5@hot.co', 'password', 'Evelyn', 'Griffith');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email6@hot.co', 'password', 'Hope', 'Adams');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email7@hot.co', 'password', 'Cecelia', 'Hill');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email8@hot.co', 'password', 'Santos', 'Neal');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email9@hot.co', 'password', 'Maggie', 'Estrada');
INSERT INTO users (email, password, first_name, last_name) VALUES ('email10@hot.co', 'password', 'Nancy', 'Armstrong');

INSERT INTO developers (id_user) VALUES (1);
INSERT INTO developers (id_user) VALUES (2);
INSERT INTO developers (id_user) VALUES (3);
INSERT INTO developers (id_user) VALUES (4);
INSERT INTO developers (id_user) VALUES (5);
INSERT INTO developers (id_user) VALUES (6);

INSERT INTO managers (id_user) VALUES (7);
INSERT INTO managers (id_user) VALUES (8);
INSERT INTO managers (id_user) VALUES (9);
INSERT INTO managers (id_user) VALUES (10);

INSERT INTO projects (id_manager, title, status) VALUES (7, 'Here Is A Quick Cure For Table', 'WAITING');
INSERT INTO projects (id_manager, title, status) VALUES (7, 'Master (Your) Table in 5 Minutes A Day', 'WAITING');
INSERT INTO projects (id_manager, title, status) VALUES (7, '11 Methods Of Table Domination', 'WAITING');
INSERT INTO projects (id_manager, title, status)
VALUES (8, 'Now You Can Buy An App That is Really Made For Table', 'WAITING');
INSERT INTO projects (id_manager, title, status) VALUES (8, 'Rules Not To Follow About Table', 'WAITING');
INSERT INTO projects (id_manager, title, status)
VALUES (9, 'Use Table To Make Someone Fall In Love With You', 'WAITING');
INSERT INTO projects (id_manager, title, status) VALUES (10, 'Table Iphone Apps', 'WAITING');

INSERT INTO project_developer (id_project, id_developer) VALUES (1, 1);
INSERT INTO project_developer (id_project, id_developer) VALUES (2, 2);
INSERT INTO project_developer (id_project, id_developer) VALUES (3, 3);
INSERT INTO project_developer (id_project, id_developer) VALUES (4, 4);
INSERT INTO project_developer (id_project, id_developer) VALUES (5, 5);
INSERT INTO project_developer (id_project, id_developer) VALUES (6, 6);

INSERT INTO tasks (id_project, id_developer, description, status)
VALUES (1, 1, 'What You Can Learn From Bill Gates About Description', 'WAITING');
INSERT INTO tasks (id_project, id_developer, description, status)
VALUES (2, 2, 'Here Is A Method That Is Helping Description', 'WAITING');
INSERT INTO tasks (id_project, id_developer, description, status)
VALUES (3, 3, 'Is Description Worth [$] To You?', 'WAITING');
INSERT INTO tasks (id_project, id_developer, description, status)
VALUES (4, 4, 'Believe In Your Description Skills But Never Stop Improving', 'WAITING');

INSERT INTO comments (id_task, id_user, text, post_time) VALUES (1, 1, 'Fast-Track Your Text', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (1, 2, 'Text Strategies For Beginners', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time) VALUES (1, 3, 'Cracking The Text Code', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (1, 4, 'Congratulations! Your Text Is (Are) About To Stop Being Relevant', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (2, 1, 'The Next 3 Things To Immediately Do About Text', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (2, 5, 'Are You Embarrassed By Your Text Skills? Here''s What To Do', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (2, 6, '9 Ridiculous Rules About Text', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (3, 7, 'How To Make Your Text Look Amazing In 5 Days', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (3, 8, 'Succeed With Text In 24 Hours', '2018-03-23 19:50:58');
INSERT INTO comments (id_task, id_user, text, post_time)
VALUES (4, 8, 'Here Is What You Should Do For Your Text', '2018-03-23 19:50:58');