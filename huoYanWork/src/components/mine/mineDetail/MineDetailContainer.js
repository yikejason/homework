import React, {Component} from 'react';
import './mineDetailContainer.less';
import './../../commonComponents/animate.css';
import {postFetch,getFetch} from '../../../config/fetch';
import config from '../../../config/config';
import publicMethod from '../../../config/publicMethod';
class MineDetailContainer extends Component{
    state = {
        tasktype:2,
        gradeid:undefined,
        gradeList:[],
        name:undefined,
        avatar:undefined,
        RName:undefined,
        Tel:undefined
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {
        this.getGradeInfo();//获取用户年级信息
        this.getUserInfo();//获取当前用户信息
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     *获取用户年级的信息
     */
    getGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        postFetch(`${config.hyurl}youxin/user/getusergradeinfo`,null,req).then(res => {
            if(res.Code==0){
                this.setState({
                    gradeList:res.Data.gradelist
                })
            }
        })
    }
    /**
     *获取当前用户的信息
     */
    getUserInfo(){
        getFetch(`${config.uxurl}base/v3/User/GetCurUserInfo`,null).then(res => {
            if(res.Ret==0){
                this.setState({
                    name:res.Data.Name,
                    avatar:res.Data.Pic,
                    RName:res.Data.RName,
                    Tel:res.Data.Tel,
                });
            }
        })
    }
    render(){
        let {gradeList,name,avatar,RName,Tel} = this.state;
        return(
            <div className="mineDetailContainer">
                <div className="mineDetailContainer-content">
                   <div className="mineDetailContainer-content-head">
                       <div className="mineDetailContainer-avatar-text">头像</div>
                       <div className="mineDetailContainer-head-right">
                           {avatar ? <img src={avatar} alt="暂无头像" className="mineDetailContainer-avatar"/> : null}
                           {/*{!avatar ? <img src={require('../../../images/head-avatar.png')} alt="暂无头像" className="mineDetailContainer-avatar"/> : null}*/}
                       </div>
                   </div>
                    <div className="mineDetailContainer-content-main">
                        <div className="mineDetailContainer-main-item">
                            <div>姓名</div>
                            <div>{name}</div>
                        </div>
                        <div className="mineDetailContainer-main-item">
                            <div>手机号</div>
                            <div>{Tel}</div>
                        </div>
                        <div className="mineDetailContainer-main-item">
                            <div>所在地区</div>
                            <div>{RName}</div>
                        </div>
                        <div className="mineDetailContainer-main-item" onClick={()=>{this.props.history.push('/gradeManagement')}}>
                            <div>孩子年级</div>
                            <div className="grade-div">
                                {/*<div>{gradeList ? gradeList.map((e,i)=><span key={i}>{e.grade}&nbsp;</span>):null}</div>*/}
                                <div className="user-info-number">
                                    {gradeList.length<=2 ? gradeList.map((e,i)=><span key={i}>{e.grade}&nbsp;</span>)
                                        : gradeList.length>2 ? <div><span >{gradeList[0].grade}</span>&nbsp;<span>{gradeList[1].grade}</span><span>...</span></div> :
                                            null}
                                </div>
                                <img src={require('../../../images/right.png')} alt="" className="mineDetailContainer-main-item-img"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default MineDetailContainer;