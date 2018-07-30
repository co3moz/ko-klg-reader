const fse = require('fs-extra');

module.exports = async function (file, out) {
  const fd = await fse.open(file, 'r');

  while (true) {
    let num = Buffer.allocUnsafe(4);

    if ((await fse.read(fd, num, 0, 4)).bytesRead != 4) break;

    num = num.readInt32LE(0);

    if (num > 0x8000) {
      throw new Exception('String is too long to decompile: ' + num);
    }

    let data = Buffer.allocUnsafe(num);

    if ((await fse.read(fd, data, 0, num)).bytesRead != num) break;

    let v = 0x816;

    for (let i = 0; i < num; i++) {
      let a = data[i];

      let z = (v & 0xff00) >>> 8;
      let b = (z ^ a) & 0xFF;
      v = (((((a + v) & 0xffff) * 0x6081) & 0xffff) + 0x1608) & 0xffff;

      data[i] = b;
    }

    if (out) {
      out(data);
    } else {
      process.stdout.write(data);
    }
  }

  await fse.close(fd);
}