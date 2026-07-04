(function () {
  'use strict';

  const canvas = document.getElementById('callCanvas');
  const ctx = canvas.getContext('2d');
  const downloadLink = document.getElementById('downloadLink');

  const baseImage = new Image();
  baseImage.src = 'images/iPhone Call log.png';

  let imageLoaded = false;
  let fontsLoaded = false;

  function formatPhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    }
    return value;
  }

  function setDefaults() {
    const now = new Date();
    const timeInput = document.getElementById('time');
    if (timeInput && !timeInput.value) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeInput.value = hours + ':' + minutes;
    }

    const dateInput = document.getElementById('text2');
    if (dateInput && !dateInput.value) {
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      dateInput.value = year + '年' + month + '月' + day + '日';
    }
  }

  function draw() {
    const width = baseImage.naturalWidth || 828;
    const height = baseImage.naturalHeight || 1792;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(baseImage, 0, 0, width, height);

    const fontFamily = '"PingFang", "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    const time = document.getElementById('time').value || '';
    const battery = parseInt(document.getElementById('battery').value || '80', 10);
    const phone = formatPhone(document.getElementById('phone').value);
    const region = document.getElementById('text1').value || '';
    const date = document.getElementById('text2').value || '';
    const callType = document.getElementById('text3').value || '';
    const duration = document.getElementById('text4').value || '';

    // 电量
    const batteryX1 = 745;
    const batteryY1 = 41;
    const batteryX2 = Math.round(745 + ((battery - 1) * (784 - 745) / (100 - 1)));
    const batteryY2 = 57;
    ctx.fillStyle = battery < 21 ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)';
    ctx.fillRect(batteryX1, batteryY1, batteryX2 - batteryX1, batteryY2 - batteryY1);

    // 时间
    ctx.font = '30px ' + fontFamily;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText(time, 65, 61);

    // 电话号码（居中）
    ctx.font = '49px ' + fontFamily;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    const phoneWidth = ctx.measureText(phone).width;
    ctx.fillText(phone, (width - phoneWidth) / 2, 414);

    // 地区（居中）
    ctx.font = '27px ' + fontFamily;
    ctx.fillStyle = 'rgb(112, 112, 112)';
    const regionWidth = ctx.measureText(region).width;
    ctx.fillText(region, (width - regionWidth) / 2, 464);

    // 日期
    ctx.font = '30px ' + fontFamily;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText(date, 56, 750);

    // 通话方式
    ctx.font = '29px ' + fontFamily;
    ctx.fillText(callType, 56, 809);

    // 通话时长，与“去电”左对齐
    let durationX = 205;
    const qudianIndex = callType.indexOf('去电');
    if (qudianIndex >= 0) {
      const prefix = callType.substring(0, qudianIndex);
      durationX = 56 + ctx.measureText(prefix).width;
    }
    ctx.font = '28px ' + fontFamily;
    ctx.fillStyle = 'rgb(138, 138, 141)';
    ctx.fillText(duration, durationX, 849);

    if (downloadLink) {
      downloadLink.href = canvas.toDataURL('image/png');
    }
  }

  function tryDraw() {
    if (imageLoaded && fontsLoaded) {
      setDefaults();
      draw();
    }
  }

  baseImage.onload = function () {
    imageLoaded = true;
    tryDraw();
  };

  // 显式加载自定义字体，避免绘制时字体未就绪
  function loadCustomFonts() {
    return Promise.all([
      document.fonts.load('30px "PingFang"'),
      document.fonts.load('49px "PingFang"')
    ]);
  }

  loadCustomFonts().then(function () {
    fontsLoaded = true;
    tryDraw();
  });

  // 兜底：即使字体加载失败/超时，也保证页面能绘制
  setTimeout(function () {
    if (!fontsLoaded) {
      fontsLoaded = true;
      tryDraw();
    }
  }, 2000);

  document.getElementById('refreshButton').addEventListener('click', function () {
    setDefaults();
    draw();
  });

  const inputs = document.querySelectorAll('#myForm input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', draw);
  }
})();
