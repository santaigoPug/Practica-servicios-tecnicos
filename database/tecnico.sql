CREATE DATABASE IF NOT EXISTS tecnico;
USE tecnico;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    especialidad VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(500) NOT NULL,
    cliente_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    estado ENUM('Pendiente', 'En proceso', 'Finalizado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_servicio_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_servicio_tecnico FOREIGN KEY (tecnico_id) REFERENCES tecnico(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT IGNORE INTO usuario (username, password) VALUES ('admin', '12345');
INSERT IGNORE INTO usuario (username, password) VALUES ('alumno', '2026');

SELECT id, username FROM usuario;
