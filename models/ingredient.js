module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    'Ingredient',
    {
      ingredient: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      tableName: 'ingredients',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  )

  Ingredient.associate = (db) => {
    db.Ingredient.belongsTo(db.Post, { onDelete: 'cascade' })
  }

  return Ingredient
}
