CREATE TABLE IF NOT EXISTS `users`
(
    id       int(11)     NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(50) NOT NULL,
    created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO `users` (username, password)
VALUES ('username', 'password');

CREATE TABLE IF NOT EXISTS `games`
(
    id          int(11)      NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title       varchar(50)  NOT NULL UNIQUE,
    price       numeric(50)  NOT NULL,
    description varchar(500) NOT NULL,
    category    varchar(50)  NOT NULL,
    device      varchar(50)  NOT NULL,
    imageName   varchar(50)  NOT NULL,
    slide       boolean      NOT NULL DEFAULT FALSE,
    cpu         varchar(255),
    ram         varchar(255),
    gpu         varchar(255),
    hdd         varchar(255),
    created     TIMESTAMP             DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `cart`
(
    id       int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id  int(11) NOT NULL,
    game_id  int(11) NOT NULL,
    quantity int(50) NOT NULL DEFAULT 1,
    created  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `users` (id),
    FOREIGN KEY (game_id) REFERENCES `games` (id),
    UNIQUE KEY `user_game_unique` (`user_id`,`game_id`)
);


INSERT INTO `cart` (user_id, game_id)
VALUES (1, 1);


INSERT INTO `games` (title, price, description, category, device, imageName, cpu, ram, gpu, hdd)
VALUES ('Batman Arkham City', 1199,
        'Batman: Arkham City е акција-авантуристичка игра, развиенa од Rocksteady Studios и објавена од Warner Bros. Interactive Entertainment. Врз основа на суперхеројот DC Comics, Batman, тоа е продолжение на видео-играта Batman 2009: Arkham Asylum и втората рата во серијалот Batman: Arkham.',
        'Акција', 'Компјутер', 'BatmanArkhamCity.jpg',
        'Intel Core 2 Duo 2.4 GHz or AMD Athlon X2 4800+', '8 GB',
        'ATI 3850HD 512 MB or NVIDIA GeForce 8800 GT 512MB or Intel HD Graphics 2000',
        '17 GB Available Hard Drive Space');

INSERT INTO `games` (title, price, description, category, device, imageName)
VALUES ('Cyberpunk 2077', 3899,
        'Cyberpunk 2077 е претстојна видео-игра со улоги, развиена и објавена од CD Project. Предвидено е да биде објавено за PlayStation 4, Windows и Xbox One во ноември 2020 година, Stadia до крајот на годината и PlayStation 5 и Xbox Series X во 2021 година.',
        'Авантура', 'Play Station', 'Cyberpunk-2077.jpg');

INSERT INTO `games` (title, price, description, category, device, imageName)
VALUES ('C&C3: Kane''s Wrath', 999,
        'Command & Conquer 3: Kane''s Wrath е експанзија пакет за видео игри стратегија во реално време од 2007 година Command & Conquer 3: Tiberium Wars',
        'Стратегија', 'Xbox', 'KanesWrath.jpg');

INSERT INTO `games` (title, price, description, category, device, imageName, slide, cpu, ram, gpu, hdd)
VALUES ('Far Cry Primal', 1799,
        'Со Far Cry Primal, инвеститорот Ubisoft ги напушта сите политички претензии и се фокусира на она што го натера да се издвојува од своите врсници. Играте како ловец на каменa доба по име Такар, а целта ви е да обезбедите засолниште за вашиот народ, племе по име Wenja, во праисториското царство на Орос.',
        'Акција', 'Компјутер', 'FarCryPrimal.jpg', true,
        'Intel Core i3-550 | AMD Phenom II X4 955', '4 GB', 'Nvidia GeForce GTX 460',
        '20 GB Available Hard Drive Space');

INSERT INTO `games` (title, price, description, category, device, imageName, slide)
VALUES ('Grand Theft Auto V', 3199,
        'Grand Theft Auto V е игра со акционо авантуристички дух што се игра од трето лице или од прва перспектива. Играчите завршуваат мисии - линеарни сценарија со поставени цели - да напредуваат низ приказната. Надвор од мисиите, играчите можат слободно да шетаат низ отворениот свет.',
        'Акција', 'Play Station', 'GrandTheftAutoV.png', true);

INSERT INTO `games` (title, price, description, category, device, imageName, slide, cpu, ram, gpu, hdd)
VALUES ('The Walking Dead', 2399,
        'The Walking Dead е епизодна, графичка серија за авантуристички игри, развиена и објавена од Telltale Games и Skybound Games, базирана на серијалот за стрипови The Walking Dead',
        'Авантура', 'Компјутер', 'TheWalkingDead.jpeg', true,
        '2.0 GHz Pentium 4', '3 GB', 'ATI or NVidia card w/ 512 MB RAM',
        '2 GB Available Hard Drive Space');
