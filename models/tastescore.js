module.exports = (sequelize, DataTypes) => {
  const Tastescore = sequelize.define(
    'Tastescore',
    {
      score: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      tableName: 'tastescores',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  )

  Tastescore.associate = (db) => {
    db.Tastescore.belongsTo(db.Post, { onDelete: 'cascade' })
    db.Tastescore.belongsTo(db.User)
  }

  return Tastescore
}
