import React, {Component} from 'react';
import {InputItem,Toast,Modal} from 'antd-mobile';
import {HashRouter} from 'react-router-dom';
import config from "../../../config/config";
import {getFetch,postFetch} from "../../../config/fetch";
import publicMethod from '../../../config/publicMethod';
import './../../commonComponents/animate.css';
import './sendCoupon.less';
const alert = Modal.alert;
class ChoiceCoupon extends Component {
    state = {
        couponList:[],
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {
         //this.getCouponList();
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     *处理时间
     */
    handleTime(time){
        let commonTime = new Date(time*1000);
        return commonTime.getFullYear() + "-" +(commonTime.getMonth()<9?'0':'')+(commonTime.getMonth() + 1) + "-" + (commonTime.getDate()<10?'0'+commonTime.getDate():commonTime.getDate());
    }

    /***
     *点击选择
     */
    choice(data){
        this.props.handleCoupon(2,data);
    }
    render(){
        let couponList = this.props.couponList;
        return(
            <div className='coupon-contain'>
                <div className="coupon-content animated bounceInDown">
                    <header>过期券赠送给有需要的朋友，在两周内均可使用</header>
                    <div className="coupon-list">
                        {
                            couponList.map((item,e)=>
                                <div className={item.expire === 1?"coupon-item":'coupon-item overdue'} key={e} onClick={()=>this.choice(item)}>
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
                                            item.comefrom === 0 || item.comefrom === 2? <p>来自“优信作业”赠送</p>:''
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
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default ChoiceCoupon;