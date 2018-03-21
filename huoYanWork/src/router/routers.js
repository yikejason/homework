import React, {Component} from 'react';
import {Route, HashRouter as Router,Redirect,Switch} from 'react-router-dom';
import Bundle from './bundle';

/**
 *作业
 */
// 作业入口
const WorkContainer = (props) => (
    <Bundle load={() => import('./../components/work/WorkContainer.js')}>
        {(WorkContainer) => <WorkContainer {...props}/>}
    </Bundle>
);
//教师主页
const TeacherHomeContainer = (props) => (
    <Bundle load={() => import('./../components/work/teacherHome/TeacherHomeContainer.js')}>
        {(TeacherHomeContainer) => <TeacherHomeContainer {...props}/>}
    </Bundle>
);
/**
 *拍照发布作业
 */
// 拍照发布作业入口
const PublishWorkContainer = (props) => (
    <Bundle load={() => import('./../components/publishWork/PublishWorkContainer.js')}>
        {(PublishWorkContainer) => <PublishWorkContainer {...props}/>}
    </Bundle>
);
const Publish = (props) => (
    <Bundle load={() => import('./../components/publishWork/publish/Publish.js')}>
        {(Publish) => <Publish {...props}/>}
    </Bundle>
);
/**
 *购买卷
 */
// 购买卷入口
const CouponContainer = (props) => (
    <Bundle load={() => import('./../components/coupon/CouponContainer.js')}>
        {(CouponContainer) => <CouponContainer {...props}/>}
    </Bundle>
);
// 购买作业券
const BuyCoupon = (props) => (
    <Bundle load={() => import('./../components/coupon/buyCoupon/BuyCoupon.js')}>
        {(BuyCoupon) => <BuyCoupon {...props}/>}
    </Bundle>
);
// 赠送作业券
const SendCoupon = (props) => (
    <Bundle load={() => import('./../components/coupon/sendCoupon/SendCoupon.js')}>
        {(SendCoupon) => <SendCoupon {...props}/>}
    </Bundle>
);
// 选择券
const ChoiceCoupon = (props) => (
    <Bundle load={() => import('./../components/coupon/sendCoupon/ChoiceCoupon.js')}>
        {(ChoiceCoupon) => <ChoiceCoupon {...props}/>}
    </Bundle>
);
// 分享给朋友
const Share = (props) => (
    <Bundle load={() => import('./../components/coupon/share/Share.js')}>
        {(Share) => <Share {...props}/>}
    </Bundle>
);
// 分享介绍页面
const ShareIntroduce = (props) => (
    <Bundle load={() => import('./../components/coupon/shareIntroduce/ShareIntroduce.js')}>
        {(ShareIntroduce) => <ShareIntroduce {...props}/>}
    </Bundle>
);
//待支付订单
const PaymentOrder = (props) => (
    <Bundle load={() => import('./../components/coupon/paymentoOrder/PaymentOrder.js')}>
        {(PaymentOrder) => <PaymentOrder {...props}/>}
    </Bundle>
);
// 支付结果
const PayResult = (props) => (
    <Bundle load={() => import('./../components/coupon/payResult/PayResult.js')}>
        {(PayResult) => <PayResult {...props}/>}
    </Bundle>
);

// 下载appy页面
const DownloadApp = (props) => (
    <Bundle load={() => import('./../components/coupon/payResult/DownloadApp.js')}>
        {(DownloadApp) => <DownloadApp {...props}/>}
    </Bundle>
);
// 优信内订单详情
const Order = (props) => (
    <Bundle load={() => import('./../components/coupon/order/Order.js')}>
        {(Order) => <Order {...props}/>}
    </Bundle>
);
// 优信外商品列表
const WithoutBuyCoupon = (props) => (
    <Bundle load={() => import('./../components/coupon/withoutBuyCoupon/WithoutBuyCoupon.js')}>
        {(WithoutBuyCoupon) => <WithoutBuyCoupon {...props}/>}
    </Bundle>
);
// 优信外订单详情
const WithoutOrderDetail = (props) => (
    <Bundle load={() => import('./../components/coupon/withoutBuyCoupon/WithoutOrderDetail.js')}>
        {(WithoutOrderDetail) => <WithoutOrderDetail {...props}/>}
    </Bundle>
);
/**
 *我的
 */
// 我的入口
const MineContainer = (props) => (
    <Bundle load={() => import('./../components/mine/MineContainer')}>
        {(MineContainer) => <MineContainer {...props}/>}
    </Bundle>
);
//我的信息详情
const MineDetailContainer = (props) => (
    <Bundle load={() => import('./../components/mine/mineDetail/MineDetailContainer')}>
        {(MineDetailContainer) => <MineDetailContainer {...props}/>}
    </Bundle>
);
//年级管理
const GradeManagement = (props) => (
    <Bundle load={() => import('./../components/mine/mineDetail/GradeManagement/GradeManagement')}>
        {(GradeManagement) => <GradeManagement {...props}/>}
    </Bundle>
);
export default class Routers extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <Router>
                <Switch>
                    {/*作业*/}
                    <Route exact path="/work" component={WorkContainer}/>
                    <Route exact path="/teacherHome/:id" component={TeacherHomeContainer}/>
                    {/*拍照发布作业*/}
                    <Route exact path="/publishWork" component={PublishWorkContainer}/>
                    <Route exact path="/publish" component={Publish}/>
                    {/*购买卷*/}
                    <Route exact path="/coupon" component={CouponContainer}/>
                    <Route exact path="/coupon/buyCoupon" component={BuyCoupon}/>
                    <Route exact path="/coupon/sendCoupon" component={SendCoupon}/>
                    <Route exact path="/coupon/choiceCoupon" component={ChoiceCoupon}/>
                    <Route exact path="/coupon/share" component={Share}/>
                    <Route exact path="/coupon/paymentOrder" component={PaymentOrder}/>
                    <Route exact path="/coupon/payResult" component={PayResult}/>
                    <Route exact path="/downloadApp" component={DownloadApp}/>
                    <Route exact path="/coupon/order" component={Order}/>
                    <Route exact path="/coupon/withoutBuyCoupon" component={WithoutBuyCoupon}/>
                    <Route exact path="/coupon/withoutOrderDetail" component={WithoutOrderDetail}/>
                    {/*我的*/}
                    <Route exact path="/mine" component={MineContainer}/>
                    <Route exact path="/mine/mineDetail" component={MineDetailContainer}/>
                    <Route exact path="/gradeManagement" component={GradeManagement}/>
                    <Redirect exact from='/' to="/work"/>
                </Switch>
            </Router>
        );
    }
}
