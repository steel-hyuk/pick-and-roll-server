module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING(30),
            allowNull: false, // 필수
            unique: true, //고유값
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        tableName: 'users',
        charset: 'utf8', // 한글 쓰려면 utf8 사용
        collate: 'utf8_general_ci',
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.hasMany(db.Easyscore);
        db.User.hasMany(db.Tastescore);
        db.User.hasMany(db.Favorite);
    };

    return User;
}