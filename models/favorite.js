module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {

    }, {
        tableName: 'favorites',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Favorite.associate = (db) => {
        db.Favorite.belongsTo(db.User);
        db.Favorite.belongsTo(db.Post);
    };

    return Favorite;
}