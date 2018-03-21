import React, {Component} from 'react';
import './share.less';
// import {Tabs} from 'antd-mobile';
import config from './../../../config/config';
import publicMethod from  './../../../config/publicMethod';
class MineContainer extends Component {
    state = {
        showState:0,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {
        let type = publicMethod.getQueryString('type');
        if(type == 1){
           this.setState({showState:1});
        }
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     *分享
     */
    share(){
        let obj = {
            Desc: '你还在为孩子的作业检查而烦恼吗？',
            Title: '我正在使用有笔作业辅导孩子，孩子成绩提升看得见',
            ThumbImg: 'http://lapp.test.ucuxin.com/uxwork/homework.png',
            Url:config.lappurl+'uxwork/share.html?app=true&telToken='+sessionStorage.getItem('tokenId'),
            Type: 7,
        };
        publicMethod.appShare(obj);
    }
    render(){
        let {showState} = this.state;
        return(
            <div className="share">
                <div className="share-content">
                    <div className="img-contain">
                        <img src={require('./../../../images/share_01.jpg')} alt=""/>
                        <img src={require('./../../../images/share_02.jpg')} alt=""/>
                        <img src={require('./../../../images/share_03.jpg')} alt=""/>
                        <img src={require('./../../../images/share_04.jpg')} alt=""/>
                    </div>
                    <div className="share-btn" onClick={()=>this.share()}>分享</div>
                </div>
            </div>
        )
    }
}

export default MineContainer;