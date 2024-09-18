import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// import mysql from 'mysql';

dotenv.config();


// var connection = mysql.createConnection({
//   host: "chetchat.c1c4c2qi21s9.ap-northeast-2.rds.amazonaws.com",
//   user: "chetchat",
//   password: "dodoyeop02",
//   // port: process.env.RDS_PORT
// });

// connection.connect(function (err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }

//   console.log('Connected to database.');
// });

const options = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  port: process.env.RDS_PORT,
}

const pool = mysql.createPool(options);


pool.on('error', (err) => {
  console.error('MySQL pool error: ', err);
});

export default pool;