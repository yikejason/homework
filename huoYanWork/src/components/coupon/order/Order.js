import React, {Component} from 'react';
import './../../commonComponents/animate.css';
import './order.less';
import $ from  'jquery';
import Pay_Party_Payment from '../../commonComponents/thirdPay/payModel';
import {Tabs,Toast} from 'antd-mobile';
import {getFetch,postFetch} from '../../../config/fetch';
import config from "../../../config/config";
import publicMethod from '../../../config/publicMethod';
let browser,orderId;
class Order extends Component {
    state = {
        payType:0,
        product:undefined,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        orderId = publicMethod.getQueryString('orderId');
    }
    componentDidMount() {
        Pay_Party_Payment.init();
        browser = publicMethod.isBrowser();
        if(orderId){
            this.getOrder();
        }else {
            this.getProduct();
        }
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     * 获取订单详情
     */
    getOrder(){
        let {product={}} = this.state;
        getFetch(`${config.shopurl}my/order/getOrderInfoByID`,{id:orderId}).then(res => {
            if(res.Ret === 0){
                 this.setState({product:res.Data.goods[0]})
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     * 重新支付
     */
    payAgain(){
        let {payType} = this.state;
        let type;
        if(payType === 1){
            if(browser.type === 1){
                type = 10
            }else {
                type = 11
            }
        }else if(payType === 2){
            type = 1
        }else {
            type = 7
        }
        let obj = {
            channel:type,
            extra:JSON.stringify({
                type:'zuoye',
                pageType:'1',
             })
        };
        postFetch(`${config.shopurl}my/order/payOrderByuserid`,{token:sessionStorage.getItem('token'),order_id:orderId},obj).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                Pay_Party_Payment.directPay(res.Data);
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     * 获取商品详情
     */
    getProduct(){
        setTimeout(()=>{
            Toast.loading('Loading...',1000);
        });
        getFetch(`${config.shopurl}widget/Service/getCartServerGoods`,null).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                this.setState({
                    product:res.Data
                })
                // this.props.history.push('/coupon/order/');
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *确认支付
     */
    nowPay(){
        if(orderId){
            this.payAgain();
            return;
        }
        let {payType,product} = this.state;
        let obj,type;
        if(!payType || payType === ''){
            Toast.info('请选择支付方式！',1);
            return;
        }
        if(payType === 1){
            if(browser.type === 1){
                type = 10
            }else {
                type = 11
            }
        }else if(payType === 2){
            type = 1
        }else {
            type = 7
        }
        obj = {
            activity:undefined,
            telToken:undefined,
            seller:undefined,
            pay_channel:type,
            goods_id:product.goods_id,
            sku_id:product.sku_id,
            Extra:JSON.stringify({
                type:'zuoye',
                pageType:'1',
            })
        };
        setTimeout(()=>{
            Toast.loading('Loading...', 1000);
        });
        postFetch(`${config.shopurl}widget/Service/createOrder`,{token:sessionStorage.getItem('token')},obj).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                 Pay_Party_Payment.directPay(res.Data);
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *选择支付方式
     */
    choicePayType(type){
        this.setState({
            payType:type
        })
    }
    render(){
        let {payType,product} = this.state;
        return(
            <div className="order animated fadeIn">
                <div className="order-content">
                    {
                        product?<div className="header">
                            <section>
                                <div>
                                    <p>{product.goods_price}元</p>
                                    <p>{product.product_number}张</p>
                                </div>
                            </section>
                            <section>
                                {product.sku_name}
                            </section>
                            <section>
                                ¥{product.goods_price}元
                            </section>
                        </div>:null
                    }
                    <div className="payTypeList">
                        <div className="pay-title">选择支付方式：</div>
                        {
                            browser&&(browser.type === 1 || browser.type === 2)?<div className="list-item" onClick={()=>this.choicePayType(1)}>
                                <img src={require('../../../images/wechatpay.png')} alt=""/>
                                <span>微信支付</span>
                                {
                                    payType === 1?<img src={require('../../../images/hascheck.png')} alt=""/>:<img src={require('../../../images/checkbox.png')} alt=""/>
                                }
                            </div>:''
                        }
                        <div className="list-item" onClick={()=>this.choicePayType(2)}>
                            <img src={require('../../../images/zhifubao.png')} alt=""/>
                            <span>支付宝支付</span>
                            {
                                payType === 2?<img src={require('../../../images/hascheck.png')} alt=""/>:<img src={require('../../../images/checkbox.png')} alt=""/>
                            }
                        </div>
                        <div className="list-item" onClick={()=>this.choicePayType(3)}>
                            <img src={require('../../../images/yinglian.png')} alt=""/>
                            <span>银联在线支付</span>
                            {
                                payType === 3?<img src={require('../../../images/hascheck.png')} alt=""/>:<img src={require('../../../images/checkbox.png')} alt=""/>
                            }
                        </div>
                    </div>
                </div>
                <div className="bottom-btn">
                    <p>
                        <span>合计：</span>
                        <span>¥{product?product.goods_price:null}</span>
                    </p>
                    <p>找人代付</p>
                    <p onClick={()=>this.nowPay()}>确认支付</p>
                </div>
            </div>
        )
    }
}

export default Order;
