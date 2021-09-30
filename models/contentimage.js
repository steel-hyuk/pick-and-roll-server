module.exports = (sequelize, DataTypes) => {
    const Contentimage = sequelize.define('Contentimage', {
        src: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    }, {
        tableName: 'contentimgs',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Contentimage.associate = (db) => {
        db.Contentimage.belongsTo(db.Post, { onDelete: 'cascade' });
    };

    return Contentimage;
}