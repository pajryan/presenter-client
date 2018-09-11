/*
  Note, I started with:
    https://github.com/OrangeXC/vue-coverflow

  But that library relies on fixed px for everythig.  I wanted a % based display.  So I modified it

  The original code is pretty mediocre, so this could be cleaned up significantly, but haven't done so yet.

  Also, note that the reflection doesn't work - not really sure why - seems like it won't work when both a -webkit-transform and z-index are defined.  It works in their demo: https://orangex_c.coding.me/vue-coverflow/ but I just can't get it going.
*/



var browserPrefix = ''

if (navigator.userAgent.indexOf('Firefox') !== -1) {
  browserPrefix = '-moz-'
} else if (navigator.userAgent.indexOf('Chrome') !== -1) {
  browserPrefix = '-webkit-'
} else if (navigator.userAgent.indexOf('Safari') !== -1) {
  browserPrefix = '-webkit-'
}

function setTransform3D (el, degree, perspective, z) {
  degree = Math.max(Math.min(degree, 90), -90)
  z -= 5
  el.style['-webkit-perspective'] = el.style['perspective'] = el.style['-moz-perspective'] = perspective + 'px'
  el.style['-webkit-transform'] = el.style['transform'] = 'rotateY(' + degree + 'deg) translateZ(' + z + 'px)'
}


function oneImgWidth(imgs){
  return 20;
  let percOfTotal = 100/imgs.length;
  console.log("IMAGE WIDTH", percOfTotal)
  if(percOfTotal<20){
    return 20;
  }
  if(percOfTotal>40){
    return 40
  }
}

function displayIndex (imgSize, spacing, left, imgs, index, flat, width, titleBox, vnode) {
  var mLeft = (width - imgSize) * 0.5 - spacing * (index + 1) - imgSize * 0.5

  // deal with the LEFT side
  for (var i = 0; i <= index; i++) {
    let indexFromCenter = index-i;
    spacing=-10;  //need to put this in % terms somehow
    let lftM = indexFromCenter*(oneImgWidth(imgs) + spacing) + (oneImgWidth(imgs)/2);
    imgs[i].style.marginLeft = -lftM + '%';
    imgs[i].style['-webkit-filter'] = 'brightness(0.7)'
    imgs[i].style.zIndex = i + 1
    imgs[i].classList.remove('selectedCoverImg'); // used in print view
    imgs[i].classList.add('notSelectedCoverImg'); // used in print view
    setTransform3D(imgs[i], flat ? 0 : ((index - i) * 10 + 45), 300, flat ? -(index - i) * 10 : (-(index - i) * 30 - 20))
  }

  //deal with the SELECTED image
  imgs[index].style['-webkit-filter'] = 'none'
  imgs[index].style.marginLeft = (-oneImgWidth(imgs)/2)+'%';  //center this one
  imgs[index].style.zIndex = imgs.length
  imgs[index].classList.add('selectedCoverImg'); // used in print view
  imgs[index].classList.remove('notSelectedCoverImg'); // used in print view
  titleBox.style.visibility = 'hidden'

  // deal with the title
  if (vnode.context.coverList[index].title) {
    titleBox.style.visibility = 'visible'
    var info = vnode.context.coverList[index].title
    titleBox.innerHTML = info
  }

  setTransform3D(imgs[index], 0, 0, 5)

  // deal with the RIGHT side
  for (var j = index + 1; j < imgs.length; j++) {
    let indexFromCenter = j - index - 1;
    spacing=-10;  //need to put this in % terms somehow
    let lftM = indexFromCenter*(oneImgWidth(imgs) + spacing)
    imgs[j].style.marginLeft = lftM + '%';
    imgs[j].style['-webkit-filter'] = 'brightness(0.7)'
    imgs[j].style.zIndex = imgs.length - j
    imgs[j].classList.remove('selectedCoverImg'); // used in print view
    imgs[j].classList.add('notSelectedCoverImg'); // used in print view
    setTransform3D(imgs[j], flat ? 0 : ((index - j) * 10 - 45), 300, flat ? (index - j) * 10 : ((index - j) * 30 - 20))
  }

  if (vnode.context.coverIndex !== index) {
    vnode.context.handleChange(index)
  }
}

export default {
  bind: function (el, binding, vnode) {
    var imgSize = parseInt(vnode.context.coverWidth)
    var spacing = parseInt(vnode.context.coverSpace)
    var shadow = vnode.context.coverShadow
    var bgColor = vnode.context.bgColor
    var flat = vnode.context.coverFlat
    var width = vnode.context.width
    var index = vnode.context.index
    vnode.context.coverIndex = index
    var imgHeight = Math.max(vnode.context.coverHeight, vnode.context.coverWidth)
    var imgs = []
    var placeholding


    for (var i = 0; i < el.childNodes.length; ++i) {
      if (el.childNodes[i].tagName) {
        imgs.push(el.childNodes[i])
      }
    }

    if(index > imgs.length-1){
      console.error('You set the coverflow index to '+ index + ' but you only have indices 0-' + (imgs.length-1) + ' to choose from!  Resetting it back to zero')
      index =0;
    }

    for (var j = 0; j < imgs.length; j++) {
      imgs[j].style.position = 'absolute'
      imgs[j].style.cursor = 'pointer'
      imgs[j].style.width = oneImgWidth(imgs) + '%' 

      imgs[j].style.left = '50%'; //center the left edge
      imgs[j].style.marginLeft = (-oneImgWidth(imgs)/2) + '%' //back off half the width

      imgs[j].style.height = 'auto'
      imgs[j].style.bottom = '50%';
      imgs[j].style.marginBottom = (-oneImgWidth(imgs)/2) + '%'; // this assumes images are square..  will work without being square, but will not quite be vertically centered


      // imgs[j].style.bottom = '60px'

      imgs[j].style['transition'] = browserPrefix + 'transform .4s ease, margin-left .4s ease, -webkit-filter .4s ease'
    }

    el.style.overflowX = 'hidden'
    el.style.backgroundColor = bgColor

    //create the title box
    var titleBox = document.createElement('SPAN')
    titleBox.className = 'coverflow-title-box'
    titleBox.style.position = 'absolute'
    titleBox.style.width = 2 * oneImgWidth(imgs) + '%';//'100%'; // titleBox.style.width = (imgSize - 20) + 'px'
    titleBox.style.left = '50%'
    titleBox.style.marginLeft = -oneImgWidth(imgs) + '%';

    titleBox.style.height = '20px'
    titleBox.style.lineHeight = '20px'
    titleBox.style.fontSize = '14px'
    titleBox.style.padding = '0 3px'
    titleBox.style.color = '#222'
    titleBox.style.background = '#ddd'
    titleBox.style.borderRadius = '10px'
    titleBox.style.fontWeight = 'normal'
    titleBox.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif'
    titleBox.style.bottom = '50%'
    titleBox.style.marginBottom = -1* oneImgWidth(imgs) + '%'
    titleBox.style.textAlign = 'center'
    titleBox.style.display = 'block'
    el.appendChild(titleBox)

    setTransform3D(el, 0, 600, 0)


    el.style.width = '100%'

    // if (shadow) {
    //   console.log('doing shadow')
    //   // el.style.height = (imgHeight * 2 + 80) + 'px'
    //   // el.style['-webkit-perspective-origin'] = el.style['perspective-origin'] = el.style['-moz-perspective-origin'] = '50% 25%'

    //   for (var k = 0; k < imgs.length; k++) {
    //     // imgs[k].style.bottom = (20 + imgHeight) + 'px'
    //     imgs[k].style['-webkit-box-reflect'] = 'below 0 -webkit-gradient(linear, 30% 20%, 30% 100%, from(transparent), color-stop(0.3, transparent), to(rgba(0, 0, 0, 0.8)))'
    //   }
    // } else {
    //   // el.style.height = (imgHeight + 80) + 'px'
    // }



    el.style.height = '100%';
    el.style.position = 'relative'

    displayIndex(imgSize, spacing, el.scrollLeft, imgs, index, flat, parseInt(el.style.width), titleBox, vnode)

    function handleClick (event) {
      if (event.target && event.target.nodeName.toUpperCase() === "IMG") {
        var index = imgs.indexOf(event.target)

        //set a brief timout to allow capturing double click event on the non-centered image
        setTimeout(displayIndex, 150, imgSize, spacing, el.scrollLeft, imgs, index, flat, parseInt(el.style.width), titleBox, vnode)
        // displayIndex(imgSize, spacing, el.scrollLeft, imgs, index, flat, parseInt(el.style.width), titleBox, vnode)
      }
    }

    function handleSelect(event){
      if (event.target && event.target.nodeName.toUpperCase() === "IMG") {
        var index = imgs.indexOf(event.target)
        vnode.context.selected(index)
      }
    }

    el.addEventListener('click', handleClick, false)
    el.addEventListener('dblclick', handleSelect, false)

    el.$destroy = () => {
      el.removeEventListener('click', handleClick, false)
      el.removeEventListener('dblclick', handleSelect, false)
    }
  },
  unbind: function (el) {
    el.$destroy()
  }
}