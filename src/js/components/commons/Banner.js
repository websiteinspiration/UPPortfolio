import React from 'react';
import { Motion, spring, presets } from 'react-motion';
import { Row, Column } from 'react-foundation';

import TrianglifySVG from './TrianglifySVG';
import SpringDrop from './SpringDrop';
import Navigation from './Navigation';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../../actions/actionUI';

// For Debounce Function
import utils from '../../utils';

@connect(state => {
  return {UI: state.UI}
}, dispatch => {
  return {actionUI: bindActionCreators(actionUI, dispatch)}
})
export default class Banner extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      preloaded: false
    };
    // setTimeout(()=>{
    //   this.props.actionUI.bannerTouchAvatar();
    // },5000);
  }

  render() {
    return (
      <div ref="banner" className="app-block app-banner">
        <DistortContentByMouse options={{zoom: 1.1,reverseDirection: true,duration:1}}>
          <TrianglifySVG {...this.props} ref="bannerTrianglify"
                         className="app-avatar-bg" options={{height: 720}}/>
        </DistortContentByMouse>
        {!this.props.UI.handheld && (
        <SpringDrop className="app-drops" options={{
          textWords: [
            "FRONT-END",
            "WEB-APP",
            "UI/UX"
          ],
          timeOut: 5000,
          width: this.props.UI.width,
          height: 720
        }}/>
      )}
        <Navigation/>
        <BannerContent {...this.props}/>
      </div>
    )
  }
}

class DistortContentByMouse extends React.PureComponent {
  constructor(props,context) {
    super(props);
    this.state = {
      // scaling up with hardware acceleration will consider the vector as texture, thus pixelated animation
      // so solution to init the init scale with more than 1 then scale down and then we have larger texture for scale up
      transform: 'scale3d(1.5,1.5,1.5)',
      zoom: 1,
      reverseDirection: false,
      duration: 0.5,
      limitAngleX: 3,
      limitAngleY: 3,
      excludeAreaRadius: 300,
        ...this.props.options
    };
    this.onMouseMove = this.onMouseMove.bind(this);
  }
  onMouseMove(e) {
    let posData = this.skew.getBoundingClientRect();
    let pivotX = (posData.width+posData.left)/2;
    let pivotY = (posData.height+posData.top)/2;
    let mPosX = e.clientX || e.layerX || e.pageX;
    let mPosY = e.clientY || e.layerX || e.pageY;
    let skewX = 2*(mPosX - pivotX)/posData.width;
    let skewY = 2*(mPosY - pivotY)/posData.height;
    skewY = Math.abs(skewY) > 1 ? 0 : this.state.reverseDirection ? -skewY : skewY;
    skewX = Math.abs(skewX) > 1 ? 0 : skewY == 0 ? 0 : this.state.reverseDirection ? -skewX : skewX;
    let scale = skewX == 0 ? 1 : this.state.zoom;
    this.setState({
      transform: `skew(${skewX*this.state.limitAngleX}deg,${skewY*this.state.limitAngleY}deg) rotateY(${skewX*this.state.limitAngleX*5}deg) rotateX(${skewY*this.state.limitAngleY*5}deg) scale3d(${scale},${scale},${scale})`
    });
  }
  componentDidMount() {
    window.addEventListener('mousemove',this.onMouseMove);
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove',this.onMouseMove);
  }
  componentDidUpdate() {

  }
  render() {
    return (
      <div ref={skew => this.skew = skew} className="app-skew" style={{
        position:'absolute',
        width:'100%',
        height:'100%',
        transform: this.state.transform,
        transition: `transform ${this.state.duration}s ease-out`
        }}>
        {this.props.children}
      </div>
    )
  }
}

const BannerContent = (props) => (
  <DistortContentByMouse>
    <div className="app-banner-content">
      <Row>
        <Column className="text-center" small={12} centerOnSmall>
          <Motion defaultStyle={{ value: -1000 }} style={{ value: spring(0, presets.wobbly) }}>
            {item => {
              return (
                <TitleString className="content-greeting"  style={{transform: `translateY(${item.value}px)`}} title="Hi there! I am U.P"/>
              )
            }}
          </Motion>
          <Motion defaultStyle={{ value: -window.innerWidth }} style={{ value: spring(0, presets.wobbly) }}>
            {item => (
              <TitleString className="content-design"  style={{transform: `translateX(${item.value}px)`}} title={`Designer`}/>
            )}
          </Motion>
          {props.UI.handheld && (
            <Motion defaultStyle={{ value: -9000 }} style={{ value: spring(0, presets.wobbly) }}>
              {item => (
                <TitleString className="content-frontend"  style={{transform: `translateY(${item.value}px)`}} title={`Front-end`}/>
              )}
            </Motion>
          )}
          <Motion defaultStyle={{ value: 0 }} style={{ value: spring(1, presets.wobbly) }}>
            {item => (
              <div className="content-linebreak" style={{transform: `scaleX(${item.value})`}}></div>
            )}
          </Motion>
          <Motion defaultStyle={{ value: window.innerWidth }} style={{ value: spring(0, presets.wobbly) }}>
            {item => (
              <TitleString className="content-develop"  style={{transform: `translateX(${item.value}px)`}} title={`[Developer]`}/>
            )}
          </Motion>
        </Column>
      </Row>
    </div>
  </DistortContentByMouse>
);

const TitleString = (props) => {
  let array = [];
  for (let i=0;i<props.title.length;i++){
    array.push(props.title.charAt(i));
  }
  return (
    <h1 className={props.className} style={props.style}>
      {array.map((value,index)=>{
      return <span key={index}>{value}</span>
    })}
    </h1>
  );
};