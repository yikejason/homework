import React, {Component} from 'react';
import './paymentOrder.less';
import './../../commonComponents/animate.css';
import {getFetch} from "../../../config/fetch";
import config from '../../../config/config';
import publicMethod from '../../../config/publicMethod';
import {Tabs,Modal,Toast,ActivityIndicator} from 'antd-mobile';
import $ from  'jquery';
import Tloader from 'react-touch-loader';
import Pay_Party_Payment from '../../commonComponents/thirdPay/payModel';
let page1,page2;
class PaymentOrder extends Component{
    state = {
        tab:0,
        deleteInfo:false,//控制删除订单的弹出框
        infodelete:false,
        payList:undefined,
        hasMore:true,
        hasMore2:true,
        payComplete:undefined,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        Pay_Party_Payment.init();
        page1 = 1;
        page2 = 1;
    }
    componentDidMount() {
        publicMethod.showAppMenu();
        this.getPayList();//我的订单待支付
        this.getPayComplete();//我的订单已支付
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }

    //我的订单待支付列表
    getPayList(resove){
        let info = {
            page:page1,
            itemsPerLoad:10,
            status:0,
            shop_id:config.shop_id,
            limit_buy:true,
        };
        let {payList = []} = this.state;
        getFetch(`${config.shopurl}my/order/getOrderListByUserID`,info).then(res => {
            if(res.Ret==0){
                this.setState({
                    payList:payList.concat(res.Data)
                },()=>{if(resove){
                    resove();
                }});
                if(page1===1&&res.Data.length<10){
                    this.setState({
                        hasMore:false,
                    })
                }
            }else if(res.Ret==1){
                if(page1 === 1){
                    this.setState({
                        payList:[],
                    })
                }else {
                    this.setState({
                        hasMore:false,
                    },()=>setTimeout(()=>{
                        Toast.info('已经是最后一页',0.9)
                    }))
                }
            }
        })
    }
    //我的订单已支付
    getPayComplete(resove){
        let info = {
            page:page2,
            itemsPerLoad:10,
            status:3,
            shop_id:config.shop_id,
            limit_buy:true,
        };
        let {payComplete = []} = this.state;
        getFetch(`${config.shopurl}my/order/getOrderListByUserID`,info).then(res => {
            if(res.Ret==0){
                this.setState({
                    payComplete:payComplete.concat(res.Data)
                },()=>{if(resove){
                    resove();
                }});
                if(page2===1&&res.Data.length<10){
                    this.setState({
                        hasMore2:false,
                    })
                }
            }else if(res.Ret==1){
                if(page2===1){
                    this.setState({
                        payComplete:[],
                    })
                }else {
                    this.setState({
                        hasMore2:false,
                    },()=>setTimeout(()=>{
                        Toast.info('已经是最后一页',0.9)
                    }))
                }
            }
        })
    }
    //删除待支付订单
    deleteOrder(e){
        this.setState({deleteInfo:false});
        if(e===1){
            return false;
        }
        let info = {
            order_sn:this.state.delid
        };
        let {payList,delid} = this.state;
        getFetch(`${config.shopurl}my/order/delete`,info).then(res => {
            if(res.Ret==0){
                payList.map((item,e)=>{
                    if(item.order_sn == delid){
                         payList.splice(e,1);
                        this.setState({payList: payList})
                    }
                });
                // setTimeout(()=>{Toast.hide();},0);
                Toast.success(res.Msg,1);
            }else{
                Toast.info(res.Msg,1);
            }
        })
    }
    // 跳转支付页面
    goOrder(id){
        this.props.history.push('/coupon/order?orderId='+id);
    }
    //删除已支付订单
    deleteComplete(e){
        this.setState({infodelete:false});
        if(e===1){
            return false;
        }
        let info = {
            order_sn:this.state.delid
        };
        let {payComplete,delid} = this.state;
        getFetch(`${config.shopurl}my/order/delete`,info).then(res => {
            if(res.Ret==0){
                payComplete.map((item,e)=>{
                    if(item.order_sn == delid){
                        payComplete.splice(e,1);
                        this.setState({payList: payComplete})
                    }
                });
                // setTimeout(()=>{Toast.hide();},0);
                Toast.success(res.Msg,1);
            }else{
                Toast.info(res.Msg,1);
            }
        })
    }
    //弹出confirm框
    delConfirmOrder(e){
        this.setState({
            deleteInfo: true,
            delid:e.order_sn
        });
    }
    payDelConfirmOrder(e){
        this.setState({
            infodelete: true,
            delid:e.order_sn
        });
    }
    //转化时间
    /**
     *处理时间
     */
    handleTime(time){
        let commonTime = new Date(time*1000);
        return commonTime.getFullYear() + "-" +(commonTime.getMonth()<9?'0':'')+(commonTime.getMonth() + 1) + "-" + commonTime.getDate()+" " +commonTime.getHours()+":" +commonTime.getMinutes();
    }
    /**
     *刷新
     */
    refresh(resove){
        page1 += 1;
        this.getPayList(resove);
    }
    refreshTwo(resove){
        page2 += 1;
        this.getPayComplete(resove);
    }
    render(){
        let {tab,deleteInfo,payList,payComplete,infodelete,hasMore,hasMore2} = this.state;
        const tabs = [
            { title: '待支付', sub: 0},
            { title: '已支付', sub: 1},
        ];
        return(
            <div className="paymentContainer animated fadeIn">
                <Modal
                    title=""
                    className="vote-tip"
                    transparent
                    maskClosable={false}
                    visible={deleteInfo}
                    footer={[{
                        text: '取消', onPress: () => {
                            this.deleteOrder(1)
                        }
                    },
                        {
                            text: '确定', onPress: () => {
                            setTimeout(()=>{Toast.loading('');},0);
                            this.deleteOrder(2)
                        }
                        }]} platform="ios">
                    <div className="paymentContainer-modal">确认删除该订单?</div>
                </Modal>
                <Modal
                    title=""
                    className="vote-tip"
                    transparent
                    maskClosable={false}
                    visible={infodelete}
                    footer={[{
                        text: '取消', onPress: () => {
                            this.deleteComplete(1)
                        }
                    },
                        {
                            text: '确定', onPress: () => {
                            setTimeout(()=>{Toast.loading('');},0);
                            this.deleteComplete(2)
                        }
                        }]} platform="ios">
                    <div className="paymentContainer-modal">确认删除该订单?</div>
                </Modal>
                <div className="paymentContainer-content">
                    <Tabs  tabs={tabs}
                           swipeable = {false}
                           page={tab}
                           onTabClick={(tab, index) => {this.setState({tab:index})}}
                    >
                            <div className="tab-content-one">
                                {
                                    payList&&payList.length !== 0?<Tloader
                                        // onRefresh={(resolve, reject) => this.refresh(resolve, reject)}
                                        hasMore={hasMore}
                                        onLoadMore={(resove)=>this.refresh(resove)}
                                        initializing={0}
                                        autoLoadMore={true}
                                        className="tloader">
                                        {payList.length !== 0 ? payList.map((e, i) =>
                                            <div className="content-one-head" key={i}>
                                                <div className="content-first">
                                                    <div className="content-first-left">
                                                        <p className="order-text">订单号:{e.order_sn}</p>
                                                        <p className="order-time">{this.handleTime(e.add_time)}</p>
                                                    </div>
                                                    <div className="content-first-right">
                                                        <img src={require('../../../images/icon_del_order_normal.png')} alt="" onClick={()=>{this.delConfirmOrder(e)}}/>
                                                    </div>
                                                </div>
                                                <div className="content-two">
                                                    <div className="content-two-left">
                                                        <div className="money">{e.goods_price}元</div>
                                                        <div className="num">{e.ticket_number}张</div>
                                                    </div>
                                                    <div className="content-two-right">
                                                        <div className="">&nbsp;&nbsp;{e.sku_name}</div>
                                                        <div className="money-num">&nbsp;&nbsp;费用:&nbsp;<span className="money-text">{e.goods_price}元</span></div>
                                                    </div>
                                                </div>
                                                <div className="content-three">
                                                    <button className="pay-btn" onClick={()=>this.goOrder(e.order_id)}>立即支付</button>
                                                </div>
                                            </div>) : null}
                                    </Tloader>:''
                                }
                                {payList&&payList.length===0 ? <div className="content-two-order">
                                    <img src={require('./../../../images/kong.png')} alt=""/>
                                    <p>您还没有任何订单！</p>
                                </div> : null}
                        </div>
                        <div className="tab-content-one">
                            {
                                payComplete&&payComplete.length>0?<Tloader
                                    initializing={0}
                                    hasMore={hasMore2}
                                    onLoadMore={(resove)=>this.refreshTwo(resove)}
                                    autoLoadMore={true}
                                    className="tloader">
                                    {payComplete.length!==0 ? payComplete.map((e, i) =>
                                        <div className="content-one-head" key={i}>
                                            <div className="content-first">
                                                <div className="content-first-left">
                                                    <p className="order-text">订单号:{e.order_sn}</p>
                                                    <p className="order-time">{this.handleTime(e.add_time)}</p>
                                                </div>
                                                <div className="content-first-right">
                                                    <img src={require('../../../images/icon_del_order_normal.png')} alt="" onClick={()=>{this.payDelConfirmOrder(e)}}/>
                                                </div>
                                            </div>
                                            <div className="content-two">
                                                <div className="content-two-left">
                                                    <div className="money">{e.goods_price}元</div>
                                                    <div className="num">{e.ticket_number}张</div>
                                                </div>
                                                <div className="content-two-right">
                                                    <div className="">&nbsp;{e.sku_name}</div>
                                                    <div className="money-num">&nbsp;&nbsp;费用:&nbsp;<span className="money-text">{e.goods_price}元</span></div>
                                                </div>
                                            </div>
                                        </div>) : null}
                                </Tloader>:''
                            }
                            {payComplete&&payComplete.length===0 ?<div className="content-two-order">
                                <img src={require('./../../../images/kong.png')} alt=""/>
                                <p>您还没有任何订单！</p>
                            </div> : ''}
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default PaymentOrder;