exports.fmt = (t) => {
    return `${exports.round(t)}°`
}

exports.round = (t) => {
    return parseFloat(t).toFixed(1)
}