create database accuweather;
use accuweather;

create table Consultas(
id int primary key auto_increment,
fecha date not null,
pronostico varchar(255) not null,
temp_min decimal not null,
temp_max decimal not null,
grados varchar(1) not null,
fecha_consulta datetime not null
);