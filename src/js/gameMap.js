
import Rooms from './bspDungeon/DungeonBSP';
const GRID = {
   W : 30,
   H : 50,
   MIN_ROOM_SIZE: 10,
   MAX_ROOM_SIZE: 12

};


const WALLS = [
  {
    name:'emerald_',
    length:8
  },
  {
    name:'marble_wall_',
    length:12
  },
  {
    name:'stone_black_marked_',
    length:9
  },
  {
    name:'stone_brick_',
    length:12
  }
];

export function randomRange(min , max ){
  return (Math.random()* (max-min))+min;
}

function getNewWall(){
    let rand = Math.floor(Math.random()*4);
    let walls = WALLS[rand];
    return walls;
  }
function createBoard(){
  let walls = getNewWall();
  grooms = [];
  let grid = [];
  for (let i = 0; i < GRID.W; i++) {
    grid.push([]);
    for (let j = 0; j < GRID.H; j++) {
      let rand = Math.floor(Math.random()*walls.length)+1;
      grid[i].push({type: 0,eType:0, opacity: randomRange(0.6, 0.9),wall:walls.name+rand});
    }
  }

  return grid;
}

function placeRooms(grid , x ,y ,width=1 , height=1,id,type='floor'){
  if(x==0)x=1;
  if(y==0)y=1;
  for (let i = x; i < width; i++) {
			for (let j = y; j < height; j++) {
				grid[i][j] = {type , eType:type};
			}
		}
return grid;
}
function placeEntites(ent,grid,rooms,id='none',eType=''){
  let randomRoom = Math.floor(Math.random()*rooms.length);
  let X = Math.floor(randomRange(rooms[randomRoom].X+1,rooms[randomRoom].X+rooms[randomRoom].W-2));
  let Y =  Math.floor(randomRange(rooms[randomRoom].Y+1,rooms[randomRoom].Y+rooms[randomRoom].H-2));
  let safetyPlug1 = 0;
  let safetyPlug2 = 0;
  while (grid[X][Y].type!='floor'&& safetyPlug1<5) {
     X =  Math.floor(randomRange(rooms[randomRoom].X+1,rooms[randomRoom].X+rooms[randomRoom].W-2));
     Y =  Math.floor(randomRange(rooms[randomRoom].Y+1,rooms[randomRoom].Y+rooms[randomRoom].H-2));
     console.log("in",X,Y);
     safetyPlug1++;
     if(safetyPlug1==4&&safetyPlug2<4){
       randomRoom = Math.floor(Math.random()*rooms.length);
       safetyPlug1=0;
       safetyPlug2++;
     }
  }

      grid[X][Y]= {type:ent,eid:id,eType};

  return  {grid:grid,position:{x:X,y:Y},room:randomRoom};
}
const Entities = {
  lvl1:{
    enemies :{types:['enemy-lvl1-1','enemy-lvl1-2','enemy-lvl1-3'],no:5,extra:false},
    weapons:{types:['weapon-2'],no:1,name:'Green Destiny',attack:7},
    potions:{types:['potion'],no:5}
  },
  lvl2:{
    enemies :{types:['enemy-lvl2-1','enemy-lvl2-2'],no:5,extra:false},
    weapons:{types:['weapon-1'],no:1,name:'Anduril',attack:12},
    potions:{types:['potion'],no:5}
  },
  lvl3:{
    enemies :{types:['enemy-lvl3-1','enemy-lvl3-2'],no:5,extra:false},
    weapons:{types:['weapon-3'],no:1,name:'Glamdring aka “The Foehammer”',attack:20},
    potions:{types:['potion'],no:5}
  },
  lvl4:{
    enemies :{types:['enemy-lvl4'],no:1,extra:true},
    weapons:{types:['weapon-4'],no:1,name:'Orcrist aka “The Goblin-Cleaver”',attack:55},
    potions:{types:['potion'],no:9}
  }
}


export function  getGrid(){
  let grid = createBoard();
  Rooms.init(GRID.W,GRID.H,GRID.MIN_ROOM_SIZE,GRID.MAX_ROOM_SIZE);
  let rooms = Rooms.getRooms();
  let halls = Rooms.getHalls();
  for (var i = 0; i < rooms.length; i++) {
    let room = rooms[i];
    grid = placeRooms(grid,room.X,room.Y,room.W+room.X,room.H+room.Y);
  }
  for (var i = 0; i < halls.length; i++) {
    let hall = halls[i];
    grid = placeRooms(grid,hall.X,hall.Y,hall.W+hall.X-1,hall.H+hall.Y-1);
  }

     grooms=[...rooms];

     return grid;
}

let grooms = [];
export function createEntites(level=1){
  let map = getGrid();
  let grid =JSON.parse(JSON.stringify(map));
  let lvl= "lvl"+level;
  const enemies =[];
  const weapons =[];
  const potions =[];
  for(let i =0 ;i<Entities[lvl].enemies.no;i++){
    let rand = Math.floor(Math.random()*Entities[lvl].enemies.types.length);
      let holder = placeEntites(Entities[lvl].enemies.types[rand],grid,grooms,i,'enemy');
      grid = holder.grid;
      let ePwr = level==4?95:level*12;
      let eHp = level==4?400:level*20;
    enemies.push({
      eid:i,
      eType:'enemy',
      type:Entities[lvl].enemies.types[rand],
      baseHp:eHp,
      hp:eHp,
      attack:ePwr,
      xp:10,
      x:holder.position.x,
      y:holder.position.y,
      room:holder.room
    });
  }
  if(Entities[lvl].enemies.extra){
    for(let i =0 ;i<Entities['lvl'+3].enemies.no-1;i++){
      let rand = Math.floor(Math.random()*Entities['lvl'+3].enemies.types.length);
        let holder = placeEntites(Entities['lvl'+3].enemies.types[rand],grid,grooms,enemies.length,'enemy');
        grid = holder.grid;
      enemies.push({
        eid:enemies.length,
        eType:'enemy',
        type:Entities['lvl'+3].enemies.types[rand],
        baseHp:level*20,
        hp:level*20,
        attack:level*20,
        xp:10,
        x:holder.position.x,
        y:holder.position.y,
        room:holder.room
      });
    }
  }

  for(let i =0 ;i<Entities[lvl].weapons.no;i++){
    let rand = Math.floor(Math.random()*Entities[lvl].weapons.types.length);
    let holder = placeEntites(Entities[lvl].weapons.types[rand],grid,grooms,i,'weapon');
    grid = holder.grid;

  weapons.push({
    eid:i,
    eType:'weapon',
    type:Entities[lvl].weapons.types[rand],
    name:Entities[lvl].weapons.name,
    damage:Entities[lvl].weapons.attack,
    x:holder.position.x,
    y:holder.position.y
  });
  }
  for(let i =0 ;i<Entities[lvl].potions.no;i++){
    let rand = Math.floor(Math.random()*Entities[lvl].potions.types.length);
    let holder  = placeEntites(Entities[lvl].potions.types[rand],grid,grooms,i,'potion');
    grid = holder.grid;
  potions.push({
    eid:i,
    eType:'potion',
    hp:20,
    type:Entities[lvl].potions.types[rand],
    x:holder.position.x,
    y:holder.position.y
  });
  }
  let holder  = placeEntites('player',grid,grooms);
  grid = holder.grid;
  let playerPosition= holder.position;


  return {
    gameMap: map,
    entites:{
     'player':{
       type:'player',
       x:playerPosition.x,
       y:playerPosition.y,
       weapon:'knife',
       health:100,
       attack: 7,
       direction: -1,
       level:0,
       xpToNext:60
    },
    'gate':{},'redhead':{},
    'enemies':enemies,
    'weapons':weapons,
    'potions':potions
  },
  level:level,
  windowWidth:250,
  windowHeight:250,
  dark:true,
  rooms:grooms
};
}
