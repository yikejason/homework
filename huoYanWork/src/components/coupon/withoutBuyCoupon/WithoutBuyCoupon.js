import React, {Component} from 'react';
import './../buyCoupon/buyCoupon.less';
import './withoutBuyCoupon.less';
import $ from 'jquery';
import {Modal,List,Button,InputItem,Toast} from 'antd-mobile';
import config from "../../../config/config";
import publicMethod from '../../../config/publicMethod';
import {getFetch,postFetch} from "../../../config/fetch";
let browser,activity,seller,telToken;
class WithoutBuyCoupon extends Component {
    state = {
        showModal:false,
        code:'',
        phoneNumber:'',
        time:60,
        showState:0,
        productList:[],
        goods_server_info:undefined,
        modal1:false,

    };
    componentWillMount(){
        publicMethod.showAppMenu();
        activity = publicMethod.getQueryString('activity')||sessionStorage.getItem('activity');
        seller = publicMethod.getQueryString('seller')|| sessionStorage.getItem('seller');
        telToken = publicMethod.getQueryString('telToken') || sessionStorage.getItem('telToken');
    }
    componentDidMount() {
        browser = publicMethod.isBrowser();
        if(browser.type === 1){
            publicMethod.getToken(()=>this.getProductList());
        }else {
            this.getProductList();
        }
        // document.getElementById('textArea').addEventListener('focus', () => this.changeLocation('textArea'), false);
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     * ios软键盘弹出
     */
    changeLocation(elet){
        // let winHeight = document.body.clientHeight+200; //获取当前页面高度
        // window.onresize = function () {
        //     let thisHeight = document.getElementById(elet).clientHeight;
        //     if (winHeight - thisHeight > 50) {
        //         //当软键盘弹出，在这里面操作
        //         document.body.style.height = winHeight + 'px';
        //
        //     } else {
        //         //当软键盘收起，在此处操作
        //         // $('body').css('height', '100%');
        //         document.body.style.height = "100%";
        //         // alert(1)
        //     }
        // };
        // document.getElementById(elet).scrollIntoView(true);
        let bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度
        let interval;
        $("input").focus(function(){//在这里‘input.inputframe’是我的底部输入栏的输入框，当它获取焦点时触发事件
            interval = setInterval(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
                document.body.scrollTop = document.body.scrollHeight;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
            },100)
        }).blur(function(){//设定输入框失去焦点时的事件
            clearInterval(interval);//清除计时器
            document.body.scrollTop = bfscrolltop;//将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
        });
       document.getElementById(elet).scrollIntoView(true);
    }
    /**
     *获取商品列表
     */
    getProductList(){
        let req;
        req = {
            type:"zuoye",
            goods_ids:config.goods_ids,
            activity:activity,
            telToken:telToken,
            seller:seller,
        };
        postFetch(`${config.shopurl}open/ServerGoods`,null,req).then(res => {
            if(res.Ret === 0){
                this.setState({
                    productList:res.Data
                })
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     * 倒计时
     */
    countDown(){
        this.setState({showState:1});
        let setTime = setInterval(()=>{
            let {time} = this.state;
            time -= 1;
            this.setState({
                time:time
            });
            if(time < 0){
                clearInterval(setTime);
                this.setState({showState:3},()=>{
                    $('.code').eq(0).click(()=>{
                        this.getCode();
                    })
                });
            }
        },1000)
    }

    /**
     * 验证
     */
    confirm(item){
        let phoneNumber =  $('#textPhone').val();
        let code = $('#textCode').val();
        let obj;
        if(!phoneNumber||phoneNumber === ''){
            Toast.info('请填写手机号！',1);
            return;
        }
        if(!code||code === ''){
            Toast.info('请填写验证码！',1);
            return;
        }
        obj = {
            tel:phoneNumber,
            verify_code:code
        };
        Toast.loading('Loading...',100,);
        postFetch(`${config.shopurl}my/User/telSignIn`,null,obj).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                sessionStorage.setItem('token',res.Data.Token);
                sessionStorage.setItem('phone',phoneNumber);
                this.creatOrder(item);
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     * 获取验证码
     */
    getCode(){
        let {showState} = this.state;
        let phoneNumber =  $('#textPhone').val();
        if(showState === 1){
            return;
        }else {
            this.setState({time:60})
        }
        if(!phoneNumber || phoneNumber === '' || phoneNumber.length !== 11){
            Toast.info('请填写正确的手机号码',1);
            return;
        }
        postFetch(`${config.shopurl}my/Service/sendMessage`,null,{tel:phoneNumber,verifyType:'1'}).then(res => {
            if(res.Ret === 0){
                this.countDown();
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     * 查看商品详情
     */
    showDetail = (data) => {
        if(browser.type === 4){
            $('body').css({"overflow":"hidden"});
            $('.product-detail').eq(0).css('display','block');
            $('.info').html(data.goods_server_info);
            $('#know').off('click').on('click',()=>{
                $('body').css({"overflow":"auto"});
                $('.product-detail').css('display','none');
            });
        }else {
            this.setState({
                goods_server_info:data.goods_server_info,
                modal1:true,
            })
        }
    };
    /**
     *创建订单
     */
    creatOrder(item){
        let header = {
            token:sessionStorage.getItem('token'),
        };
        let req = {
            goods_id:item.goods_id,
            sku_id:item.sku_id,
            goods_number:item.attr.couponum
        };
        Toast.loading('Loading...', 1000);
        postFetch(`${config.shopurl}widget/Service/checkUserBuyRecord`,header,req).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                this.props.history.push('/coupon/withoutOrderdetail?'+ window.location.href.split('?')[1]);
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *跳转订单详情
     */
    goOrder(item){
        if(browser.type === 1){
            this.creatOrder(item);
            return;
        }else if(browser.type === 4){
            $('body').css('overflow','hidden');
            $('.user-tip').css('display','block');
            $('.user-tip').off('click').on('click',()=>{
                $('body').css('overflow','auto');
                $('.user-tip').css('display','none');
            });
            $('.userInfo').eq(0).click((event)=>{
                event.stopPropagation();
                event.preventDefault();
            });
            $('.code').eq(0).click(()=>{
                this.getCode();
            });
            $('.sure-btn').eq(0).click(()=>{
                this.confirm(item);
            });
            $('#textPhone').on("input propertychange",()=>{
                let val = $('#textPhone').val();
                if(val.length>10){
                    $('#textPhone').val(val.substring(0,11));
                }
            });
            $('#textCode').on("input propertychange",()=>{
                let val = $('#textCode').val();
                if(val.length>5){
                    $('#textCode').val(val.substring(0,6));
                }
            });
            $('#textCode').on('focus',()=>{
                this.changeLocation('textPhone')
            });
        }else {
            this.setState({showModal:true},()=>{
                setTimeout(()=>{
                    $('.am-modal-wrap-popup').click((event)=>{
                        this.setState({showModal:false})
                    });
                    $('.userInfo').click((event)=>{
                        event.stopPropagation();
                        event.preventDefault();
                    });
                    $('.code').click(()=>{
                        this.getCode();
                    });
                    $('.sure-btn').click(()=>{
                        this.confirm(item);
                    });
                    $('#textCode').on('focus',()=>{
                        this.changeLocation('textPhone')
                    });
                },100);
            });
        }
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    };
    handleChange(event){
        let inputValue = $('#textPhone').val();
        if(inputValue.length>11){
            return false;
        }
    }
    handleCode(){
        let inputValue = $('#textCode').val();
        if(inputValue.length>6){
            return false;
        }
    }
    render(){
        let {showModal,time,showState,productList,goods_server_info,modal1} = this.state;
        return(
            <div className="buyCoupon without">
                <div className="buyCoupon-content">
                    {/*手机QQ浏览器兼容 商品详情*/}
                    {
                        browser&&browser.type === 4?  <div className="product-detail">
                            <div className="detail-contain">
                                <div className="detail-content">
                                    <p className="detail-title">套餐详情</p>
                                    <div className="info">

                                    </div>
                                    <p className="btn" id="know">知道了</p>
                                </div>
                            </div>
                        </div>:<Modal
                            title="套餐详情"
                            className="vote-tip"
                            transparent
                            maskClosable={false}
                            visible = {modal1}
                            footer={[
                                {
                                    text: '知道了', onPress: () => {
                                    this.onClose('modal1')()
                                }
                                }]} platform="ios">
                            <div style={{textAlign:'left',color:'#333'}} dangerouslySetInnerHTML={{__html:goods_server_info}}>

                            </div>
                        </Modal>
                    }

                    {/*手机QQ浏览器兼容 填写用户信息*/}
                    {
                        browser&&browser.type === 4?<div className="product-detail user-tip">
                            <div className="userInfo-detail">
                                <div className="userInfo-contain">
                                    <div className="userInfo">
                                        <div className="title">请填写常用手机号码，购买成功后，用该手机号登录有笔作业即可获得专业辅导</div>
                                        <div className="userInfo-item">
                                            <div className="item-header">+86</div>
                                            <div className="user-phone">
                                                <input className="inputNumber" placeholder="请输入手机号" id = 'textPhone' type="number" />
                                            </div>
                                        </div>
                                        <div className="userInfo-item">
                                            <div style={{paddingLeft:'15px'}}>
                                                <input className="inputNumber" placeholder="请输入验证码" id = 'textCode' type="number"/>
                                            </div>
                                            {
                                                showState === 0? <div className="item-header code">发送验证码</div>:''
                                            }
                                            {
                                                showState === 1? <div className="item-header code"><span style={{color:'#888'}}>已发送({time}s)</span></div>:''
                                            }
                                            {
                                                showState === 3? <div className="item-header code">重新获取</div>:''
                                            }
                                        </div>
                                        <div className="btn-contian">
                                            <div className="sure-btn">确定</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:<Modal
                            id = 'modal'
                            transparent = {true}
                            popup
                            visible={showModal}
                            animationType="slide-up"
                        >
                            <div className="userInfo">
                                <List renderHeader={() => <div style={{fontSize:'15px',color:'#333'}}>请填写常用手机号码，购买成功后，用该手机号登录有笔作业即可获得专业辅导</div>} className="popup-list">

                                </List>
                                <div className="userInfo-item">
                                    <div className="item-header">+86</div>
                                    <div className="user-phone">
                                        {/*<input className="inputNumber" placeholder="请输入手机号" id = 'textPhone' type="number" ref="textPhone"   onChange={(event)=>this.handleChange(event)}/>*/}
                                        <InputItem placeholder="请输入手机号"
                                                   className="inputNumber"
                                                   id = 'textPhone'
                                            // value = {phoneNumber}
                                                   type="number"
                                                   maxLength ={11}
                                                   onChange={(val)=>this.handleChange()}/>
                                    </div>
                                </div>
                                <div className="userInfo-item">
                                    <div>
                                        {/*<input className="inputNumber" placeholder="请输入验证码" id = 'textCode' type="number"  onChange={(event)=>this.handleCode(event)}/>*/}
                                        <InputItem placeholder="请输入短信验证码"
                                                   id = 'textCode'
                                                   className="inputNumber"
                                                   type="number"
                                                   maxLength ={6}
                                                   onChange={(val)=>this.handleCode()}/>
                                    </div>
                                    {
                                        showState === 0? <div className="item-header code" onClick={()=>this.getCode()}>发送验证码</div>:''
                                    }
                                    {
                                        showState === 1? <div className="item-header code"><span style={{color:'#888'}}>已发送({time}s)</span></div>:''
                                    }
                                    {
                                        showState === 3? <div className="item-header code" >重新获取</div>:''
                                    }
                                </div>
                                <List.Item>
                                    <Button  className="sure-btn" type="primary" onClick={()=>this.confirm()}>确定</Button>
                                </List.Item>
                            </div>
                        </Modal>
                    }
                    <div className="coupon-list">
                        {
                            productList.length>0?productList.map((item,e)=>
                                <section className="coupon-item" key={e}>
                                    <div>
                                        <p>{item.sku_name}</p>
                                        <p className="seeDetail">
                                            <span onClick={()=>this.showDetail(item)}>查看详情</span>
                                            <span>￥{item.goods_price/100}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <div className="btn-buy" onClick={()=>this.goOrder(item)}>购买</div>
                                    </div>
                                </section>
                            ):''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default WithoutBuyCoupon;