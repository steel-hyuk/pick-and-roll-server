module.exports = (sequelize, DataTypes) => {
  const Mainimg = sequelize.define(
    'Mainimg',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    },
    {
      tableName: 'mainimgs',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  )

  Mainimg.associate = (db) => {
    db.Mainimg.belongsTo(db.Post, { onDelete: 'cascade' })
  }

  return Mainimg
}
