import React, {Component} from 'react';
import './../commonComponents/animate.css';
import './mineContainer.less';
import {getFetch,postFetch} from '../../config/fetch';
import Footer from '.././commonComponents/footer/Footer';
import publicMethod from '../../config/publicMethod';
import config from '../../config/config';
class MineContainer extends Component {
    state = {
        tasktype:2,//(1为难题 2为作业类型)
        gradeid:undefined,//年级id
        orderNum:undefined,//待支付点单数
        name:undefined,
        avatar:undefined,
        couponNum:undefined,//辅导劵数量
        taskNum:undefined,//作业数量
        gradeInfo:[],
        tab:1,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        this.getUserInfo();//获取用户信息
    }
    componentDidMount() {
        this.getGradeInfo();//获取用户年级信息
        this.getUserCoupon();//获取用户劵数量
        this.getOrderNum();//获取待支付单数
        this.getUserTaskNum();//获取作业数量
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     *获取当前用户的信息
     */
    getUserInfo(){
        getFetch(`${config.uxurl}base/v3/User/GetCurUserInfo`,null).then(res => {
            if(res.Ret==0){
                this.setState({
                    name:res.Data.Name,
                    avatar:res.Data.Pic
                });
            }
        })
    }
    /**
     *获取订单的数量
     */
    getOrderNum(){
        getFetch(`${config.shopurl}my/order/getUserOrderNumber`,{shop_id:config.shop_id}).then(res => {
            if(res.Ret==0){
                this.setState({orderNum:res.Data.waitPay.c});
            }
        })
    }
    /**
     *获取用户年级的信息
     */
    getGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        postFetch(`${config.hyurl}youxin/user/getusergradeinfo`,null,req).then(res => {
            if(res.Code==0){
                this.setState({
                    gradeInfo:res.Data.gradelist
                })
            }
        })
    }
    /**
     *获取用户辅导劵的数量
     */
    getUserCoupon(){
        let {tasktype,gradeid} = this.state;
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            tasktype:tasktype,
            gradeid:gradeid,
        });
        postFetch(`${config.hyurl}youxin/user/getusercoupon`,null,req).then(res => {
            if(res.Code==0){
                this.setState({
                    couponNum:res.Data.hw_num
                })
            }
        })
    }
    /**
     *获取我的作业数量
     */
    getUserTaskNum (){
        let {tasktype,gradeid} = this.state;
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            tasktype:tasktype,
        });
        postFetch(`${config.hyurl}youxin/user/getusertasknum`,null,req).then(res => {
            if(res.Code==0){
                this.setState({
                    taskNum:res.Data.hw_num
                })
            }
        })
    }
    /**
     *跳转到我的详情页面
     */
    goMineDetail(){
        this.props.history.push('/mine/mineDetail');
    }
    /**
     *跳转到拍作业页面
     */
    goPublishWork(){
        this.props.history.push('/work');
    }
    /**
     *跳转到劵页面
     */
    goCoupon(id){
        this.props.history.push('/coupon');
        sessionStorage.setItem('tab',id);
    }
    /**
     *跳转到拍作业页面
     */
    goPaymentOrder(){
        this.props.history.push('/coupon/paymentOrder');
    }
    render(){
        let {gradeInfo} = this.state;
        return(
            <div className="mineContainer">
                <div className="mineContainer-content">
                    <div className="mineContainer-content-head" onClick={() => this.goMineDetail()}>
                        <div className="mineContainer-avatar">
                            {this.state.avatar ? <img src={this.state.avatar}  className="mineContainer-avatar-img"/> :null}
                            {/*{!this.state.avatar ? <img src={require('../../images/head-avatar.png')} alt="" className="mineContainer-avatar-img"/>:null}*/}
                        </div>
                        <div className="mineContainer-userInfo">
                            <div>{this.state.name}</div>
                            <div className="user-info-number">
                                {gradeInfo.length<=2 ? gradeInfo.map((e,i)=><span key={i}>{e.grade}&nbsp;</span>)
                                    : gradeInfo.length>2 ? <div><span >{gradeInfo[0].grade}</span>&nbsp;<span>{gradeInfo[1].grade}</span><span>...</span></div> :
                                    null}
                            </div>
                        </div>
                        <div className="mineContainer-content-head-img">
                            <img src={require('../../images/right.png')} alt=""/>
                        </div>
                    </div>
                    <div className="mineContainer-content-main">
                        <div className="mineContainer-item" onClick={() => this.props.history.push('/coupon/buyCoupon')}>
                            <div className="mineContainer-item-meal">
                                <img src={require('../../images/meal.png')} alt=""/>
                            </div>
                            <div>购买套餐</div>
                            <div className="mineContainer-item-info">全科使用</div>
                        </div>
                        <div className="mineContainer-item-a" onClick={() => this.goPaymentOrder()}>
                            <div className="mineContainer-item-shop">
                                <img src={require('../../images/shop.png')} alt=""/>
                            </div>
                            <div>待支付订单</div>
                            <div className="mineContainer-item-info">{this.state.orderNum}</div>
                        </div>
                        <div className="mineContainer-item" onClick={() => this.goCoupon(2)}>
                            <div className="mineContainer-item-share">
                                <img src={require('../../images/share.png')} alt=""/>
                            </div>
                            <div>分享得劵</div>
                            <div className="mineContainer-item-info">分享得劵</div>
                        </div>
                    </div>
                    <div className="mineContainer-content-foot">
                        <div className="mineContainer-foot-item" onClick={() => this.goCoupon(0)}>
                            <div className='foot-item-left'>
                                <img src={require('../../images/tutorship.png')} alt=""/>
                                我的辅导劵
                            </div>
                            <div className="foot-item-r">
                                {this.state.couponNum}
                                <img src={require('../../images/right.png')} alt=""/>
                            </div>
                        </div>
                        <div className="mineContainer-foot-item" onClick={() => this.goPublishWork()}>
                            <div className='foot-item-right'>
                                <img src={require('../../images/myWork.png')} alt=""/>
                                我的作业
                            </div>
                            <div className="foot-item-r">
                                {this.state.taskNum}
                                <img src={require('../../images/right.png')} alt=""/>
                            </div>
                        </div>
                        {/*<div className="mineContainer-foot-item">*/}
                            {/*<div>*/}
                                {/*我的难题*/}
                            {/*</div>*/}
                            {/*<div>*/}
                                {/*16*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <Footer {...this.props}/>
            </div>
        )
    }
}

export default MineContainer;