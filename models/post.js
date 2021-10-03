module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      introduction: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      requiredTime: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: 'posts',
      charset: 'utf8mb4', // 이모티콘 사용하려면 mb4
      collate: 'utf8mb4_general_ci'
    }
  )

  Post.associate = (db) => {
    db.Post.belongsTo(db.User)
    db.Post.hasMany(db.Comment)
    db.Post.hasMany(db.Easyscore)
    db.Post.hasMany(db.Tastescore)
    db.Post.hasMany(db.Ingredient)
    db.Post.hasMany(db.Contentimage)
    db.Post.hasMany(db.Favorite)
    db.Post.hasOne(db.Mainimg)
  }

  return Post
}
