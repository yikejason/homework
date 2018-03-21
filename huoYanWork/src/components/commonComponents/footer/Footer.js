import React, { Component } from 'react';
import './footer.less';

class Footer extends Component {
    render() {
        const {path} = this.props.match;
        const isWork = path.indexOf('work') >= 0 ;
        const isPublishWork = path.indexOf('publish') >= 0 ;
        const isCoupon = path.indexOf('coupon') >= 0 ;
        const isMine = path.indexOf('mine') >= 0 ;
        return (
            <div className="footer" style={{ display: 'flex',position: 'fixed',width:'100%',fontSize:'30px'}}>
                <div className="tab_work" onClick={() => this.props.history.push('/work')}>
                    <img src={isWork ? require('../../../images/checked-publish-work.png') : require('../../../images/publish-work.png')} alt="" />
                    <p className={isWork ? 'color000' : 'color999'}>作业</p>
                </div>
                <div className="tab_publishWork" onClick={() => this.props.history.push('/publish')}>
                    <img src={isPublishWork ? require('../../../images/checked-camera.png') : require('../../../images/camera.png')} alt=""/>
                    <p className={isPublishWork ? 'color000' : 'color999'}>拍作业</p>
                </div>
                <div className="tab_coupon" onClick={() => this.props.history.push('/coupon')}>
                    <img src={isCoupon ? require('../../../images/checked-coupon.png') : require('../../../images/coupon-icon.png')} alt="" />
                    <p className={isCoupon ? 'color000' : 'color999'}>券</p>
                </div>
                <div className="tab_mine" onClick={() => this.props.history.push('/mine')}>
                    <img src={isMine ? require('../../../images/checked-my-icon.png') : require('../../../images/my-icon.png')} alt="" />
                    <p className={isMine ? 'color000' : 'color999'}>我的</p>
                </div>
            </div>)
    }
}


export default Footer;

