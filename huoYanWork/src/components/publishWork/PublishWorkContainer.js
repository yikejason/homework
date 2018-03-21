import React, {Component} from 'react';
import Footer from './../commonComponents/footer/Footer';
import './pubilshWorkContainer.less';
import publicMethod from '../../config/publicMethod';
class WorkContainer extends Component {
    state = {
        userInfo:undefined
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {

    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    render(){
        return(
            <div className="pubilshWorkContainer">
                <div className="pubilshWorkContainer-content">
                    <div className="knot" onClick={ () =>  this.props.history.push(`/publish`) }>
                        <img src={require('../../images/yiwen.png')} alt=""/>
                        <p>难题解答</p>
                    </div>
                    <div className="coach" onClick={ () =>  this.props.history.push(`/publish`) }>
                        <img src={require('../../images/fudao.png')} alt=""/>
                        <p>作业辅导</p>
                    </div>
                </div>
                <Footer {...this.props}/>
            </div>
        )
    }
}

export default WorkContainer;