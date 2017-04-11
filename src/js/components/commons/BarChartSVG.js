import React from 'react';
import TweenMax from 'gsap';
import utils from '../../utils';
import { Motion, spring } from 'react-motion';
import Measure from 'react-measure';
import { Row, Column } from 'react-foundation';

class BarChartSVG extends React.Component {
  constructor(props, context) {
    super();
    this.state = {
      width: 80,
      height: 400,
      data: [
        {
          name: "HTML5",
          percentage: 92
        },
        {
          name: "CSS3",
          percentage: 79
        },
        {
          name: "JS / ES6",
          percentage: 81
        },
        {
          name: "Webpack",
          percentage: 85
        },
        {
          name: "React",
          percentage: 55
        },
        {
          name: "Redux",
          percentage: 45
        },
        {
          name: "PHP",
          percentage: 64
        },
        {
          name: "Wordpress",
          percentage: 68
        },
        {
          name: "Photoshop",
          percentage: 80
        },
        {
          name: "Illustrator",
          percentage: 69
        },
        {
          name: "Sketch",
          percentage: 56
        },
        {
          name: "After Effect",
          percentage: 55
        }
      ],
      isShow: false
    };
  }

  componentDidMount() {
    this.setState({isShow: true});
  }

  componentDidUpdate() {

  }

  render() {
    return this.state.isShow && (
        <Row>
          <Column small={12} centerOnSmall>
            <Measure>
              {dimensions => (
                // Measure works best with blank div auto bound not with svg and flex float div
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="app-barchart" width={dimensions.width}
                       height={this.state.height}
                       style={{overflow: 'visible'}}>
                    {this.state.data.map((value, index) => (
                      <BarGroup
                        name={value.name}
                        key={index} width={this.state.width}
                        height={this.state.height}
                        offset={((dimensions.width - this.state.width) / (this.state.data.length - 1)) * index}
                        delay={250 * index}
                        percentage={value.percentage}/>
                    ))}
                  </svg>
                </div>
              )}
            </Measure>
          </Column>
        </Row>
      )
  }
}

class DelayRender extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      isShow: false
    }
  }

  componentDidMount() {
    this.timeOut = setTimeout(() => {
      this.setState({isShow: true});
    }, this.props.wait);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  componentDidUpdate() {

  }

  render() {
    return this.state.isShow && this.props.children
  }
}

class BarGroup extends React.Component {
  constructor(props, context) {
    super(props);
    this.style = {
      percentage: spring(this.props.percentage, {
        stiffness: this.props.percentage,
        damping: this.props.percentage / 10
      }),
      alpha: spring(utils.reMapRange(this.props.percentage,0,100,1,0.05)),
      textOpacity: spring(1),
      fontWeight: 500
    };
    this.defaultStyle = {percentage: 0, alpha: 0,textOpacity: 0};
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <DelayRender wait={this.props.delay}>
        <svg x={this.props.offset} style={{overflow: "visible"}}>
          <Motion defaultStyle={this.defaultStyle} style={this.style}>
            {item => {
              let color = `rgba(${~~(Math.random() * 0)},${~~(Math.random() * 0)},${~~(Math.random() * 0)},${item.alpha})`;
              return (
                <g>
                  <text style={{fontWeight: item.fontWeight}} fill={`rgba(0,0,0,${item.textOpacity})`} x={0} y={this.props.height+20}>{this.props.name}</text>
                  <rect width={this.props.width} height={this.props.height} fill={color}/>
                  <path d={`M${
                    // Move to first point X Pos
                    0
                    },${
                    // Move to first point Y Pos
                    this.props.height
                    }h${
                    // Horizontal Move To (so skipping Y value) this is just X value
                    this.props.width
                    }C${
                    // The Right Curves Hander X Pos
                  this.props.width / 2
                    },${
                    // The Right Curves Handler Y Pos
                    this.props.height
                    },${
                    // The Center Point Current X Position
                  this.props.width / 2
                    },${
                    // The Center Point Current Y Position
                  this.props.height - item.percentage / 100 * this.props.height
                    },${
                    // The Center Point Current X Poisiton
                  this.props.width / 2
                    },${
                    // The Center Point Current Y Position
                  this.props.height - item.percentage / 100 * this.props.height
                    }S${
                    // The Right Curves Hander X Pos
                  this.props.width / 2
                    },${
                    // The Right Curves Handler Y Pos
                    this.props.height
                    },${
                    // Close at point X Pos
                    0
                    },${
                    // Close at point Y Pos
                    this.props.height
                    }z`} fill={color}/>
                  <circle cx={this.props.width / 2} cy={this.props.height - item.percentage / 100 * this.props.height}
                          r={this.props.width / 10}
                          fill={color}/>
                </g>
              )
            }}
          </Motion>
        </svg>
      </DelayRender>
    )
  }
};

// <path d={`M0,500h500C250,500,250,500,250,500S250,500,0,500z`} fill="#000"/> <rect width={props.width} height={props.height} fill={color}/>

export default BarChartSVG;