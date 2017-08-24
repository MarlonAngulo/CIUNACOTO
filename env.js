const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://estandar:programacion@ds157723.mlab.com:57723/ciunacoto';
  process.env.databaseName = 'production database: angular-2-app'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://estandar:programacion@ds157723.mlab.com:57723/ciunacoto';
  process.env.databaseName = 'development database: mean-angular-2'; // Database name__
}
