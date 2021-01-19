-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2019 a las 17:10:03
-- Versión del servidor: 10.1.31-MariaDB
-- Versión de PHP: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aw_usuarios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigo`
--

CREATE TABLE `amigo` (
  `usuarioAid` int(11) NOT NULL,
  `usuarioBid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigo`
--

INSERT INTO `amigo` (`usuarioAid`, `usuarioBid`) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opcion`
--

CREATE TABLE `opcion` (
  `idPregunta` int(11) NOT NULL,
  `idOpcion` int(11) NOT NULL,
  `textoOpcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `opcion`
--

INSERT INTO `opcion` (`idPregunta`, `idOpcion`, `textoOpcion`) VALUES
(1, 0, 'verde'),
(1, 1, 'verde'),
(2, 0, 'verde');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peticion`
--

CREATE TABLE `peticion` (
  `idOrigen` int(11) NOT NULL,
  `idDestino` int(11) NOT NULL,
  `estado` enum('aceptada','rechazada','pendiente') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `peticion`
--

INSERT INTO `peticion` (`idOrigen`, `idDestino`, `estado`) VALUES
(1, 3, 'aceptada'),
(1, 4, 'pendiente'),
(1, 5, 'pendiente'),
(1, 6, 'pendiente'),
(2, 1, 'aceptada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `creador` int(11) NOT NULL,
  `pregunta` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `creador`, `pregunta`) VALUES
(1, 1, '¿De que color es el agua?'),
(2, 1, '¿Cuantos meses tienen 28 dias?'),
(3, 1, '¿cual es la capital de Noruega?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `usuario` int(11) NOT NULL,
  `imagen` mediumblob NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `publicaciones`

--
-- Disparadores `publicaciones`
--
DELIMITER $$
CREATE TRIGGER `restarPuntos` AFTER INSERT ON `publicaciones` FOR EACH ROW BEGIN
update usuario set puntos=puntos-100 where id=NEW.usuario;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `preguntaId` int(11) NOT NULL,
  `respuesta` int(11) NOT NULL,
  `quienResponde` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id`, `preguntaId`, `respuesta`, `quienResponde`) VALUES
(3, 1, 1, 1),
(8, 2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestaamigos`
--

CREATE TABLE `respuestaamigos` (
  `id` int(11) NOT NULL,
  `idPregunta` int(11) NOT NULL,
  `idAdivinador` int(11) NOT NULL,
  `idUsuarioAdivinar` int(11) NOT NULL,
  `adivinado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuestaamigos`
--

INSERT INTO `respuestaamigos` (`id`, `idPregunta`, `idAdivinador`, `idUsuarioAdivinar`, `adivinado`) VALUES
(1, 1, 1, 2, 1),
(2, 6, 1, 12, 0),
(11, 10, 1, 2, 1),
(18, 2, 1, 12, 0);

--
-- Disparadores `respuestaamigos`
--
DELIMITER $$
CREATE TRIGGER `aumentarPuntos` BEFORE INSERT ON `respuestaamigos` FOR EACH ROW BEGIN
if NEW.adivinado = 1 then
update usuario set puntos=puntos+50 where id=NEW.idAdivinador;
end if;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `sexo` enum('hombre','mujer') NOT NULL,
  `fecha_nac` date NOT NULL,
  `imagen` mediumblob,
  `puntos` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `contrasena`, `nombre`, `sexo`, `fecha_nac`, `imagen`, `puntos`) VALUES
(1, 'usuario@gmail.com', '1234', 'usuario1', 'hombre', '1998-11-04', NULL, 0),
(2, 'usuario0@gmail.com', '1234', 'usuario2', 'hombre', '1998-11-04', NULL, 64),
(3, 'usuario1@gmail.com', '1234', 'usuario1', 'hombre', '1998-11-04', NULL, 0),
(4, 'usuario2@gmail.com', '1234', 'usuario2', 'hombre', '1998-11-04', NULL, 64),
(5, 'usuario3@gmail.com', '1234', 'usuario3', 'hombre', '1998-11-04', NULL, 128),
(6, 'usuario4@gmail.com', '1234', 'usuario4', 'hombre', '1998-11-04', NULL, 500),
(7, 'usuario5@gmail.com', '1234', 'usuario5', 'hombre', '1998-11-04', NULL, 12),
(8, 'usuario6@gmail.com', '1234', 'usuario6', 'mujer', '1998-11-04', NULL, 500),
(12, 'usuario10@gmail.com', '1234', 'jose', 'mujer', '2019-11-01', NULL, 50);
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigo`
--
ALTER TABLE `amigo`
  ADD PRIMARY KEY (`usuarioAid`,`usuarioBid`),
  ADD KEY `usuarioBid` (`usuarioBid`);

--
-- Indices de la tabla `opcion`
--
ALTER TABLE `opcion`
  ADD PRIMARY KEY (`idPregunta`,`idOpcion`);

--
-- Indices de la tabla `peticion`
--
ALTER TABLE `peticion`
  ADD PRIMARY KEY (`idOrigen`,`idDestino`),
  ADD KEY `idDestino` (`idDestino`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creador` (`creador`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD KEY `usuario` (`usuario`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quienResponde` (`quienResponde`),
  ADD KEY `preguntaId` (`preguntaId`,`respuesta`);

--
-- Indices de la tabla `respuestaamigos`
--
ALTER TABLE `respuestaamigos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPregunta` (`idPregunta`),
  ADD KEY `idUsuarioAdivinar` (`idUsuarioAdivinar`),
  ADD KEY `idAdivinador` (`idAdivinador`,`idUsuarioAdivinar`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `respuestaamigos`
--
ALTER TABLE `respuestaamigos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigo`
--
ALTER TABLE `amigo`
  ADD CONSTRAINT `amigo_ibfk_1` FOREIGN KEY (`usuarioAid`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `amigo_ibfk_2` FOREIGN KEY (`usuarioBid`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `opcion`
--
ALTER TABLE `opcion`
  ADD CONSTRAINT `opcion_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`);

--
-- Filtros para la tabla `peticion`
--
ALTER TABLE `peticion`
  ADD CONSTRAINT `peticion_ibfk_1` FOREIGN KEY (`idDestino`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `peticion_ibfk_2` FOREIGN KEY (`idOrigen`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`creador`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_2` FOREIGN KEY (`quienResponde`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `respuesta_ibfk_3` FOREIGN KEY (`preguntaId`,`respuesta`) REFERENCES `opcion` (`idPregunta`, `idOpcion`);

--
-- Filtros para la tabla `respuestaamigos`
--
ALTER TABLE `respuestaamigos`
  ADD CONSTRAINT `respuestaamigos_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `respuestaamigos_ibfk_2` FOREIGN KEY (`idAdivinador`,`idUsuarioAdivinar`) REFERENCES `amigo` (`usuarioAid`, `usuarioBid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
