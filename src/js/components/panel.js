import React from 'react';
import * as Action from '../actions';
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
class  GamePanel extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      dark:true,
      color:'green',
      hints:props.hints
    }
  }
  toggle(){
     let dark =this.props.dark;
     if(dark)
     {
       this.setState({dark,color:'gray'});
     }else {
       this.setState({dark,color:'green'});
     }
     this.props.spotLight();
  }
  render(){
    const player  = this.props.game.entites.player;
    return(
      <div className="panel-wrapper">
        <ul>
          <li>
            <div >Health: <span className="val">{player.health}</span></div>
            <div className="health-bar-cont">
              <div className="health-bar" style={{width: player.health+'%' }}></div>
            </div>
          </li>
          <li>
            <div >ATTACK</div>
            <div className="val">{player.attack}</div>
          </li>
          <li>
            <div >WEPON</div>
            <div className="val">{player.weapon}</div>
          </li>
          <li>
            <div >LEVEL</div>
            <div className="val">{player.level}</div>
          </li>
          <li>
            <div >NEXT LEVEL</div>
            <div className="val">{player.xpToNext+' XP'}</div>
          </li>
          <li>
            <div>DUNGEON</div>
            <div className="val">{this.props.game.level}</div>
          </li>
          <li>
            <div>DEMONS TO KILL</div>
            <div className="val">{Object.keys(this.props.game.entites.enemies).length}</div>
          </li>
          <li>
            <button id="dark" type="checkbox" style={{background:this.state.color}}
              onClick={this.toggle.bind(this)}>DARK</button>
          </li>
        </ul>
        <div className="val">CLEAN ALL THE 4 DUNGEONS FROM ALL THE DEMONS</div>
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




 export default connect(mapStateToProps, matchDispatchToProps)(GamePanel);
