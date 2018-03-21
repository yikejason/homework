import React, {Component} from 'react';
import './shareIntroduce.less';
import {Tabs} from 'antd-mobile';
import publicMethod from '../../../config/publicMethod';
class MineContainer extends Component {
    state = {
        tab:0,
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
        let {tab} = this.state;
        const tabs = [
            { title: '可用券', sub: 0},
            { title: '过期券', sub: 1},
            { title: '分享得券', sub:3},
        ];
        return(
            <div className="shareIntroduce">
                <div className="shareIntroduce-content">
                    <div className="img-contain">

                    </div>
                    <div className="share-instro">成功邀请1位好友购买作业券后，你将获得该好友首次购买
                        作业券得<span>1/10</span>张</div>
                    <div className="share-btn-contain">
                        <div className="share-btn">分享</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MineContainer;