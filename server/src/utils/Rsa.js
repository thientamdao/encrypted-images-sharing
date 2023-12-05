const httpStatus = require('http-status')
const ApiError = require('./ApiError')

function powerMod(base, exponent, modulus) {
  if (modulus === 1) return 0
  var result = 1
  base = base % modulus
  while (exponent > 0) {
    if (exponent % 2 === 1) result = (result * base) % modulus
    exponent = exponent >> 1
    base = (base * base) % modulus
  }
  return result
}

// return 2^4 < number < 2^8
const str2Num = (str) => {
  const bytes = new TextEncoder().encode(str)
  let result = 0

  for (byte of bytes) {
    result += byte
    if (result > 2 ** 8) {
      result -= byte
    }
  }

  if (result > 2 ** 8) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Generate p/q too large')
  else if (result < 2 ** 4) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Generate p/q too small')

  return result
}

const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false
  }
  return num > 1
}

const gcd = (a, b) => {
  if (!b) return a
  return gcd(b, a % b)
}

const modInverse = (a, m) => {
  let m0 = m
  let y = 0
  let x = 1

  if (m == 1) return 0

  while (a > 1) {
    let q = parseInt(a / m)
    let t = m

    m = a % m
    a = t
    t = y

    y = x - q * y
    x = t
  }

  if (x < 0) x += m0
  return x
}

class Rsa {
  // Constructor
  constructor(salt, e) {
    if (salt !== undefined) {
      const pLen = salt.length / 2
      let p = str2Num(salt.substring(0, pLen))
      let q = str2Num(salt.substring(pLen))
      while (!isPrime(p)) p += 1
      while (!isPrime(q) || p === q) q += 1

      this.n = p * q
      if (this.n > 2 ** 16) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Generate n too large')

      const f = (p - 1) * (q - 1)

      if (e === undefined) {
        while (true) {
          this.e = Math.floor(Math.random() * (f - 2)) + 2
          if (gcd(this.e, f) === 1) break
        }
      } else {
        this.e = e
      }

      this.d = modInverse(this.e, f)
    }
  }

  // Getter - Setter
  getPublicKey() {
    return `${this.e}&${this.n}`
  }

  // Method
  decrypt(value) {
    const result = []
    const skip = value.length / 8

    for (let i = 0; i < value.length; i++) {
      const index = 8 * (i % skip) + 2 * Math.floor(i / skip)
      result[i] = powerMod(value[index] * 2 ** 8 + value[index + 1], this.d, this.n)
    }

    return result
  }

  encryptByKey(value, publicKey) {
    const e = publicKey.split('&')[0]
    const n = publicKey.split('&')[1]

    const result = []
    const skip = value.length / 4

    for (let i = 0; i < value.length; i++) {
      const cipher = powerMod(value[i], e, n)
      const index = 8 * (i % skip) + 2 * Math.floor(i / skip)
      result[index] = cipher >> 8
      result[index + 1] = cipher - result[index] * 2 ** 8
    }

    return result
  }
}

module.exports = Rsa
