/**
金币抛出来的动画
 */
export const genClips = () => {
  let $t = $('.item1');
  var amount = 5;
  var width = $t.width() / amount;
  var height = $t.height() / amount;
  var totalSquares = Math.pow(amount, 2);
  var y = 0;
  var index = 1;
  for (var z = 0; z <= (amount * width) ; z = z + width) {
    $('<img class="clipped" src="../../../static/img/jb/jb' + index + '.png" />').appendTo($('.item1 .clipped-box'));
    if (z === (amount * width) - width) {
      y = y + height;
      z = -width;
    }
    if (index >= 5) {
      index = 1;
    }
    index++;
    if (y === (amount * height)) {
      z = 9999999;
    }
  }
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// On click
export const jbPao = (callback) => {
  var first = false,
    clicked = false;
  if (clicked === false) {
    $('.full').css({
      'display': 'none'
    });
    $('.empty').css({
      'display': 'inline-block'
    });
    clicked = true;

    $('.item1 .clipped-box').css({
      'display': 'inline-block'
    });
    $('.clipped-box img').each(function () {
      var v = rand(120, 90),
        angle = rand(80, 89),
        theta = (angle * Math.PI) / 180,
        g = -9.8;

      // $(this) as self
      var self = $(this);
      var t = 0,z, nx, ny,totalt =10;
      var negate = [1, -1, 0],
        direction = negate[Math.floor(Math.random() * negate.length)];

      var randDeg = rand(-5, 10),
        randScale = rand(0.9, 1.1),
        randDeg2 = rand(30, 5);

      // And apply those

      $(this).css({
        'transform': 'scale(' + randScale + ') skew(' + randDeg + 'deg) rotateZ(' + randDeg2 + 'deg)'
      });

      // Set an interval
      z = setInterval(function () {
        var ux = (Math.cos(theta) * v) * direction;
        var uy = (Math.sin(theta) * v) - ((-g) * t);
        nx = (ux * t);
        ny = (uy * t) + (0.25 * (g) * Math.pow(t, 2));
        if (ny < -40) {
          ny = -40;
        }
        //$("#html").html("g:" + g + "bottom:" + ny + "left:" + nx + "direction:" + direction);
        $(self).css({
          'bottom': (ny) + 'px',
          'left': (nx) + 'px'
        });
        // Increase the time by 0.10
        t = t + 0.10;

        //跳出循环
        if (t > totalt) {
          clicked = false;
          first = true;
          clearInterval(z);
        }
      }, 20);
    });
  }
  let r = setInterval(function () {
    if (first === true) {
      $('.empty').addClass("Shake");//晃动空袋子
      //TODO:空袋子晃动几下 就弹出 奖项框
      first = false;
      if(callback){
        callback();
      }
    }
  }, 300);

}

//类似于购物车抛物线动画
export const pao_animate = (target,root) => {
  var cart = target;
  var imgtodrag = root;
  var inner_t = root.text();
  if (imgtodrag) {
    var imgclone = imgtodrag.clone().offset({
      top: imgtodrag.offset().top,
      left: imgtodrag.offset().left
    }).css({
      'opacity': '1',
      'position': 'absolute',
      'font-size': '26px',
      'z-index': '3000',
      'color':'#FA3847'
    }).appendTo($('body'))
      .text('+'+inner_t)
      .animate({
        'top': cart.offset().top-2,
        'left': cart.offset().left + cart.width()+2,
        'font-size': '18px',
      }, 600, 'easeInOutExpo');
    imgclone.animate({
      'font-size': '16px',
    }, function () {
      $(this).css({
        'top':'8px',
        'left':'auto',
        'z-index': '3000',
      })
      target.append($(this))
//                $(this).detach();
    });
  }
}
