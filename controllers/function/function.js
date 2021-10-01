module.exports = {
    everyScoreSum: (arr) => {
        let sum = 0
        arr.map(el => sum += el.dataValues.score)
        return sum
    }
}