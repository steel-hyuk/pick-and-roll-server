module.exports = (sequelize, DataTypes) => {
    const Easyscore = sequelize.define('Easyscore', {
        score: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'easyscores',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Easyscore.associate = (db) => {
        db.Easyscore.belongsTo(db.Post);
        db.Easyscore.belongsTo(db.User);
    };

    return Easyscore;
}