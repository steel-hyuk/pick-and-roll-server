const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = require('./comment')(sequelize, Sequelize);
db.Contentimage = require('./contentimage')(sequelize, Sequelize);
db.Easyscore = require('./easyscore')(sequelize, Sequelize);
db.Favorite = require('./favorite')(sequelize, Sequelize);
db.Ingredient = require('./ingredient')(sequelize, Sequelize);
db.Mainimg = require('./mainimg')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Tastescore = require('./tastescore')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
