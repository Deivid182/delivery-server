CREATE DATABASE IF NOT EXISTS DELIVERY;

USE DELIVERY;

CREATE TABLE `delivery-app`.`users`(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `image` VARCHAR(255) NULL,
    `password` VARCHAR(90) NOT NULL,
    `createdAt` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`)
)

DESCRIBE users;

CREATE TABLE `delivery-app`.roles (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(40) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(90) NOT NULL,
    createdAt TIMESTAMP (0) NOT NULL,
    updatedAt TIMESTAMP (0) NOT NULL
);

INSERT INTO roles(
	name, route, createdAt, updatedAt
) VALUES('RESTAURANT', '/restaurant/orders/list', '2023-11-27', '2023-11-27');

INSERT INTO roles(
	name, route, createdAt, updatedAt
) VALUES('DELIVER', '/delivery/orders/list', '2023-11-27', '2023-11-27');

INSERT INTO roles(
	name, route, createdAt, updatedAt
) VALUES('CLIENT', '/client/products/list', '2023-11-27', '2023-11-27');

CREATE TABLE user_has_roles(
	userId BIGINT NOT NULL,
    roleId BIGINT NOT NULL,
    createdAt TIMESTAMP (0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP (0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (userId, roleId)
);


SELECT u.id, u.email, u.firstName, u.lastName, u.image, u.phone,
    JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'name', r.name, 'image', r.image, 'route', r.route)) AS roles
    FROM users AS u
INNER JOIN user_has_roles AS uhr ON uhr.userId = u.id
INNER JOIN roles AS r ON uhr.roleId = r.id
WHERE u.email = 'dave@gmail.com';

INSERT INTO `user_has_roles` (`userId`, `roleId`, `createdAt`, `updatedAt`) VALUES ('1', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), ('1', '2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    createdAt TIMESTAMP (0) NOT NULL,
    updatedAt TIMESTAMP (0) NOT NULL
);