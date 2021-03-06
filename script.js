  //change these parameters only
  const groupNumber = 4
  const maxMembersPerGroup = 4
  const moveByNumberOfPixels = 3
  const numberOfGroups = 3

  //"created with the voices from LOVO @ www.lovo.ai.”

  //Uncomment your group here and comment out active array
  //Group 1
  //let classMembers = ['Adia Boyd','Alexander Woolley','Beauregard Hengst','Caroline Tobin','Caroline Lynch', 'Charles Puente-matos', 'David Ready', 'Dominique Christopher', 'Donnahue George', 'Eric Freyer', 'Esiena Ekwofia', 'Evan Chu', 'Fiach Mchugh Hill']

  //Group 2
  //let classMembers = ['Gabriel Sanchez','Genis Bardales','Gillian Fitzgerald','Gregory Scott','Illgner Paul','Jacqueline Rodney','Jason Pena','Joel Straley','Jonathan Gomez','Jude Sanchez','Kofi Hayford','Kristina Iankovskaia']

  //Group 3
  //let classMembers = ['Laura Aupert','Lindsey Bowen','Luwenxi Song','Margaret Elson','Mariah Rivera','Mateo Molina','Matthew Vanni','Melissa Kinsey','Natalia Carvajal','Nicholas Jazgunovich','Peter Cardillo','Purna Gurung','Rajahni Fields']

  //Group 4
  let classMembers = ['Ramon Torres','Samya Fiki','Shantel Modeste','Thokozile Soko','Thomas Rumore','Veronika Balakhovsky','Vincent Hart','Viviana Arenas','Wendy Figueroa','Jack Reed','William Cannon']

  $(document).ready(function(){
      if(localStorage.getItem('team1')){
          displayTeams()
      }else{
          $('.welcome-message').css('display', 'block')
          confetti()
          startGame()
      }
  })
  var synth = window.speechSynthesis;
  var voices = synth.getVoices();
  let highlightCount;
  let randomIndex;
  let moveMember;
  let currentIndex;
  let randomMember;
  let numberOfAvailableDivs
  let suspenseMusic;
  let randomMemberAudio;
  let started = true
  let setNonCompleteArray = false
  let crowdClapping = new Audio('./Sounds/applause3.mp3');
  const completeTeams = []
  let nonCompleteTeams = []

  function runButtonHighlight(){
      let memberCount = 0
      if(started){
          $('.start-randomization').text('Next Member')
          started = false
      }else if($('.team-members .member').length === 1){
          $('.start-randomization').text('Final Member')
      }
      const buttonFlash = setInterval(function(){
          if(memberCount < classMembers.length){
              let member = document.querySelectorAll('.team-members .member')[memberCount]
              member.style.backgroundColor = 'white'
              member.style.color = 'black'
              setTimeout(function(){
                  member.style.backgroundColor = 'initial'
                  member.style.color = 'white'
              },300)
              memberCount++
              if(memberCount > classMembers.length - 1){
                  clearInterval(buttonFlash)
              }
          }
      }, 62.5)
      highlightCount++
  }

  const displayTeams = () => {
      let column;
      $('.team-header').text(`Group ${groupNumber} Teams`)
      $('.saved-teams').css('display', 'block')
      $('.welcome').css('width', '100%')
      const keys = []
      Object.keys(localStorage).forEach(key => {
          if(key.includes('team')){
              keys.push(key)
          }
      })
      keys.forEach((key, index) => {
          column = $(`<div class="team team${index+1}">
              <h1 class="group-header" style="text-transform: capitalize">${key.slice(0,-1)} ${key.slice(-1)}</h1>
          </div>
          `)
          localStorage.getItem(`${key.slice(0,-1)}${index + 1}`).split(',').forEach(member => {
              if(member != ""){      
                  const memberP = $(`<p class="member">${member}</p>`)
                  column.append(memberP)
              }
          })
          $('.team-groups-homepage').append(column)
      })
  }

  const handlePositioning = (currentPosition, endPosition, randomMember, clonedMember) => {
      if(currentPosition.x != endPosition.x || currentPosition.y != endPosition.y){
          if(currentPosition.x != endPosition.x){
              if(Math.abs(currentPosition.x - endPosition.x) < moveByNumberOfPixels){
                  swapElements(clonedMember, randomMember)
                  currentPosition.x = endPosition.x
                  $(randomMember).css('left', `${currentPosition.x}px`)
                  randomMember.style.display = 'none'
              }else{
                  if(currentPosition.x > endPosition.x){
                      $(randomMember).css('left', `${currentPosition.x - moveByNumberOfPixels}px`)
                      currentPosition.x -= moveByNumberOfPixels
                  }else{
                      $(randomMember).css('left', `${currentPosition.x + moveByNumberOfPixels}px`)
                      currentPosition.x += moveByNumberOfPixels
                  }
              }
          }
          if(currentPosition.y != endPosition.y){
              if(Math.abs(currentPosition.y - endPosition.y) < moveByNumberOfPixels){
                  currentPosition.y = endPosition.y
                  $(randomMember).css('top', `${currentPosition.y}px`)
              }else{
                  if(currentPosition.y > endPosition.y){
                      //move up
                      $(randomMember).css('top', `${currentPosition.y - moveByNumberOfPixels}px`)
                      currentPosition.y += moveByNumberOfPixels
                  }else{
                      //move down
                      $(randomMember).css('top', `${currentPosition.y + moveByNumberOfPixels}px`)
                      currentPosition.y += moveByNumberOfPixels
                  }
              }
          }
      }else{
          clearInterval(moveMember)
      }
  }

  const swapElements = (clonedMember, randomMember) => {
      clonedMember.style.margin = 'unset'
      clonedMember.style.padding = '12px'
      clonedMember.style.height = 'fit-content'
      clonedMember.style.background = 'white'
      clonedMember.style.boxShadow = 'unset'
      clonedMember.style.fontWeight = 'normal'
      clonedMember.style.fontSize = '20px'
      clonedMember.innerText = randomMember.innerText
      clonedMember.style.marginBottom = '10px'
      randomMember.remove()
      if(document.querySelectorAll('.team-members .member').length <= 0){
          endGame()
      }
  }

  const hideClone = (clonedMember, width) => {
      clonedMember.style.width = `${width - 12}px`
      clonedMember.style.margin = 'unset'
      clonedMember.style.padding = 'unset'
      clonedMember.style.height = '44px'
      clonedMember.style.background = 'transparent'
      clonedMember.style.boxShadow = 'unset'
      clonedMember.style.textDecoration = 'none'
      clonedMember.innerText = ""
  }

  const selectMember = (randomIndex) => {
      randomMember = $('.team-members .member')[randomIndex]
      randomMemberAudio = new Audio(`./Sounds/Group_${groupNumber}_names/${randomMember.innerText.split(' ').join('_')}.wav`)
      randomMemberAudio.play()
      randomMember.style.backgroundColor = 'white'
      randomMember.style.color = 'black'
      if(!setNonCompleteArray){
          $('.team').each(function(){
              nonCompleteTeams.push(this)
          })
          setNonCompleteArray = true
      }
      numberOfAvailableDivs = $('.team').length
      if(nonCompleteTeams.length > 0){
          putRandomMemberInTeam()
      }
  }

  const putRandomMemberInTeam = () => {
      const teamHolderRectangle = document.querySelector('.team-groups').getBoundingClientRect()
      let randomGroupNumber = Math.floor(Math.random() * nonCompleteTeams.length)
      let randomGroupDiv = $(nonCompleteTeams[randomGroupNumber])
      let clonedMember = randomMember.cloneNode(true)
      randomGroupDiv.append((clonedMember))
      const clonedMemberPosition = clonedMember.getBoundingClientRect()
      hideClone(clonedMember, clonedMemberPosition.width)
      $(randomMember).css('position', 'absolute')
      $(randomMember).css('width', `${clonedMemberPosition.width - 24}px`)
      let currentPosition = {x: randomMember.getBoundingClientRect().x, y: randomMember.getBoundingClientRect().y}
      let endPosition = {x: (clonedMemberPosition.x - teamHolderRectangle.x - 4), y: clonedMemberPosition.y - 12}
      moveMember = setInterval(() => handlePositioning(currentPosition,endPosition,randomMember,clonedMember),1)
      $(randomMember).css('z-index', 2)
      classMembers = classMembers.filter(name => {
          return name !== classMembers[randomIndex]
      })
      for(currentIndex= 0; currentIndex < numberOfAvailableDivs; currentIndex++){
          let teamLength = $('.team')[currentIndex].querySelectorAll('p').length
          if(teamLength === maxMembersPerGroup){
              nonCompleteTeams = nonCompleteTeams.filter(team => team.querySelectorAll('p').length !== maxMembersPerGroup)
              numberOfAvailableDivs = nonCompleteTeams.length
          }
      }
      if(nonCompleteTeams.length <= 0){
          endGame()
      }
  }

  const endGame = () => {
      randomMemberAudio.onended = function(){
          let outroAudio = new Audio(`./Sounds/Congratulations/congratulations_team${groupNumber}.wav`)
          outroAudio.play()
          outroAudio.onended = function(){
              $('.start-randomization').css('display', 'none')
              $('.save').css('display', 'block')
              document.querySelector('.save').addEventListener('click', handleSavingGroupData)
          }
      }
  }

  const handleSavingGroupData = () => {
      document.querySelectorAll('.team').forEach((group, index) => {
          let teamString = ""
          group.querySelectorAll('p').forEach(div => {
              teamString += div.innerText += ','
          })
          localStorage.setItem(`team${index+1}`, teamString)
      })
      $('.randomization-container').css('display', 'none')
      $('.team-groups').css('display', 'none')
      $('.team-header').css('display', 'block')
      displayTeams()
  }

  const handleRandomButtonClick = () => {
      suspenseMusic = new Audio('./Sounds/suspense.mp3')
      suspenseMusic.play()
      highlightCount = 0
      if(highlightCount === 0){
          runButtonHighlight()
      }
      const highlightNameInterval = setInterval(function(){
          if(highlightCount === 5){
              suspenseMusic.pause()
              clearInterval(highlightNameInterval)
              randomIndex = Math.floor(Math.random() * (classMembers.length - 1))
              selectMember(randomIndex)
          }else{
              runButtonHighlight()
          }
      },875)
  }

  const runRandomization = () => {
      let i = 0;
      let nameInterval = setInterval(function(){
          let classMember = new Audio(`./Sounds/Group_${groupNumber}_names/${classMembers[i].split(' ').join('_')}.wav`)
          let newP = $(`<p class="member">${classMembers[i]}</p>`)
          if(i ===  classMembers.length - 1){
              clearInterval(nameInterval)
              $('.start-randomization').css('display', 'block')
              $('.start-randomization').on('click', handleRandomButtonClick)
          }
          classMember.play()
          $('.team-members').append(newP)
          classMember.onended = function(){
              crowdClapping.play();
          }
          i++
      },5500)
  }

  const startGame = () => {
      $('.start').on('click', function(){
          $('.game-header').text(`Team ${groupNumber} Members`)
          $('#world').css('display', 'block')
          const intro = new Audio('./Sounds/intro.wav');
          intro.play()
          intro.onended = function(){
              crowdClapping.play()
              $('.welcome h1 , .welcome .start').css('display', 'none')
              let teamNumber = 1;
              for (let i=0; i < numberOfGroups; i++) {
                  const column = $(`<div class="team team${teamNumber}">
                      <h1 class="group-header" style="margin-bottom: 10px;">Team ${teamNumber}</h1>
                  </div>`)
                  $('.team-groups').append(column)
                  teamNumber++
              }
              $('.container').css('align-items', 'start')
              $('.randomization-container').css('display', 'block')
              $('.team-groups').css('display', 'flex')
              crowdClapping.oneded = runRandomization()
          }
      })
  }
  //Code Converted into Javascript from CoffeeScript by Linmiao Xu codepen link  - https://codepen.io/linrock/pen/Amdhr/
  const confetti = () => {
      var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

      NUM_CONFETTI = 350;

      COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

      PI_2 = 2 * Math.PI;

      canvas = document.getElementById("world");

      context = canvas.getContext("2d");

      window.w = 0;

      window.h = 0;

      resizeWindow = function() {
        window.w = canvas.width = window.innerWidth;
        return window.h = canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', resizeWindow, false);

      window.onload = function() {
        return setTimeout(resizeWindow, 0);
      };

      range = function(a, b) {
        return (b - a) * Math.random() + a;
      };

      drawCircle = function(x, y, r, style) {
        context.beginPath();
        context.arc(x, y, r, 0, PI_2, false);
        context.fillStyle = style;
        return context.fill();
      };

      xpos = 0.5;

      document.onmousemove = function(e) {
        return xpos = e.pageX / w;
      };

      window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
          return window.setTimeout(callback, 1000 / 60);
        };
      })();

      Confetti = (function() {
        function Confetti() {
          this.style = COLORS[~~range(0, 5)];
          this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
          this.r = ~~range(2, 6);
          this.r2 = 2 * this.r;
          this.replace();
        }

        Confetti.prototype.replace = function() {
          this.opacity = 0;
          this.dop = 0.03 * range(1, 4);
          this.x = range(-this.r2, w - this.r2);
          this.y = range(-20, h - this.r2);
          this.xmax = w - this.r;
          this.ymax = h - this.r;
          this.vx = range(0, 2) + 8 * xpos - 5;
          return this.vy = 0.7 * this.r + range(-1, 1);
        };

        Confetti.prototype.draw = function() {
          var _ref;
          this.x += this.vx;
          this.y += this.vy;
          this.opacity += this.dop;
          if (this.opacity > 1) {
            this.opacity = 1;
            this.dop *= -1;
          }
          if (this.opacity < 0 || this.y > this.ymax) {
            this.replace();
          }
          if (!((0 < (_ref = this.x) && _ref < this.xmax))) {
            this.x = (this.x + this.xmax) % this.xmax;
          }
          return drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
        };

        return Confetti;

      })();

      confetti = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= NUM_CONFETTI ? _i <= NUM_CONFETTI : _i >= NUM_CONFETTI; i = 1 <= NUM_CONFETTI ? ++_i : --_i) {
          _results.push(new Confetti);
        }
        return _results;
      })();

      window.step = function() {
        var c, _i, _len, _results;
        requestAnimationFrame(step);
        context.clearRect(0, 0, w, h);
        _results = [];
        for (_i = 0, _len = confetti.length; _i < _len; _i++) {
          c = confetti[_i];
          _results.push(c.draw());
        }
        return _results;
      };

      step();
  }
