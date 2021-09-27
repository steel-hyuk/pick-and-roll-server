module.exports = (sequelize, DataTypes) => {
    const Contentimage = sequelize.define('Contentimage', {
        src: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Contentimage.associate = (db) => {
        db.Contentimage.belongsTo(db.Post);
    };

    return Contentimage;
}