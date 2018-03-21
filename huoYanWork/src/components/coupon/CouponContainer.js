import React, {Component} from 'react';
import {Tabs,ActivityIndicator,Modal} from 'antd-mobile';
import './../commonComponents/animate.css';
import config from '../../config/config';
import {getFetch,postFetch} from '../../config/fetch';
import Footer from './../commonComponents/footer/Footer.js';
import publicMethod from '../../config/publicMethod';
import Tloader from 'react-touch-loader';
import './couponContainer.less';
let pageIndex;
const tabs = [
    { title: '可用券', sub: 0},
    { title: '过期券', sub: 1},
    { title: '分享得券',sub:3},
];
class MineContainer extends Component {
    state = {
        tab:0,
        showTab:false,
        pullDownState:false,
        couponList:undefined,
        overTimeCouponList:undefined,
        shareInfo:undefined,
        shareRecordList:undefined,
        modal1:false,
        refreshedAt: Date.now(),//下拉刷新声明
        canRefreshResolve: 1,//触发下拉刷新
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        pageIndex = 1;
        let browser = publicMethod.isBrowser();
        if(browser.type !== 1){
            // this.props.history.push('/downloadApp');
        }
    }
    componentDidMount() {
        let tab = sessionStorage.getItem('tab');
        if(tab){
            this.setState({tab:parseInt(tab)},()=>{
                setTimeout(()=>{
                    this.setState({showTab:true},()=>{
                        if(tab == 2){
                            document.getElementById('scroll-contain').addEventListener('scroll',()=>this.pullDown(),false);
                        }
                    });
                },360);

            });
        }else {
            setTimeout(()=>{
                this.setState({showTab:true});
            },0);
        }
        this.getCouponList();
        this.getShareRecord();
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     * 下拉刷新券列表
     */
    refresh(resolve, reject) {
        setTimeout(() => {
            if (!this.state.canRefreshResolve) return reject();

            this.setState({
                listLen: 9,
                refreshedAt: Date.now()
            });
            this.getCouponList();
            resolve();
        }, 2e3);
    }
    /**
     * 获取券列表
     */
    getCouponList(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        console.log(JSON.stringify(req));
        postFetch(`${config.hyurl}youxin/user/getviplist`,null,req).then((result)=>{
            if(result.Code === 0){
                if(result.Data.length>0){
                    let couponList = [],overTimeCouponList = [];
                    result.Data.map((item,e)=>{
                        if(item.expire === 1){
                            couponList.push(item);
                        }else if(item.expire === 0){
                            overTimeCouponList.push(item);
                        }
                    });
                    this.setState({
                        couponList:couponList,
                        overTimeCouponList:overTimeCouponList,
                    })
                }else {
                    this.setState({
                        couponList:[],
                        overTimeCouponList:[],
                    })
                }
            }
        })
    }
    /**
     *储存用户的tab切换
     */
    setTab(tab,index){
        this.setState({tab:index},()=>{
            if(index == 2){
                console.log(document.getElementById('scroll-contain'));
                document.getElementById('scroll-contain').addEventListener('scroll',()=>this.pullDown(),false);
            }
        });
        sessionStorage.setItem('tab',index);
    }
    /**
     *去购买作业券
     */
    goBuy(){
        getFetch(`${config.shopurl}my/Service/purchaseGoodBuyRecord`,null).then((result)=>{
            if(result.Ret === 0){
                if(!result.Data.is_buy_record){
                    this.props.history.push("/coupon/buyCoupon");
                }else {
                    this.setState({
                        modal1:true,
                    })
                }
            }
        });
    }
    /**
     *赠送作业券
     */
    friend(){
        this.props.history.push("coupon/sendCoupon");
    }

    /**
     * 我的分享得券记录
     */
    getShareRecord(){
        let req = config.appInfo;
        let {shareRecordList = []} = this.state;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            page: pageIndex,
            pagenum:10
        });
        postFetch(`${config.hyurl}youxin/user/mysharerecord`,null,req).then((result)=>{
            if(result.Code === 0){
                if(result.Data.shareinfo&&result.Data.shareinfo.length>0){
                    this.setState({
                        shareInfo:result.Data,
                        shareRecordList:shareRecordList.concat(result.Data.shareinfo),
                        pullDownState:true
                    })
                }else {
                    this.setState({
                        shareRecordList:shareRecordList,
                    })
                }
            }
        })
    }
    /**
     * 下拉加载
     */
    pullDown(){
        let {shareInfo,pullDownState} = this.state;
        let totalHeight = document.getElementById('scroll-contain').offsetHeight;// 容器总高度
        let scrollTop = document.getElementById('scroll-contain').scrollTop; // 被卷去的高度
        let scrollHeight = document.getElementById('scroll-contain').scrollHeight; // 滚动条总高度
        if(!shareInfo.more){
            return;
        }
        if(scrollHeight-scrollTop < totalHeight+50){
            if(pullDownState){
                this.setState({
                    pullDownState:false
                },()=>{
                    pageIndex += 1;
                    this.getShareRecord();
                });
            }
        }
    }
    /**
     *跳转分享
     */
    goShare(){
        this.props.history.push("coupon/share");
    }
    /**
     *处理时间
     */
    handleTime(time){
        let commonTime = new Date(time*1000);
        return commonTime.getFullYear() + "-" +(commonTime.getMonth()<9?'0':'')+(commonTime.getMonth() + 1) + "-" + (commonTime.getDate()<10?'0'+commonTime.getDate():commonTime.getDate());
    }
    go(){

    }
    render(){
        let {tab,couponList,overTimeCouponList,shareInfo,shareRecordList,showTab,modal1} = this.state;
        return(
            <div className="couponContainer animated fadeIn">

                <Modal
                    title=""
                    className="vote-tip"
                    visible={modal1}
                    transparent
                    maskClosable={false}
                    footer={[{ text: '知道了', onPress: () => this.props.history.push("/coupon/buyCoupon") }]}
                    platform="ios">
                    {
                        <div style={{color:'#333',fontSize:'16px',}}>尊敬的用户，您有一次新客体验还未购买，请通过宣传单购买！</div>
                    }
                </Modal>

                {
                    showTab? <div className="couponContainer-content">
                        <Tabs  tabs={tabs}
                               swipeable = {false}
                            //initialPage={0}
                               page={tab}
                               onTabClick={(tab,index) => this.setTab(tab,index)}
                        >
                            <div className="tab-one">
                                <div className="tab-content">
                                    {
                                        !couponList?<div className="load">
                                            <ActivityIndicator  text="Loading..."  size="large"/>
                                        </div>:''
                                    }
                                    {
                                        couponList&&couponList.length>0?couponList.map((item,e)=>
                                            <div className="coupon-item" key={e}>
                                                <section className="coupon-header">
                                                    <p>{item.grade}</p>
                                                    {
                                                        item.type === 2?<p>作业券</p>:''
                                                    }
                                                </section>
                                                <section className="coupon-body">
                                                    <p>有效期至</p>
                                                    <p>{this.handleTime(item.deadline)}</p>
                                                    {
                                                        item.comefrom === 0 || item.comefrom === 2? <p>来自“有笔作业”赠送</p>:''
                                                    }
                                                    {
                                                        item.comefrom === 3? <p>来自“{item.fromnickname}”赠送</p>:''
                                                    }
                                                    <div className="number-contain">
                                                        <p>剩余</p>
                                                        <p>{item.surplus}张</p>
                                                    </div>
                                                </section>
                                            </div>):''
                                    }
                                    {/*{couponList&&couponList.length>0? <Tloader*/}
                                    {/*autoLoadMore={false}*/}
                                    {/*className="tloader"*/}
                                    {/*onRefresh={(resolve, reject) => this.refresh(resolve, reject)}>*/}
                                    {/*{*/}
                                    {/*couponList&&couponList.length>0?couponList.map((item,e)=>*/}
                                    {/*<div className="coupon-item" key={e}>*/}
                                    {/*<section className="coupon-header">*/}
                                    {/*<p>{item.grade}</p>*/}
                                    {/*{*/}
                                    {/*item.type === 2?<p>作业券</p>:''*/}
                                    {/*}*/}
                                    {/*</section>*/}
                                    {/*<section className="coupon-body">*/}
                                    {/*<p>有效期至</p>*/}
                                    {/*<p>{this.handleTime(item.deadline)}</p>*/}
                                    {/*{*/}
                                    {/*item.comefrom === 0 || item.comefrom === 2? <p>来自“有笔作业”赠送</p>:''*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*item.comefrom === 3? <p>来自“{item.fromnickname}”赠送</p>:''*/}
                                    {/*}*/}
                                    {/*<div className="number-contain">*/}
                                    {/*<p>剩余</p>*/}
                                    {/*<p>{item.surplus}张</p>*/}
                                    {/*</div>*/}
                                    {/*</section>*/}
                                    {/*</div>*/}
                                    {/*):''*/}
                                    {/*}*/}
                                    {/*</Tloader>:null}*/}

                                    {
                                        couponList&&couponList.length===0? <div className="no-coupon">
                                            <img src={require('./../../images/kong.png')} alt=""/>
                                            <p>您暂时没有可用券，购买即可获取</p>
                                        </div>:''
                                    }
                                    <div className="btn-contain">
                                        <div className="btn-buy" onClick={()=>this.goBuy()}>购买辅导券</div>
                                        {
                                            couponList&&couponList.length ===0? '':<div className="btn-send" onClick={()=>this.friend()}>赠送给朋友</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="tab-two">
                                <div className="tab-content">
                                    {
                                        overTimeCouponList&&overTimeCouponList.length>0?overTimeCouponList.map((item,e)=>
                                            <div className="coupon-item overdue" key={e}>
                                                <section className="coupon-header">
                                                    <p>{item.grade}</p>
                                                    {
                                                        item.type === 2?<p>作业券</p>:''
                                                    }
                                                </section>
                                                <section className="coupon-body">
                                                    <p>有效期至</p>
                                                    <p>{this.handleTime(item.deadline)}</p>
                                                    {
                                                        item.comefrom === 0 || item.comefrom === 2? <p>来自“有笔作业”赠送</p>:''
                                                    }
                                                    {
                                                        item.comefrom === 3? <p>来自“{item.fromnickname}”赠送</p>:''
                                                    }
                                                    <div className="number-contain">
                                                        <p>剩余</p>
                                                        <p>{item.surplus}张</p>
                                                    </div>
                                                </section>
                                            </div>
                                        ):''
                                    }
                                    {
                                        overTimeCouponList&&overTimeCouponList.length === 0? <div className="no-coupon">
                                            <img src={require('./../../images/kong.png')} alt=""/>
                                            <p>您暂时没有过期券</p>
                                        </div>:''
                                    }
                                    <div className="btn-contain">
                                        <div className="btn-buy" onClick={()=>this.goBuy()}>购买辅导券</div>
                                        {
                                            overTimeCouponList&&overTimeCouponList.length ===0? '':<div className="btn-send" onClick={()=>this.friend()}>赠送给朋友</div>
                                        }
                                    </div>
                                    {
                                        overTimeCouponList&&overTimeCouponList.length ===0?'':  <p className="two-tip">购买的作业券过期了，赠送给有需要的朋友，他在2周内均可使用</p>
                                    }
                                </div>
                            </div>
                            <div className="tab-three" id="scroll-contain">
                                <div  className="tab-three-scroll">
                                    <div className="share-tip">
                                        <img src={require('./../../images/share-show.jpg')} alt=""/>
                                        <p className="share-instro">成功邀请1位好友购买作业券后，您将获得<span>2</span>张作业券</p>
                                        <div className="share-btn" onClick={()=>this.goShare()}>我要分享</div>
                                    </div>
                                    {
                                        shareInfo?<div className="title">邀请{shareInfo.sharepersonnum}人，获得<span>{shareInfo.couponum}</span>张券</div>:''
                                    }
                                    <div className="table-contain">
                                        <section>
                                            <p>好友</p>
                                            <p className="time">加入时间</p>
                                            <p>购买张数</p>
                                            <p>得券</p>
                                        </section>
                                        {
                                            shareRecordList&&shareRecordList.length === 0?<div className="no-share-record">您暂时没有得券信息</div>:''
                                        }
                                        {
                                            shareRecordList&&shareRecordList.length !== 0?shareRecordList.map((item,e)=>
                                                <section className="table-item" key={e}>
                                                    <p>{item.purchaser ? item.purchaser:'优信用户'}</p>
                                                    <p className="time">{this.handleTime(item.createtime)}</p>
                                                    <p>{item.buycouponum}</p>
                                                    <p>{item.getnum}</p>
                                                </section>
                                            ):''
                                        }
                                    </div>
                                </div>
                                {/*<div className="share-btn" onClick={()=>this.goShare()}>我要分享</div>*/}
                                {/*<div className="share-instro">成功邀请1位好友购买作业券后，您将获得两张作业券*/}
                                {/*作业券得<span>1/10</span>张</div>*/}
                            </div>
                        </Tabs>
                    </div>:''
                }
                <Footer {...this.props}/>
            </div>
        )
    }
}

export default MineContainer;