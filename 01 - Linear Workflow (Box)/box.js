const Box = x =>
    ({
        inspect: () => `Box(${x})`,
        map: f => Box(f(x)),
        fold: f => f(x)
    })

const nextCharforNumberString = str =>
    Box(str)
        .map(s => s.trim())
        .map(r => new Number(r))
        .map(i => i + 1)
        .map(i => String.fromCharCode(i))
        .map(i => i.toLowerCase())
        .fold(c => c.toLowerCase())

const result = nextCharforNumberString(' 64')

console.log(result)
