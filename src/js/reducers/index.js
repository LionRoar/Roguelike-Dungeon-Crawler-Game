
const initialState = {
  gameMap: [
    []
  ],
  entites: {
    'player': {
      type: 'player',
      x: 0,
      y: 0,
      weapon: 'knife',
      health: 100,
      attack: 7,
      direction: -1,
      level: 0,
      xpToNext: 60
    },
    'gate': {},
    'redhead': {},
    'enemies': [],
    'weapons': [],
    'potions': []
  },
  level: 0,
  windowWidth: 250,
  windowHeight: 250,
  dark: true,
  rooms: []
};

export default function dungeonReducer(state = initialState, action) {
  switch (action.type) {

    case 'NEW_BEGINING':
      state = {
        gameMap: action.newState.gameMap,
        entites: action.newState.entites,
        rooms: action.newState.rooms,
        level: action.newState.level,
        dark: state.dark,
        windowWidth: state.windowWidth,
        windowHeight: state.windowHeight
      }
      break;

    case 'SETUP_MAP':
      state = {
        ...state,
        gameMap: action.newState.gameMap,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            x: action.newState.entites.player.x,
            y: action.newState.entites.player.y
          },
          gate: {},
          enemies: action.newState.entites.enemies,
          weapons: action.newState.entites.weapons,
          potions: action.newState.entites.potions
        },
        rooms: action.newState.rooms
      }
      break;
    case 'MOVE_PLAYER':
      state = {
        ...state,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            x: state.entites.player.x + action.x,
            y: state.entites.player.y + action.y,
            direction: -(Math.ceil((action.y + 1) / 2))
          }
        }
      }
      break;
    case 'ADD_HP':
      state = {
        ...state,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            health: state.entites.player.health + action.hp
          }
        }
      }
      break;
    case 'PLAYER_LEVELUP':
      state = {
        ...state,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            attack: state.entites.player.attack + 7 *(state.entites.player.level + 1),
            health: state.entites.player.health + 7 *(state.entites.player.level + 1),
            xpToNext: 60 *(state.entites.player.level + 2),
            level: state.entites.player.level + 1
          }
        }
      }
      break;
    case 'ADD_XP':
      state = {
        ...state,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            xpToNext: state.entites.player.xpToNext - action.xp
          }
        }
      }
      break;
    case 'ADD_WEAPON':
      state = {
        ...state,
        entites: {
          ...state.entites,
          player: {
            ...state.entites.player,
            attack: state.entites.player.attack + action.weapon.damage,
            weapon: action.weapon.name
          }
        }
      }
      break;

    case 'DAMAGE':
      switch (action.entName) {
        case 'player':
          state = {
            ...state,
            entites: {
              ...state.entites,
              player: {
                ...state.entites.player,
                health: state.entites.player.health - action.damage
              }
            }
          }
          break;
        default:
          state = {
            ...state,
            entites: {
              ...state.entites,
              [action.entName]: {
                ...state.entites[action.entName],
                [action.id]: {
                  ...state.entites[action.entName][action.id],
                  hp: state.entites[action.entName][action.id].hp - action.damage
                }
              }
            }
          }

      }
      break;
    case 'REMOVE_ENT':
      state = {
        ...state,
        entites: {
          ...state.entites,
          [action.entName]: action.newEnts
        }
      }
      break;
    case 'NEXT_LEVEL':
      state = {
        ...state,
        entites: {
          ...state.entites,
          [action.entName]: action.value
        },
        level: state.level + 1
      }

      break;
    case 'SET_VIEW':
      state = {
        ...state,
        windowWidth: action.W,
        windowHeight: action.H
      };

      break;
    case 'TOGGLE_LIGHT':
      state = {
        ...state,
        dark: !state.dark
      };
      break;
    default:
      state = {
        ...state
      };
  }
  return state;
}
