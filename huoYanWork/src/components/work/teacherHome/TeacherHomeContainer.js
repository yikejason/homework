import React, {Component} from 'react';
import {Toast,ActivityIndicator} from 'antd-mobile';
import './teacherHomeContainer.less';
import './../../commonComponents/animate.css';
import config from '../../../config/config';
import publicMethod from '../../../config/publicMethod';
import {postFetch} from '../../../config/fetch';
let pageIndex;
class TeacherHomeContainer extends  Component{
    state = {
      userInfo:undefined,
      skillSubjectsAry:[],
      mannerAry:[],//态度颜色星星
      mannerNormal:[],//态度灰色星星
      dutyAry:[],//责任颜色星星
      dutyNormal:[],//责任灰色星星
      id:this.props.match.params.id,//老师id
      comments:[],
      pullDownState:false,
      loadMore:undefined,//是否可分页
      isLoading:true,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        pageIndex = 0;
    }
    componentDidMount() {
        this.getCommentsList();
        this.getTeacherInfo();//获取老师详情信息
        document.getElementById('scroll-contain').addEventListener('scroll', () => this.pullDown(), false);
    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }

    getCommentsList(){
        let req = config.appInfo;
        let {id,loadMore,pullDownState,comments} = this.state;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            type:1,
            teacherid:parseInt(id),
            comment_page:pageIndex,
            comment_count:10,
        });
        if(loadMore === false){
            setTimeout(()=>{
                Toast.info('已经是最后一页', 1);
            },0);
            return;
        }
        postFetch(`${config.hyurl}youxin/homework/teacherinfo`,null,req).then(res => {
            if(res.Code === 0){
                if(res.Data.comments != null){
                    comments = comments.concat(res.Data.comments);
                }else{
                    this.setState({
                        loadMore:false,
                        comments:comments,
                        pullDownState: true,
                    });
                    return;
                }
                if(res.Data.comments.length < 10){
                    this.setState({
                        loadMore:false,
                        comments:comments,
                        pullDownState: true,
                    });
                }else{
                    this.setState({
                        loadMore:true,
                        comments:comments,
                        pullDownState: true,
                    });
                }
            }else{
                Toast.info(res.Msg,1);
            }
        })
    }
    /**
     * 下拉加载
     */
    pullDown(){
        let {pullDownState} = this.state;
        let totalHeight = document.getElementById('scroll-contain').offsetHeight;// 容器总高度
        let scrollTop = document.getElementById('scroll-contain').scrollTop; // 被卷去的高度
        let scrollHeight = document.getElementById('scroll-contain').scrollHeight; // 滚动条总高度
        if(scrollHeight-scrollTop < totalHeight+50){
            if(pullDownState){
                this.setState({
                    pullDownState:false
                },()=>{
                    pageIndex += 1;
                    this.getCommentsList();
                });
            }
        }
    }
    /**
     * 老师详情信息
     */
    getTeacherInfo(){
        let req = config.appInfo;
        let {id} = this.state;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            type:0,
            teacherid:parseInt(id),
            comment_page:0,
            comment_count:10,
        });
        postFetch(`${config.hyurl}youxin/homework/teacherinfo`,null,req).then(res => {
          if(res.Code === 0){
            let str = res.Data.teacher_infos.skill_subjects;
            let skillSubjectsAry = str.substring(0,str.length).split(';');
            // console.log(str.substring(0,str.length));
            let mannerLen = Math.round(res.Data.teacher_infos.attitude_index);//态度星星  responsibility_index
            let dutyLen = Math.round(res.Data.teacher_infos.attitude_index);//责任星星
            let mannerAry=[],mannerNormal =[],dutyAry=[],dutyNormal =[];
            for(let i = 0;i<mannerLen;i++){
              mannerAry.push(i);
            }
            for(let i = 0;i<5-mannerLen;i++){
              mannerNormal.push(i);
            }
            for(let i = 0;i<dutyLen;i++){
              dutyAry.push(i);
            }
            for(let i = 0;i<5-dutyLen;i++){
              dutyNormal.push(i);
            }

            this.setState({
              userInfo:res.Data.teacher_infos,
              comments:res.Data.comments,
              skillSubjectsAry:skillSubjectsAry,
              mannerAry:mannerAry,
              mannerNormal:mannerNormal,
              dutyAry:dutyAry,
              dutyNormal:dutyNormal,
            });
          }else{
            Toast.info(res.Msg,1);
          }
        })
    }

    render(){
        let {userInfo,skillSubjectsAry,mannerAry,mannerNormal,dutyAry,dutyNormal,comments,loadMore} = this.state;
        return(
            <div className="TeacherHomeContainer animated fadeIn">
                <div className="TeacherHomeContainer-content" id="scroll-contain">
                    <div className="TeacherHomeContainer-content-head">
                        <div className="content-head-avatar">
                            { userInfo ? <img src={userInfo.avatar}  className="head-avatar-img"/>:null}
                        </div>
                        <div className="teacher-info">
                            <div style={{margin:'6px 0'}}>{userInfo ? userInfo.name : ''}</div>
                            <div className="sex-info">{userInfo ? userInfo.sex === 1 ? '男' : '女' : ''}&nbsp;{userInfo ? userInfo.age +'年教龄': ''}</div>
                        </div>
                    </div>
                    <div className="TeacherHomeContainer-content-main">
                        <div className="content-main-top">
                            <div className="content-main-top-first">
                                <div style={{margin:'10px 0'}}>擅长科目</div>
                                {/*<div><button className="top-first-btn">喜欢ta讲解</button></div>*/}
                            </div>
                            <div className="content-main-top-two">
                                {
                                  skillSubjectsAry ? skillSubjectsAry.map((e,i) =>
                                    <div key={i}>{e}</div>) : ''
                                }
                            </div>
                        </div>
                        <div className="content-main-middle">
                            <div className="main-middle-item">
                                <div className="main-middle-item-img">
                                    <img src={require('../../../images/information_teacher_acception_icon.png')} alt=""/>
                                </div>
                                <div className="userInfo-num">{userInfo ? userInfo.adopt_rate : ''}%</div>
                                <div className="middle-item-info">采纳礼包</div>
                            </div>
                            <div className="main-middle-item-b">
                                <div className="main-middle-item-b-img">
                                    <img src={require('../../../images/information_teacher_task_icon.png')} alt=""/>
                                </div>
                                <div className="userInfo-num">{userInfo ? userInfo.homework_cnt : ''}</div>
                                <div className="middle-item-info">已批作业</div>
                            </div>
                            {/*<div className="main-middle-item">*/}
                                {/*<div className="main-middle-item-img">*/}
                                    {/*<img src={require('../../../images/information_teacher_problem_icon.png')} alt=""/>*/}
                                {/*</div>*/}
                                {/*<div className="userInfo-num">{userInfo ? userInfo.quesiton_cnt : ''}</div>*/}
                                {/*<div className="middle-item-info">已答难题</div>*/}
                            {/*</div>*/}
                        </div>
                        <div className="content-main-bottom">
                            <div className="main-bottom-teacher">老师评分</div>
                            <div className="main-bottom-star">
                                <div className="bottom-star-item-a">

                                  <span>态度</span>
                                  <span className="starts">
                                    {
                                      mannerAry ? mannerAry.map((e,i) =>
                                        <img key={i} src={require('../../../images/star_btn_select.png')} alt=""/>
                                      ):''
                                    }
                                    {
                                      mannerNormal ? mannerNormal.map((e,i) =>
                                        <img key={i} src={require('../../../images/star_btn_normal.png')} alt=""/>
                                      ):''
                                    }
                                  </span>

                                </div>
                                <div className="bottom-star-item">
                                  <span>能力</span>
                                  <span className="starts">
                                    {
                                      dutyAry ? dutyAry.map((e,i) =>
                                        <img key={i} src={require('../../../images/star_btn_select.png')} alt=""/>
                                      ):''
                                    }
                                    {
                                      dutyNormal ? dutyNormal.map((e,i) =>
                                        <img key={i} src={require('../../../images/star_btn_normal.png')} alt=""/>
                                      ):''
                                    }
                                  </span>
                                </div>
                            </div>
                            <div className="main-bottom-teacher">评论</div>
                        </div>
                    </div>
                    <div className="CommentList" >

                        {
                            comments ? comments.map((e,i) =>
                                <div key={i} className="CommentList-item">
                                    <div className="Comment-avatar">
                                        {e.avatar ? <img src={e.avatar}  className="Comment-img"/>:null}
                                        {!e.avatar ? <img src={require('../../../images/head-avatar.png')}  className="Comment-img"/>:null}
                                    </div>
                                    <div className="Comment-info">
                                        <div>{e.studname}</div>
                                        <div className="CommentList-time">{e.time}</div>
                                        <div>{e.content}</div>
                                    </div>
                                </div>
                            ) :''
                        }
                        {/*底部加载*/}
                        {loadMore === true ?<div style={{ paddingBottom: 40, display: 'flex',justifyContent:'center',paddingTop:10 }}>{this.state.isLoading ? <ActivityIndicator size="large" text="正在加载"/> : 'null'}</div>:null}
                        {loadMore === false ?
                            <div>
                                <div className="bottom-text">
                                    <span>没有更多内容了</span>
                                </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        )
    }


}

export default TeacherHomeContainer;
