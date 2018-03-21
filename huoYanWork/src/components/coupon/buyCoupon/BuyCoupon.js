import React, {Component} from 'react';
import './buyCoupon.less';
import {Modal,Toast} from 'antd-mobile';
import './../../commonComponents/animate.css';
import config from "../../../config/config";
import {getFetch,postFetch} from "../../../config/fetch";
import Footer from './../../commonComponents/footer/Footer.js';
import publicMethod from './../../../config/publicMethod';

class MineContainer extends Component {
    state = {
        showGrade:false,
        gradeID:undefined,
        userGrade:[],
        productList:[],
        grade1:[],//小学年级
        grade2:[],//初中年级
        grade3:[],//高中年级
        goods_server_info:undefined,
        modal1:false,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {
        //this.getGradeInfo();
        publicMethod.getToken(() => this.getTokenId());
    }
    getTokenId() {
        getFetch(`${config.uxurl}base/v3/Common/GetDesEncrypt`, {key:config.userPhone, AppID: config.appId}).then((result) => {
            if (result.Ret === 0) {
                sessionStorage.setItem('tokenId', result.Data);
                this.startFunction();
            }
        })
    }
    startFunction(){
        this.getCouponList();
        this.getProductList();
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
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
                if(result.Data.length>0){
                    let list = [],number = 0;
                    result.Data.map((item,e)=>{
                        if(item.expire === 1){
                            list.push(item)
                        }
                    });
                    list.map((item,e)=>{
                        number += item.surplus
                    });
                    this.setState({
                        usefulCoupon:number,
                    })
                }
            }
        })
    }
    /**
     *获取年级基础信息
     */
    getGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        let{grade1,grade2,grade3} = this.state;
        postFetch(`${config.hyurl}youxin//guest/gradeinfo`,null,req).then(res => {
            if(res.Code === 0){
                if(res.Data.length !== 0){
                    res.Data.map((e,i) => {
                        if(e.grade.indexOf('年') >= 0){
                            grade1.push(e);
                        }
                        if(e.grade.indexOf('初') >= 0){
                            grade2.push(e);
                        }
                        if(e.grade.indexOf('高') >= 0){
                            grade3.push(e);
                        }
                    });
                }
                this.getUserGradeInfo();
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *获取用户已经绑定的年级
     */
    getUserGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        postFetch(`${config.hyurl}youxin/user/getusergradeinfo`,null,req).then(res => {
            if(res.Code === 0){
                if(res.Data.gradelist&&res.Data.gradelist.length===0){
                    this.setState({
                         showGrade:true,
                        userGrade:res.Data.gradelist,
                    })
                }else {
                    this.getProductList();
                }
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    /**
     *获取商品列表
     */
    getProductList(){
        let req;
        req = {
            type:"zuoye",
            goods_ids:config.goods_ids,
        };
        postFetch(`${config.shopurl}open/ServerGoods`,{token:sessionStorage.getItem('token')},req).then(res => {
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
     * 查看商品详情
     */
    showDetail = (data) => {

        this.setState({
            goods_server_info:data.goods_server_info,
            modal1:true,
        })

        // const alertInstance = alert('套餐详情',<div>
        //         <div style={{textAlign:'left',color:'#333'}} dangerouslySetInnerHTML={{__html:data.goods_server_info}}>
        //             {/*<p>1、难题答疑(全科+快速通道)</p>*/}
        //             {/*<p>2、难题答疑（无限追问）</p>*/}
        //             {/*<p>3、难题答疑（限时沟通）</p>*/}
        //         </div>
        //     </div>,
        //     [
        //         { text: <span style={{color:'#46CAFD'}}>知道了</span>, onPress: () => console.log('ok') },
        //     ]);
        // alertInstance.close();
    };
    /**
     *选择年级
     */
    chooseGrade(data){
        this.setState({
            gradeID : data.gradeid,
            showGrade:false,
        });
        this.getProductList();
    };
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
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
        Toast.loading('Loading...', 100);
        postFetch(`${config.shopurl}widget/Service/checkUserBuyRecord`,header,req).then(res => {
            Toast.hide();
            if(res.Ret === 0){
                this.props.history.push('/coupon/order/');
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    render(){
        let {showGrade,grade1,grade2,grade3,gradeID,usefulCoupon,productList,goods_server_info,modal1} = this.state;
        return(
            <div className="buyCoupon">
                <div className="buyCoupon-content animated fadeIn">
                    <Modal
                        popup
                        visible={showGrade}
                        maskClosable={false}
                        animationType="slide-up"
                    >
                        <div>
                            <div className="grade-info">
                                <h4>为了更好的服务，请确认孩子的年级信息</h4>
                                {/*<img className="close-grade" src={require('../../../images/close.png')} alt="" onClick={this.onClose('showGrade')}/>*/}
                                {/*<span className="close-grade" onClick={this.onClose('showGrade')}>x</span>*/}
                            </div>
                            <div className="grade-modal">
                                <div className="grade-one">
                                    <h4>小学</h4>
                                    <div className="primary-list">
                                        { grade1 ? grade1.map((e,i) =>
                                            <span key={i}  className = {e.gradeid == gradeID ? 'choosed' : null}
                                                  onClick={ () => this.chooseGrade(e) }>{e.grade}</span>
                                        ): null}
                                    </div>
                                </div>
                                <div className="grade-one">
                                    <h4>初中</h4>
                                    <div className="primary-list">
                                        { grade2 ? grade2.map((e,i) =>
                                            <span key={i}  className = {e.gradeid == gradeID ? 'choosed' : null}
                                                  onClick={ () => this.chooseGrade(e) }>{e.grade}</span>
                                        ): null}
                                    </div>
                                </div>
                                <div className="grade-one">
                                    <h4>高中</h4>
                                    <div className="primary-list">
                                        { grade3 ? grade3.map((e,i) =>
                                            <span key={i} className = {e.gradeid == gradeID ? 'choosed' : null}
                                                  onClick={ () => this.chooseGrade(e) }>{e.grade}</span>
                                        ): null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal
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



                    <div className="header">可用作业券<span>{usefulCoupon ? usefulCoupon : 0}</span>张</div>
                    <div className="space"/>
                    <div className="coupon-list">
                        {
                            productList.map((item,e)=>
                                <section className="coupon-item" key={e}>
                                    <div>
                                        <p>{item.sku_name}</p>
                                        <p className="seeDetail">
                                            <span onClick={()=>this.showDetail(item)}>查看详情</span>
                                            <span>￥{item.goods_price/100}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <div className="btn-buy" onClick={()=>this.creatOrder(item)}>购买</div>
                                    </div>
                                </section>
                            )
                        }
                        {/*<section className="coupon-item recommend">*/}
                            {/*<span className="tui">荐</span>*/}
                            {/*<div>*/}
                                {/*<p>【高中六年级】32张难题券</p>*/}
                                {/*<p className="seeDetail">*/}
                                    {/*<span>查看详情</span>*/}
                                    {/*<span>￥199.0</span>*/}
                                {/*</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                                {/*<div className="btn-buy">购买</div>*/}
                            {/*</div>*/}
                        {/*</section>*/}
                    </div>
                </div>
                <Footer{...this.props}/>
            </div>
        )
    }
}

export default MineContainer;