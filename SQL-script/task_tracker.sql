CREATE DATABASE task_tracker;
USE task_tracker;
# DROP DATABASE task_tracker;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE developers (
  id BIGINT AUTO_INCREMENT,
  id_user BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users (id)
);

CREATE TABLE managers (
  id BIGINT AUTO_INCREMENT,
  id_user BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users (id)
);

CREATE TABLE projects (
  id BIGINT AUTO_INCREMENT,
  id_manager BIGINT NOT NULL,
  title VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_manager) REFERENCES managers (id)
);

CREATE TABLE project_developer (
  id_project BIGINT NOT NULL,
  id_developer BIGINT NOT NULL,
  PRIMARY KEY (id_project, id_developer),
  FOREIGN KEY (id_project) REFERENCES projects (id),
  FOREIGN KEY (id_developer) REFERENCES developers (id)
);

CREATE TABLE tasks (
  id BIGINT AUTO_INCREMENT,
  id_project BIGINT NOT NULL,
  id_developer BIGINT,
  description VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_project) REFERENCES projects (id),
  FOREIGN KEY (id_developer) REFERENCES developers (id)
);

CREATE TABLE comments (
  id BIGINT AUTO_INCREMENT,
  id_task BIGINT NOT NULL,
  id_user BIGINT NOT NULL,
  text VARCHAR(300) NOT NULL,
  post_time DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_task) REFERENCES tasks (id),
  FOREIGN KEY (id_user) REFERENCES users (id)
);