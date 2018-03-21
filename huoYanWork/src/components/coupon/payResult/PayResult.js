import React, {Component} from 'react';
import './payResult.less';
import {Tabs,Toast} from 'antd-mobile';
import {getFetch,postFetch} from "../../../config/fetch";
import config from "../../../config/config";
import './../../commonComponents/animate.css';
import publicMethod from './../../../config/publicMethod';
let browser;
class PayResult extends Component {
    state = {
        tab:0,
        payInfo:JSON.parse(decodeURIComponent(publicMethod.getQueryString('payResult'))),
        orderInfo:undefined,
    };
    componentWillMount(){
        let {payInfo} = this.state;
        if(payInfo.paystate == 'cancel'){
            this.props.history.push('/coupon/withoutBuyCoupon');
        }
        publicMethod.showAppMenu();
    }
    componentDidMount() {
        browser = publicMethod.isBrowser();
        this.getOrder();
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }

    /**
     * 获取订单详情
     */
    getOrder(){
        let {payInfo} = this.state;
        getFetch(`${config.shopurl}my/order/getOrderInfoByID`,{id:payInfo.orderid,is_server:true}).then(res => {
            if(res.Ret === 0){
                this.setState({orderInfo:res.Data})
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *处理时间
     */
    handleTime(time){
        let commonTime = new Date(time*1000);
        return (commonTime.getFullYear()+1) + "-" +(commonTime.getMonth()<9?'0':'')+(commonTime.getMonth() + 1) + "-" + (commonTime.getDate()<10?'0'+commonTime.getDate():commonTime.getDate());
    }
    /**
     * 跳转到订单详情页面
     */
    goOrderDetail(){
        let {payInfo} = this.state;
        let extra = JSON.parse(payInfo.extra);
        let page = extra.pageType;
        if(page == 1){
            this.props.history.push('coupon/order?orderId='+payInfo.orderid);
        }else {
            this.props.history.push('coupon/withoutOrderDetail?orderId='+payInfo.orderid+'&activity='+extra.activity+'&seller='+extra.seller);
        }
    }
    /**
     * 跳转到商品页面
     */
    goBuy(){
        let {payInfo} = this.state;
        // let page = JSON.parse(payInfo.extra).pageType;
        if(browser.type === 1){
            this.props.history.push('/coupon/buyCoupon');
        }else {
            this.props.history.push('/coupon/withoutBuyCoupon');
        }
    }
    /**
     *跳转到下载app页面
     */
    goPage(){
        if(browser.type === 1){
            this.props.history.push('/work');
        }else {
            window.location.href = 'ucux://';
            this.props.history.push('/downloadApp');
        }
    }
    render(){
        let {payInfo,orderInfo} = this.state;
        return(
            <div className="payResult animated fadeIn">
                <div className="payResult-content">
                    <div className="img-contain">
                        <img src={require('./../../../images/pay-result-img.png')} alt=""/>
                    </div>
                    {
                        payInfo&&payInfo.paystate == 'true'?<div>
                            {
                                orderInfo?<p className="title">您已经成功购买<span>{orderInfo.goods[0].sku_name}</span></p>:''
                            }
                            <div className="product-contain">
                                <div className="coupon-item">
                                    <section className="coupon-header">
                                        <p>通用</p>
                                        <p>作业券</p>
                                    </section>
                                    <section className="coupon-body">
                                        <p>有效期至</p>
                                        {
                                            orderInfo?<p>{this.handleTime(orderInfo.add_time)}</p>:''
                                        }
                                        {/*<p>来自“思聪作业”赠送</p>*/}
                                        <div className="number-contain">
                                            {orderInfo?<p>{orderInfo.goods[0].goods_id === 40090?'5':orderInfo.goods[0].sku_number}张</p>:''}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>:''
                    }
                    {
                        payInfo&&payInfo.paystate == 'false'?<div className="no-pay">
                            <img src={require('./../../../images/no-pay-icon.svg')} alt=""/>
                            <p>支付失败</p>
                        </div>:''
                    }
                    {
                        payInfo&&payInfo.paystate === 'false'?<div className="btn-contain">
                            <p onClick={()=>this.goBuy()}>返回</p>
                            <p onClick={()=>this.goOrderDetail()}>重新购买</p>
                        </div>:''
                    }
                </div>
                {
                    browser&&browser.type === 1?<div className="btn-contain">
                            <p onClick={()=>this.goPage()}>去使用</p>
                            <p onClick={()=>this.goBuy()}>继续购买</p>
                        </div>:
                        <div className="btn-contain">
                            <p onClick={()=>this.goPage()}>去使用</p>
                            <p onClick={()=>this.goBuy()}>继续购买</p>
                        </div>
                }
            </div>
        )
    }
}

export default PayResult;
