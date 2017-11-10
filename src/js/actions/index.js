export function setGame(newState) {
  return {type: 'SETUP_MAP', newState}
}
export function addPlayer(pos) {
  return {type: 'ADD_PLAYER', x: pos.x, y: pos.y}
}
export function move(newPos) {
  return {type: 'MOVE_PLAYER', x: newPos.x, y: newPos.y}
}
export function addHP(hp) {
  return {type: 'ADD_HP', hp}
}
export function addWeapon(weapon) {
  return {type: 'ADD_WEAPON', weapon}
}
export function removeEnt(entName, newEnts) {
  return {type: 'REMOVE_ENT', entName, newEnts}
}
export function damaged(entName, id, damage) {
  return {type: 'DAMAGE', entName, id: id.toString(), damage}
}
export function levelUp(entName, value) {
  return {type: 'NEXT_LEVEL', entName, value}
}

export function newBegining(newState) {
  return {type: 'NEW_BEGINING', newState}
}

export function setView(W, H) {
  return {type: 'SET_VIEW', W, H}
}

export function spotLight() {
  return {type: 'TOGGLE_LIGHT'}
}
export function addXP(xp) {
  return {type: 'ADD_XP', xp}
}
export function playerLevelUp() {
  return {type: 'PLAYER_LEVELUP'}
}
