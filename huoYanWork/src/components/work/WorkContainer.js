import React, {Component} from 'react';
import './workContain.less';
import './../commonComponents/animate.css';
import Footer from '.././commonComponents/footer/Footer';
import {getFetch, postFetch} from '../../config/fetch';
import publicMethod from '../../config/publicMethod';
import config from '../../config/config';
import {Toast} from 'antd-mobile';
import Tloader from 'react-touch-loader';
let page;
class WorkContainer extends Component {
    state = {
        userInfo: undefined,
        listWork: [],
        listWorkInfo: undefined,//示列作业标题显示
        pullDownState: false,//上啦状态判断
        loadMore: undefined,//加载更多
        isLoading: true,//上啦loading
        hasMore: 0,
    };
    componentWillMount() {
        publicMethod.showAppMenu();
        page = 1;
        let browser = publicMethod.isBrowser();
        // if(browser.type !== 1){
        //     this.props.history.push('/downloadApp');
        // }
    }
    componentDidMount() {
        publicMethod.getToken(() => this.getTokenId());
        setTimeout(() => {
            this.setState({
                hasMore: 1,
            });
        }, 2e3);
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }

    /*
     * 获取火眼tokenID
     */
    getTokenId() {
        setTimeout(()=>{Toast.loading('加载中...');},0);
        getFetch(`${config.uxurl}base/v3/Common/GetDesEncrypt`, {key:config.userPhone, AppID: config.appId}).then((result) => {
            if (result.Ret === 0) {
                sessionStorage.setItem('tokenId', result.Data);
                this.workList();
            }
        })
    }
    /*
    作业列表
    * */
    workList() {
        let {loadMore} = this.state;
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            page: page,
            pagenum: 5,
        });
        if(loadMore===false&&page>1){
            return;
        }
        postFetch(`${config.hyurl}youxin/homework/listall`, null, req).then(res => {
            let {listWork} = this.state;
            if(page===1){
                this.setState({
                    listWork:res.Data.lists,
                    loadMore: res.Data.more,
                })
            }else{
                this.setState({
                    listWork:listWork.concat(res.Data.lists),
                    loadMore: res.Data.more,
                })
            }
            this.setState({
                listWorkInfo: res.Data.iseglists
            });
            setTimeout(()=>{Toast.hide();},0)
        })
    }
    //下拉刷新
    refresh(resolve, reject) {
        page=1;
        setTimeout(() => {
            this.setState({
                hasMore:true,
            });
            resolve();
        }, 500);
        this.workList();
    }
    //加载更多
    loadMore(resolve) {
        let {loadMore} = this.state;
        setTimeout(() => {
            this.setState({
                hasMore:loadMore
            },()=>{
                page++;
                this.workList();
                if(this.state.hasMore===false){
                    setTimeout(()=>{Toast.info('已经是最后一页', 1)},0);
                }
            });
            resolve();
        }, 1200);
    }
    /**
     * 跳转老师详情
     */
    goTeacherDetail(id) {
        if(id==0){
            return false;
        }
        this.props.history.push('/teacherHome/' + id)
    }

    /**
     * 时间戳转化成时间
     */
    handleTime(time) {
        let commonTime = new Date(time);
        let current = new Date().getTime() - time;//获取已经过去时间的毫秒数
        let seconds = current/1000;//得到总秒数
        let minutes = seconds/60;//得到总分数
        let hours = minutes/60;//得到总小时数
        let day = hours/24;//得到天数
        //转化星期数
        let week = new Date(time).getDay();
        let weekStr = '星期'
        switch (week) {
            case 0 :
                weekStr += "日";
                break;
            case 1 :
                weekStr += "一";
                break;
            case 2 :
                weekStr += "二";
                break;
            case 3 :
                weekStr += "三";
                break;
            case 4 :
                weekStr += "四";
                break;
            case 5 :
                weekStr += "五";
                break;
            case 6 :
                weekStr += "六";
                break;
        }
        if(minutes<60){
            return parseInt(minutes)+"分钟前";
        }else if(hours>=1&&minutes>=60&&hours<24){
            return parseInt(hours)+"小时前";
        }else if(day>=1&&hours>24){
            return commonTime.getFullYear() + "-" + (commonTime.getMonth() < 9 ? '0' : '') + (commonTime.getMonth() + 1) + "-" + (commonTime.getDate()<=9 ? "0"+commonTime.getDate():commonTime.getDate()) + " " + commonTime.getHours() + ":" + (commonTime.getMinutes()<= 9 ? '0'+commonTime.getMinutes() : commonTime.getMinutes()) + " "+weekStr;
        }

    }

    /**
     * 转换批改作业时间
     */
    changeWorkTime(value) {
        let seconds = parseInt(value);// 秒
        let minutes = 0;// 分
        let hours = 0;//时
        if (seconds > 60 || seconds == 60) {
            minutes = parseInt(seconds / 60);
            seconds = parseInt(seconds % 60);
            if(minutes > 60) {
                hours = parseInt(minutes/60);
                minutes = parseInt(minutes%60);
            }
        }
        let result = "" + parseInt(seconds) + "秒";
        if (minutes > 0) {
            result = "" + parseInt(minutes) + "分" + result;
        }
        if(hours > 0) {
            result = ""+parseInt(hours)+"小时"+result;
        }
        return result;
    }

    /**
     * 转换缩略图右上角图标
     */
    changeImg(icon) {
        let leftIcon;
        switch (icon) {
            case 1:
                leftIcon = require('../../images/form_course_english_icon.png');
                break;
            case 2:
                leftIcon = require('../../images/form_course_math_icon.png');
                break;
            case 3:
                leftIcon = require('../../images/form_course_physics_icon.png');
                break;
            case 4:
                leftIcon = require('../../images/form_course_chemistry_icon.png');
                break;
            case 5:
                leftIcon = require('../../images/form_course_biology_icon.png');
                break;
            case 6:
                leftIcon = require('../../images/form_course_chinese_icon.png');
                break;
        }
        return leftIcon;
    }
    /**
     * 通过时间获取进度条百分比
     */
    changePercent(time){
        let seconds = parseInt(time);// 秒
        let minutes = parseInt(seconds/60);
        let percentTime = minutes/30;//30分钟进度为99%
        if(minutes>=30){
            percentTime=0.99
        }
        return percentTime;
    }

    /**
     * 跳转批改作业详情
     */
    workDetail(id){
        window.location.href = "ucux://work/detail?id=" + id;
    }
    render() {
        let {listWork, listWorkInfo,hasMore} = this.state;
        return (
            <div>
                {/*头部样式处理*/}
                {listWorkInfo === 0||listWork.length===0||listWork==null?<div className="workContainer">
                <div className="workContainer-content-head">
                    <div className="work-first">老师在等今天的作业哦</div>
                    <div className="work-two">天天作业有笔，好成绩看得见</div>
                    <button className="work-btn" onClick={()=>this.props.history.push('/publish')}>开始辅导</button>
                </div>
                </div>:null}
                {/*列表样式*/}
                {listWorkInfo === 0 ? <div className="workContainer animated fadeIn" >
                    {listWorkInfo === 0 ?<Tloader
                        onRefresh={(resolve, reject) => this.refresh(resolve, reject)}
                        onLoadMore={(resolve) => this.loadMore(resolve)}
                        hasMore={hasMore}
                        className="main">
                        <div className="workList" >
                            {listWorkInfo === 1 ? <div className="workList-first">
                                <div className="workList-first-div">
                                    <div className="title"><span>以下为示例作业</span></div>
                                </div>
                            </div> : null}
                            {listWork ? listWork.map((e, i) =>
                                <div className="workList-last" key={i}>
                                    <div className="workList-last-left" onClick={()=>(this.workDetail(e.taskid))}>
                                        <img src={this.changeImg(e.subjectid)} alt="" className="workList-last-img"/>
                                        {e.pagelist.length!==0 ? <img src={e.pagelist[0].thumburl} alt="暂无图片" className="workList-img"/>:<img src={require('../../images/test-paper.png')}
                                                                                                                                              alt="" className="default-img"/>}
                                        {/*蒙层*/}
                                        <div className="workList-last-left-modal">
                                            {/*正确个数错误个数*/}
                                            <div className="small-icon">
                                                <img src={require('../../images/small-icon-one.png')} alt=""
                                                     className="small-icon-one"/>
                                                <span>{e.rpointcnt}</span>
                                                <img src={require('../../images/small-icon-two.png')} alt=""
                                                     className="small-icon-two"/>
                                                <span>{e.wpointcnt}</span>
                                            </div>
                                            {/*图中百分比*/}
                                            {e.pagelist.length!==0?<div className="percent">{e.rrate.toFixed(2)*100}%</div>:null}

                                        </div>
                                    </div>
                                    <div className="workList-last-right">
                                        <div className="workList-last-right-box">
                                            <div className="workList-last-right-div"
                                                 onClick={() => this.goTeacherDetail(e.teacherid)}>
                                                <img
                                                    src={e.teacheravatar ? e.teacheravatar : require('../../images/head-avatar.png')}
                                                    alt="暂无头像"
                                                    className="workList-avatar-img"/>
                                            </div>
                                            <div className="workList-last-right-info">
                                                <div className="teacher-name">{e.teachername ? e.teachername : '有笔老师'}</div>
                                                <div className="workList-time">{this.handleTime(e.datatime)}</div>
                                            </div>
                                        </div>
                                        <div className="workList-answer">
                                            {e.state === 0 ?
                                                <span><span className="answer-light">正在准备</span>为您批改作业 请稍等...</span> :
                                                e.state === 1 ?
                                                    <div>
                                                        <span><span className="answer-light">批改中</span>，点击查看进度 已耗时<span>{this.changeWorkTime(e.costtime)}</span> </span>
                                                        <div style={{'paddingTop':'10px'}}>
                                                            <progress max="1" value={this.changePercent(e.costtime)} className="progress-bar"></progress>
                                                        </div>
                                                    </div>:
                                                    e.state === 2 ?
                                                        <div>
                                                            <span>您的作业已经<span className="answer-light">批改完成</span> 总耗时<span>{this.changeWorkTime(e.costtime)}</span></span>
                                                            <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                        </div>:
                                                        e.state === 3 ?
                                                            <div>
                                                                <span> 您的作业正在<span className="answer-light">追问</span> <span>{this.changeWorkTime(e.costtime)}</span></span>
                                                                <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                            </div> :
                                                            e.state === 4 ?
                                                                <div>
                                                                    <span>老师批改的作业已经被您<span className="answer-light">采纳</span> 总耗时<span>{this.changeWorkTime(e.costtime)}</span></span>
                                                                    <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span  key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                                </div> :
                                                                e.state === 5 ?
                                                                    <div>
                                                                        <span>您的作业正在<span className="answer-light">仲裁</span></span>
                                                                        <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                                    </div> :
                                                                    e.state === 6 ?
                                                                        <div>
                                                                            <span>您的作业正在<span className="answer-light">仲裁</span></span>
                                                                            <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                                        </div> :
                                                                        e.state === 8 ?
                                                                            <div>
                                                                                <span>老师无法<span className="answer-light">批改</span>，请重拍</span>
                                                                                <div><span>{e.report_reason}</span>
                                                                                </div>
                                                                            </div>: null}
                                        </div>
                                    </div>
                                </div>) : null}
                        </div>
                    </Tloader>:null}
                </div>:null}
                {/*示例作业样式*/}
                {listWorkInfo === 1||listWork.length===0||listWork==null? <div className="work animated fadeIn">
                     <div className="workContainer-content"><div className="workContainer-content-head" >
                        <div className="work-first">老师在等今天的作业哦</div>
                        <div className="work-two">天天作业有笔，好成绩看得见</div>
                        <button className="work-btn" onClick={()=>this.props.history.push('/publish')}>开始辅导</button>
                    </div>
                        {listWorkInfo === 1 ?<div className="workList">
                            {listWorkInfo === 1 ? <div className="workList-first">
                                <div className="workList-first-div">
                                    <div className="title"><span>以下为示例作业</span></div>
                                </div>
                            </div> : null}
                            {listWork ? listWork.map((e, i) =>
                                <div className="workList-last" key={i}>
                                    <div className="workList-last-left" onClick={()=>(this.workDetail(e.taskid))}>
                                        <img src={this.changeImg(e.subjectid)} alt="" className="workList-last-img"/>
                                        {e.pagelist.length!==0 ? <img src={e.pagelist[0].thumburl} alt="暂无图片" className="workList-img"/>:<img src={require('../../images/test-paper.png')}
                                                                                                                                              alt="" className="default-img"/>}
                                        {/*{!e.pagelist[0].thumburl ? <img src={require('../../images/test-paper.png')}*/}
                                        {/*alt="" className="default-img"/> : null}*/}
                                        {/*蒙层*/}
                                        <div className="workList-last-left-modal">
                                            {/*正确个数错误个数*/}
                                            <div className="small-icon">
                                                <img src={require('../../images/small-icon-one.png')} alt=""
                                                     className="small-icon-one"/>
                                                <span>{e.rpointcnt}</span>
                                                <img src={require('../../images/small-icon-two.png')} alt=""
                                                     className="small-icon-two"/>
                                                <span>{e.wpointcnt}</span>
                                            </div>
                                            {/*图中百分比*/}
                                            {e.pagelist.length!==0?<div className="percent">{e.rrate.toFixed(2)*100}%</div>:null}

                                        </div>
                                    </div>
                                    <div className="workList-last-right">
                                        <div className="workList-last-right-box">
                                            <div className="workList-last-right-div"
                                                 onClick={() => this.goTeacherDetail(e.teacherid)}>
                                                <img
                                                    src={e.teacheravatar ? e.teacheravatar : require('../../images/head-avatar.png')}
                                                    alt="暂无头像"
                                                    className="workList-avatar-img"/>
                                            </div>
                                            <div className="workList-last-right-info">
                                                <div className="teacher-name">{e.teachername ? e.teachername : '有笔老师'}</div>
                                                <div className="workList-time">{this.handleTime(e.datatime)}</div>
                                            </div>
                                        </div>
                                        <div className="workList-answer">
                                            {e.state === 4 ?
                                                <div>
                                                    <span>老师批改的作业已经被您<span className="answer-light">采纳</span> 总耗时<span>{this.changeWorkTime(e.costtime)}</span></span>
                                                    <div className="comment" key={i}>{e.tags.length!=0&&e.tags!=null ?e.tags.map((k,i)=><span  key={i} style={{color:k.color,fontSize:'12px',padding:'2px 8px',borderRadius:'4px', border:'1px solid'+k.color,marginRight:'4%',display:'inline-block',marginBottom:'6px'}}>{k.content}</span>):null}</div>
                                                </div>:null}
                                        </div>
                                    </div>
                                </div>) : null}
                        </div>:null}
                        {listWorkInfo === 1 ? <div className="workContainer-content-footer">
                            <p>每道题都批改，错误一目了然</p>
                            <p>每道错题都详细讲解</p>
                        </div>: null}
                    </div>
                </div>:null}
                <Footer {...this.props}/>
            </div>
        )
    }
}
export default WorkContainer;