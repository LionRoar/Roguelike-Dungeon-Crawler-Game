import React from 'react';
import {connect} from 'react-redux';
import GamePanel from './panel';
import {createEntites, randomRange} from '../gameMap';
import * as Action from '../actions';
import { bindActionCreators} from 'redux';

//notification
const Message = humane.create({baseCls:'humane-jackedup',clickToClose:true,timeout:5000});
Message.error = Message.spawn({addnCls:'humane-jackedup-error'});
Message.success = Message.spawn({addnCls:'humane-jackedup-success'});
//

console.log(Action);

class Dungeon extends React.Component {
  constructor(props) {
    super(props);
    this.placeHelper;
    this.handleKey = this.handleKey.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.setViewport = this.setViewport.bind(this);
    this.state = {gameState:''};
    props.newBegining(createEntites(1));
  }

  removeEntity(name, id) {
    let checkGrid = this.placeHelper;
    let ents = this.props.game.entites[name];
    delete ents[id.toString()];
    this.props.removeEnt(name, ents);

  }
  deadHero(){

    window.removeEventListener('keydown', this.handleKey);
    this.setState({gameState:'dead'});
    setTimeout(()=>{  this.setState({gameState:''});
      this.props.newBegining(createEntites(1));
      window.addEventListener('keydown', this.handleKey);},5000);
  }
  realHero(){
    window.removeEventListener('keydown', this.handleKey);
    this.setState({gameState:'won'});
    setTimeout(()=>{ this.setState({gameState:''});
      this.props.newBegining(createEntites(1));
      window.addEventListener('keydown', this.handleKey);},5000);
  }
  handelBattel(enemy) {

    const enemies = this.props.game.entites.enemies;
    const player = this.props.game.entites.player;

    const playerAttack = Math.floor((Math.random()*7)+player.attack-7);
    const enemyAttack = Math.floor((Math.random()*7)+enemy.attack-7);
    if (enemy.hp > playerAttack) {
      if (enemyAttack > player.health) {
        //DEAD
        Message.error('Wasted!');
        this.deadHero();
        return;
      }
      this.props.damaged('enemies', enemy.eid, playerAttack);
      this.props.damaged('player', 0, enemyAttack);
    } else {
      this.removeEntity('enemies', enemy.eid);
      if(player.xpToNext>enemy.xp){
      this.props.addXP(this.props.game.level*enemy.xp);
    }else {
      this.props.playerLevelUp();
    }
      if(player.xpToNext==0) {
      this.props.playerLevelUp();
      }
      let enemyRemains = this.props.game.entites.enemies;
      let len = Object.keys(enemyRemains).length;
      if (len == 0 && this.props.game.level == 4) {
        Message.success('You\'re a Hipster! \n GO GET YOUR GIRL ❤');
        let room = this.props.game.rooms[enemy.room];
        let X = Math.floor(randomRange(room.X + 1, room.X + room.W - 1));
        let Y = Math.floor(randomRange(room.Y + 1, room.Y + room.H - 1));
        while (this.placeHelper[X][Y].type != 'floor') {
          X = Math.floor(randomRange(room.X + 1, room.X + room.W - 1));
          Y = Math.floor(randomRange(room.Y + 1, room.Y + room.H - 1));
        }
        this.props.levelUp('redhead', {
          type: 'redhead',
          eType: 'redhead',
          x: X,
          y: Y
        });
      }
      else if (len == 0) {
        let room = this.props.game.rooms[enemy.room];
        let X = Math.floor(randomRange(room.X + 1, room.X + room.W - 1));
        let Y = Math.floor(randomRange(room.Y + 1, room.Y + room.H - 1));
        while (this.placeHelper[X][Y].type != 'floor') {
          X = Math.floor(randomRange(room.X + 1, room.X + room.W - 1));
          Y = Math.floor(randomRange(room.Y + 1, room.Y + room.H - 1));
        }
        Message.log('A GATE HAS BEEN OPEN AT THE ROOM WHERE YOU KILLED YOUR LAST ENEMY!');
        this.props.levelUp('gate', {
          type: 'gate',
          eType: 'gate',
          x: X,
          y: Y
        });

      }

    }

  }
  checkMove(pos) {
    let checkGrid = this.placeHelper;
    let player = this.props.game.entites.player;
    let cell = checkGrid[player.x + pos.x][player.y + pos.y];
    console.log(player);
    if (cell.eType != 0) {

      switch (cell.eType) {
        case 'potion':

          let potion = this.props.game.entites.potions[(cell.eid).toString()];
          this.props.addHP(potion.hp);
          this.removeEntity('potions', cell.eid);
          this.props.move(pos);

          break;
        case 'floor':
          this.props.move(pos);

          break;
        case 'weapon':
          let weapon = this.props.game.entites.weapons[(cell.eid).toString()];
          this.props.addWeapon(weapon);
          this.removeEntity('weapons', cell.eid);
          this.props.move(pos);
          break;
        case 'enemy':
          let enemy = this.props.game.entites.enemies[(cell.eid).toString()];
          this.handelBattel(enemy);
          break;
        case 'gate':
          this.props.move(pos);
          this.generateLevel(this.props.game.level);
          break;
        case 'redhead':
          this.realHero();
          break;
        default:
          break;
      }
    }

  }
  generateLevel(lvl) {
    let grid = createEntites(lvl);
    this.props.setGame(grid);
  }
  handleKey(e) {
    e.preventDefault();
    switch (e.keyCode) {
      case 38:
        this.checkMove({x: -1, y: 0});
        break;
      case 39:
        this.checkMove({x: 0, y: 1});
        break;
      case 40:
        this.checkMove({x: 1, y: 0});
        break
      case 37:
        this.checkMove({x: 0, y: -1});

        break;
      default:
        return;
    }

  }

  setViewport() {
    setTimeout(() => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      this.props.setView(W, H);
    }, 500);
  }
  handleSwipe(e){
    const {overallVelocity, angle} = e;
  if (Math.abs(overallVelocity) > .75) {
    e.preventDefault();
      if(angle > -100 && angle< -80)
        this.checkMove({x: -1, y: 0});
     if(angle > -10 && angle < 10)
        this.checkMove({x: 0, y: 1});
     if(angle > 80 && angle < 100)
        this.checkMove({x: 1, y: 0});
      if(Math.abs(angle) > 170)
        this.checkMove({x: 0, y: -1});
        return;
    }
  }
  componentDidMount() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    this.props.setView(W, H);
    window.addEventListener('keydown', this.handleKey);
    window.addEventListener('resize', this.setViewport);
    const game = document.getElementById('app');
    const manager = new Hammer(game);
    manager.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    manager.on('swipe', this.handleSwipe);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey);
    window.removeEventListener('resize', this.setViewport);
  }
  placeEntites(board) {

    let grid = JSON.parse(JSON.stringify(board));
    let ents = this.props.game.entites;
    for (let entName in ents) {
      let ent = ents[entName];
      if (entName == 'player') {
        let opacity = ent.health <= 100
          ? ent.health / 100
          : 1;
        grid[ent.x][ent.y] = {
          type: ent.type,
          opacity: opacity,
          direction: ent.direction
        }
      } else if (entName == 'gate' || entName=='redhead') {
        if (ent.x && ent.y) {
          grid[ent.x][ent.y] = {
            type: ent.type,
            eType: ent.eType
          }
        }
      } else if (entName == 'enemies') {
        for (let eI in ent) {
          let e = ent[eI];

          grid[e.x][e.y] = {
            type: e.type,
            opacity: e.hp / e.baseHp,
            eid: e.eid,
            eType: e.eType
          }
        }
      } else if (entName === 'weapons' || entName == 'potions') {
        for (let eI in ent) {
          let e = ent[eI];
          grid[e.x][e.y] = {
            type: e.type,
            eid: e.eid,
            eType: e.eType
          }
        }
      }

    }
    this.placeHelper = grid;
    return grid;
  }
  render() {
    let board = this.props.game.gameMap;
    board = this.placeEntites(board);

    let playerX = this.props.game.entites.player.x;
    let playerY = this.props.game.entites.player.y;
    //
    if (this.props.game.dark) {
      board.map((r, i) => r.map((c, j) => {
        let distance = (Math.abs(playerX - i)) + (Math.abs(playerY - j));
        c.opacity = distance > 5
          ? distance > 7
            ? 0
            : 0.2
          : c.opacity;
      }));

    }

    //
    let windowHeight = Math.max(20,(this.props.game.windowHeight/1.6));
    let windowWidth = (this.props.game.windowWidth) ;
    console.log(windowWidth,window.innerWidth);
    let numOfRows = Math.floor((windowHeight / 20));
    let numOfCols = Math.floor((windowWidth / 20));

    let X = Math.floor(playerY - (numOfCols / 2));
    X = X < 0
      ? 0
      : X;
    let Y = Math.floor(playerX - (numOfRows/ 2));
    Y = Y < 0
      ? 0
      : Y;

    let W = (X + numOfCols);
    let H = (Y + numOfRows);
    console.log('X',X,'Y',Y,'W',W,'H',H);
    console.log('board.length',board.length,'board[0].length',board[0].length,'numOfCols',numOfCols,'numOfRows',numOfRows);
    if (W > board[0].length) {
      X = numOfCols > board[0].length
        ? 0
        : X - (W - board[0].length);
      W =board[0].length;
    }
    if (H > board.length) {
      Y = numOfRows > board.length
        ? 0
        : Y - (H - board.length);
      H = board.length;
    }


    board = board.filter((r, i) => i >= Y && i < H).map((c) => c = c.filter((c, j) => j >= X && j < W));
    ////////
    board = board.map((r, i) => {
      return (<div className='row' id={'r' + i} key={"row" + i}>
        {
          r.map((c, j) => {
            let dir = c.direction?{transform: 'scaleX('+c.direction+')'}:"";
            if(!this.props.game.dark)c.opacity= c.type=='player'||c.eType=='enemy'?
              c.opacity<0.3?0.3:c.opacity:c.opacity;

            let wall=  c.wall?{backgroundImage:'url(assets/'+c.wall+'.png)'}:'';
            return (<div className={c.type == 0
              ? 'cell'
              : 'cell ' + c.type} style={Object.assign({},dir,wall,{
                opacity: c.opacity,
              })} key={j} id={"x" + j + "y" + i} eid={c.eid}></div>);
          })
        }
      </div>);

    });

    return (
      <div className={'game '+this.state.gameState}>
        {board}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {game: state};
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(Action, dispatch);
}






export default connect(mapStateToProps, matchDispatchToProps)(Dungeon);
