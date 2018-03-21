import React, {Component} from 'react';
import {InputItem,Toast,Modal,Icon} from 'antd-mobile';
import config from "../../../config/config";
import {getFetch,postFetch} from "../../../config/fetch";
import ChoiceCoupon from './ChoiceCoupon';
import './../../commonComponents/animate.css';
import publicMethod from './../../../config/publicMethod';
import './sendCoupon.less';
class MineContainer extends Component {
    state = {
        phoneNumber:'',
        choiceCoupon:undefined,
        showState:0,
        couponList:[],
        usefulCoupon:undefined,
        overTimeCoupon:undefined,
        couponNumber:1,
        modelState:0,
        modelState2:0,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {
        this.getCouponList();
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     * 跳转选择券
     */
    handleCoupon(type,data){
        let {couponList} = this.state;
        if(couponList&&couponList.length===0){
            return false;
        }
        if(type === 2){
            this.setState({choiceCoupon:data});
        }
        this.setState({showState:type});
    }
    /**
     *加减数量
     */
    handleNumber(type){
        let {couponNumber} = this.state;
        if(couponNumber === ''){
            couponNumber = 0;
        }
        if(type){
            couponNumber += 1;
        }else {
            couponNumber -= 1;
        }
        if(couponNumber<1 || couponNumber>100000){
            return;
        }
        this.setState({
            couponNumber:couponNumber
        })
    }

    /**
     *验证
     */
    confirm(){
        let {phoneNumber,choiceCoupon,couponNumber,overTimeCoupon,usefulCoupon} = this.state;
        let  reg = /^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/;
        if(usefulCoupon===0&&overTimeCoupon===0){
            return;
        }
        if(!phoneNumber||phoneNumber ===''){
            Toast.info('请输入手机号',1);
            return;
        }
        // alert(phoneNumber);
        // alert(reg.test(phoneNumber));
        phoneNumber = parseInt(phoneNumber);
        if(!reg.test(phoneNumber)){
            Toast.info('请填写正确的手机号！',1);
            return;
        }
        if(!choiceCoupon){
            Toast.info('请选择券！',1);
            return;
        }
        if(!couponNumber||couponNumber === ''){
            Toast.info('请填写正确的张数！',1);
            return;
        }
        if(couponNumber>choiceCoupon.surplus){
            Toast.info('张数超过了剩余数量！',1);
            return;
        }
        this.showAlert(this.state);
    }
    /**
     * 确定赠送的提示
     */
    showAlert(data){
        this.setState({
            modelState:1
        })
    };
    /**
     * 提交赠送
     */
    sendCoupon(phone){
        let req = config.appInfo;
        let{phoneNumber,choiceCoupon,couponNumber} = this.state;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            towho:phone,
            type:choiceCoupon.type,
            expire:choiceCoupon.expire,
            gradeid:choiceCoupon.gradeid,
            nums:couponNumber,
            servedays:14
        });
        postFetch(`${config.hyurl}youxin/user/donationcoupon`,null,req).then((result)=>{
            Toast.hide();
            if(result.Code === 0){
                this.setState({modelState2:2});
                this.checkRegister(phone);
            }else {
                Toast.info(result.Msg,1.5);
            }
        })
    }
    /**
     * 手机号加密
     */
    getTokenId() {
        let {phoneNumber} = this.state;
        Toast.loading('Loading...', 100);
        getFetch(`${config.uxurl}base/v3/Common/GetDesEncrypt`, {key:phoneNumber, AppID: config.appId}).then((result) => {
            if (result.Ret === 0) {
                this.sendCoupon(result.Data);
            }
        })
    }
    /**
     * 赠送成功后调用优信接口
     */
    checkRegister(){
        let {phoneNumber,choiceCoupon,couponNumber} = this.state;
        let str, req = {
            token:sessionStorage.getItem('token'),
            appID:config.appId,
            tel:phoneNumber,
        };

        // couponNumber+'张xx年级xx类型券';
        postFetch(`${config.uxurl}base/v3/User/CheckUserRegister`,req,null).then((result)=>{
            if(result.Ret === 0){

            }else {
                Toast.info(result.Msg,1.5);
            }
        });
         str = `${couponNumber}张通用作业券`;
        postFetch(`${config.shopurl}my/Service/giftAfter`,{token:sessionStorage.getItem('token')},{phone:phoneNumber,parameter:str}).then((result)=>{
            if(result.Ret === 0){

            }else {
                Toast.info(result.Msg,1.5);
            }
        });
    }
    /**
     * 输入赠送券
     */
    changeInput(event){
        let regu = /^[1-9]\d*$/;
        if(!regu.test(event.target.value)){
            if(event.target.value === ''){
                this.setState({
                    couponNumber:''
                })
            }
        }else {
            this.setState({
                couponNumber:parseInt(event.target.value)
            })
        }
    }
    /**
     * 输入手机号
     */
    changePhone(event){
        let phoneNumber = event.target.value;
        let Trim = (str,is_global)=>{
            let result;
            if(!str || str===''){
                return;
            }
            result = str.replace(/\s/g,'');
            result = result.replace(/[^\d]/g,'');
            result = result.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            result = result.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            result = result.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            result = result.replace(/ /ig,'');//去掉
            result = result.replace(/^[\s　]+|[\s　]+$/g,'');//去掉全角半角空格
            result = result.replace(/[\r\n]/g,'');//去掉回车换行
            result = result.replace(/^\s*|\s*$/g,'');
            return result;
        };
        if(phoneNumber.length>0){
            let str;
            phoneNumber = Trim(phoneNumber,'g');
            phoneNumber  = phoneNumber.replace('+86','');
        }
        this.setState({
            phoneNumber:phoneNumber
        })
    }
    /**
     * 获取券列表
     */
    getCouponList(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        postFetch(`${config.hyurl}youxin/user/getviplist`,null,req).then((result)=>{
            if(result.Code === 0){
                let list = [],list1 = [],list2 = [],number1= 0,number2=0;
                if(result.Data.length>0){
                    result.Data.map((item,e)=>{
                        if(item.comefrom === 1){
                            list.push(item);
                            if(item.expire === 1){
                                list1.push(item)
                            }else if(item.expire === 0){
                                list2.push(item);
                            }
                        }
                    });
                    list1.map((item,e)=>{
                        number1 += item.surplus
                    });
                    list2.map((item,e)=>{
                        number2 += item.surplus
                    });
                    this.setState({
                        usefulCoupon:number1,
                        overTimeCoupon:number2,
                        couponList:list,
                    })
                }else {
                    this.setState({
                        usefulCoupon:number1,
                        overTimeCoupon:number2,
                    })
                }
            }
        })
    }

    render(){
        let {showState,couponNumber,choiceCoupon,usefulCoupon,overTimeCoupon,couponList,modelState,phoneNumber,modelState2} = this.state;
        const tabs = [
            { title: '可用券', sub: 0},
            { title: '过期券', sub: 1},
            { title: '分享得券', sub:3},
        ];
        return(
            <div className="sendCoupon">
                <Modal
                    visible={modelState === 1}
                    transparent
                    maskClosable={false}
                    // title="Title"
                    footer={[{ text: '取消', onPress: () => {this.setState({modelState:0})}},
                        { text: '确定', onPress: () => {this.getTokenId(phoneNumber)}}
                    ]}
                >
                    <div style={{color:'#333',fontSize:'16px'}}><p>您确定赠送<span style={{color:'red'}}>{couponNumber}</span>张{choiceCoupon&&choiceCoupon.expire === 0?'过期作业券':'可用作业券'}给</p><p>用户：{phoneNumber}</p></div>
                </Modal>
                <Modal
                    visible={modelState2 === 2}
                    transparent
                    maskClosable={false}
                    // title="Title"
                    footer={[{ text: '知道了', onPress: () => {this.props.history.push('/coupon');}},
                    ]}
                >
                   <div>
                       <span style={{color:'#6bc756'}}><Icon type='check-circle' size="lg"/></span>
                       <div style={{color:'#333',fontSize:'16px'}}><p>你已成功转赠{choiceCoupon&&choiceCoupon.expire === 0?'过期作业券':'可用作业券'}<span style={{color:'#e4524c'}}>{couponNumber}</span>张给{phoneNumber}用户</p></div>
                   </div>
                </Modal>
                <div className="sendCoupon-content animated fadeIn">
                    {
                        showState ===1? <ChoiceCoupon  couponList={couponList}  handleCoupon={(type,data)=>this.handleCoupon(type,data)}/>:''
                    }
                    <div className="send-info">
                        <section className="info-item phone">
                            <div>手机号</div>
                            <div>
                                <input className="phone-number" type="tel" id ='phoneNumber' placeholder="请输入你要赠送的手机号" value={phoneNumber} onChange={(event)=>this.changePhone(event)}/>
                                {/*<InputItem placeholder="请输入你要赠送者的手机号"*/}
                                           {/*type="number" */}
                                           {/*maxLength={11}*/}
                                           {/*onChange={(val)=>this.setState({*/}
                                               {/*phoneNumber:val.replace('+86','')*/}
                                           {/*})}/>*/}
                            </div>
                        </section>
                        <section className="info-item">
                            <div>选择券</div>
                            <div className="choice-coupon">
                                <p onClick={()=>this.handleCoupon(1)}>
                                    {
                                        choiceCoupon? <span><span className="grade">【{choiceCoupon.grade}】</span>{choiceCoupon.expire ===1?'可用作业券':'过期作业券'}</span>:<span className="choice-tip">请选择券</span>
                                    }
                                    {
                                        usefulCoupon===0&&overTimeCoupon===0?"":<img src={require('../../../images/row-right.png')} alt=""/>
                                    }
                                </p>
                            </div>
                        </section>
                        <section className="info-item fill-number">
                            <div>张数</div>
                            <div>
                               <p onClick={()=>this.handleNumber(false)}>－</p>
                                <input type="text"  value={couponNumber} onChange={(event)=>{this.changeInput(event)}}/>
                               {/*<p>{couponNumber}</p>*/}
                               <p onClick={()=>this.handleNumber(true)}>＋</p>
                            </div>
                        </section>
                        <section className="info-item time">
                            <div>有效期</div>
                            <div>
                                <p>成功赠送后2个星期内有效</p>
                            </div>
                        </section>
                    </div>
                    <p className="instro">你总共有<span> {usefulCoupon} </span>张可用作业券，<span> {overTimeCoupon} </span>张过期券</p>
                </div>
                <div className="btn-contain">
                    <div className={usefulCoupon===0&&overTimeCoupon===0?'sure-btn btn-disable':'sure-btn'} onClick={()=>this.confirm()}>确定</div>
                </div>
            </div>
        )
    }
}
export default MineContainer;