CREATE TABLE register(id INTEGER PRIMARY KEY AUTOINCREMENT , name TEXT UNIQUE , password TEXT );

INSERT INTO register(id , name , password)
VALUES
(2 , 'hanuman' , 'hanuman@2024'),
(3 , 'vikram' , 'vikram@2024'),
(4 , 'preethi' , 'preethi@2024'),
(5 , 'venkatrao' , 'venkatrao@2024'),
(6 , 'srinu' , 'srinu@2024');

SELECT * FROM register;

-- DELETE from register
-- where id = 2;

DROP TABLE register