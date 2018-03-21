import React, {Component} from 'react';
import {getFetch,postFetch} from "../../../config/fetch";
import '../../commonComponents/animate.css';
import './publish.less';
import { Modal,Toast,List,TextareaItem,ImagePicker } from 'antd-mobile';
import Footer from '../.././commonComponents/footer/Footer';
import publicMethod from '../../../config/publicMethod';
import config from "../../../config/config";
class Publish extends Component {
    state = {
        userInfo:undefined,//用户信息
        hw_num:0,//剩余作业券数量
        showGrade:false,//年级选择模态框
        showSecurities:false,//作业劵状态
        gradeID:undefined,//班级id
        subjectID:undefined,//科目id
        workImg:[],//拍照图片数组
        memo:undefined,//对老师的话
        addInfo:false,//卷数量模态框
        gradeAry:[],//用户的年级信息
        subjectAry:[],//选择年级后对应的科目信息
        grade1:[],//小学年级
        grade2:[],//初中年级
        grade3:[],//高中年级
        taskid:undefined,//上传图片的taskid
        picinfo:[],//上传图片picinfo数组
        picseqid:1,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
        if(this.state.memo === undefined && sessionStorage.getItem('memo')){
            this.setState({
                memo:sessionStorage.getItem('memo'),
            })
        }
        if(this.state.workImg.length === 0 && sessionStorage.getItem('workImg')){
            this.setState({
                workImg:JSON.parse(sessionStorage.getItem('workImg')),
            })
        }
        if(this.state.picinfo.length === 0 && sessionStorage.getItem('picinfo')){
            this.setState({
                picinfo:JSON.parse(sessionStorage.getItem('picinfo')),
            })
        }

    }
    componentDidMount() {
        publicMethod.getToken(() => this.getTokenId());
        // this.getGradeInfo();//获取所有年级列表信息
        // this.getSubjectInfo();//获取全部年级对应学科信息
        document.getElementById('textArea').addEventListener('focus', () => this.changeLocation(), false);

    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    //获取火眼tokenID
    getTokenId() {
        getFetch(`${config.uxurl}base/v3/Common/GetDesEncrypt`, {key:config.userPhone, AppID: config.appId}).then((result) => {
            if (result.Ret === 0) {
                sessionStorage.setItem('tokenId', result.Data);
                setTimeout(() =>{
                    this.getUserGradeInfo();//获取用户年级对应学科信息
                },100);
                this.getGradeInfo();//获取所有年级列表信息
                this.getSubjectInfo();//获取全部年级对应学科信息
                this.getUserCoupon(null);//获取当前用户劵数量
            }
        })
    }
    changeLocation(){
        let winHeight = document.body.clientWidth+200; //获取当前页面高度
        window.onresize = function () {
            let thisHeight = document.getElementById('textArea').clientWidth;
            if (winHeight - thisHeight > 50) {
                //当软键盘弹出，在这里面操作
                document.body.style.height = winHeight + 'px';

            } else {
                //当软键盘收起，在此处操作
                // $('body').css('height', '100%');
                document.body.style.height = "100%";
                // alert(1)
            }
        };
        console.log(winHeight);
        console.log(document.getElementById('textArea').clientWidth);
        document.getElementById('textArea').scrollIntoView(true);
    }
    showModal = key => (e) => {
        e.preventDefault();
        this.setState({
            [key]: true,
        });
    };
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    };
    //选择班级
    chooseGrade(data){
        if(this.state.subjectInfo){
            this.state.subjectInfo.map((e,i) => {
                if(e.gradeid === data.gradeid){
                    this.setState({
                        subjectAry:e.subjectlist,
                    })
                }
            });
        }
        this.setState({
            gradeID : data.gradeid,
            showGrade:false,
        });
        this.getUserCoupon(data.gradeid);//获取当前用户劵数量
    };
    //选择科目
    chooseSubject(data){
        this.setState({
            subjectID : data.subjectid
        });
    };
    //拍照上传图片
    upImg(){
        let {workImg,picinfo,picseqid} = this.state;
        window.location.href = 'ucux://getphoto?action=all&maxcount=1&callback=onselectphoto&path=zuoye';
        window.onselectphoto  = (data)=>{
            let imgObj = JSON.parse(data);
            let ThumbPicUrl = imgObj.ThumbImg;
            let PicUrl = imgObj.LUrl;
            let obj = {
                // ThumbPicUrl:imgObj.ThumbImg,
                // PicUrl:imgObj.LUrl,
                ThumbPicUrl:ThumbPicUrl.slice(0,4) + 's' + ThumbPicUrl.slice(4,ThumbPicUrl.length),
                PicUrl:PicUrl.slice(0,4) + 's' + PicUrl.slice(4,PicUrl.length),
            };
            // alert(imgObj.ThumbImg);
            let onePic = {
                picseqid:picseqid,
                width: imgObj.Width,
                height: imgObj.Height,
                size: 0,
                memo: '',
                domain: '',
                imgurl: PicUrl.slice(0,4) + 's' + PicUrl.slice(4,PicUrl.length) + '@!uxjpg1024',
                thumburl: ThumbPicUrl.slice(0,4) + 's' + ThumbPicUrl.slice(4,ThumbPicUrl.length) + '@!uxjpg200',
            };

            // let url = imgObj.ThumbImg;
            // url.slice(0,4);

            // let endUrl = url.slice(4,url.length - 1);
            // alert(url.slice(0,4));
            // alert(url.slice(4,url.length));

            picinfo.push(onePic);
            workImg.push(obj);
            // let newUrl = url.slice(0,4) + 's' + url.slice(4,url.length);
            // alert(newUrl);

            // alert(JSON.stringify(picinfo));
            this.setState({
                workImg:workImg,
                picseqid:picseqid + 1
            })
        }
    };
    //删除图片
    delImg(option,index){
        let {workImg,picinfo,picseqid} = this.state;
        workImg.splice(index,1);
        picinfo.splice(index,1);
        this.setState({
            workImg:workImg,
            picinfo:picinfo,
            picseqid:picseqid - 1,
        })
    };
    //验证数据的完整性
    confirm(){
        let {gradeID,subjectID,workImg,memo} = this.state;
        if(!gradeID || gradeID === ''){
            Toast.info('请选择年级！',1);
            return false;
        }
        if(!subjectID || subjectID === ''){
            Toast.info('请选择科目！',1);
            return false;
        }
        // if(!memo || memo === ''){
        //     Toast.info('请填写对老师的话！',1);
        //     return false;
        // }
        if(workImg.length === 0){
            Toast.info('请上传作业图片！',1);
            return false;
        }
        this.setState({addInfo:true});

    }
    //提交发布作业申请
    publishStart(){
        let req = config.appInfo;
        let {gradeID,subjectID,workImg,memo,hw_num} = this.state;
        if(hw_num <= 0){
            if(this.state.memo !== undefined){
                sessionStorage.setItem('memo',this.state.memo);
            }
            if(this.state.workImg.length !== 0){
                sessionStorage.setItem('workImg',JSON.stringify(this.state.workImg));
            }
            if(this.state.picinfo.length !== 0){
                sessionStorage.setItem('picinfo',JSON.stringify(this.state.picinfo));
            }
            this.props.history.push('/coupon/buyCoupon');
            return
        }
        this.setState({addInfo:false});
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            gradeid:gradeID,
            subjectid:subjectID,
            num:workImg.length,
            memo:memo,
        });
        // alert(JSON.stringify(req));
        postFetch(`${config.hyurl}youxin/homework/publish`,null,req).then(res => {
            if(res.Code === 0){
                this.setState({
                    taskid:res.Data.taskid,
                });
                this.homeworkPicUpload();
            }else{
                Toast.info(res.Msg,1);
            }
        });
    };
    //上传发布作业图片
    homeworkPicUpload(){
        let req = config.appInfo;
        let {workImg,picinfo,taskid} = this.state;
        this.setState({addInfo:false});
        req.tokenid = sessionStorage.getItem('tokenId');
        // alert(JSON.stringify(picinfo));
        req.data = JSON.stringify({
            taskid: taskid,
            num:workImg.length,
            picinfo:picinfo,
        });
        // alert(JSON.stringify(req));
        postFetch(`${config.hyurl}youxin/homework/homeworkpicupload`,null,req).then(res => {
            if(res.Code === 0){
                this.publishFinish()
            }else{
                Toast.info(res.Msg,1);
            }
        });
    };
    //发布作业完毕
    publishFinish(){
        let req = config.appInfo;
        let {workImg,taskid} = this.state;
        this.setState({addInfo:false});
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            taskid: taskid,
            num:workImg.length,
        });
        // alert(JSON.stringify(req));
        postFetch(`${config.hyurl}youxin/homework/homeworkuploadfinish`,null,req).then(res => {
            if(res.Code === 0){
                Toast.info('发布成功',1);
                sessionStorage.removeItem('memo');
                sessionStorage.removeItem('workImg');
                sessionStorage.removeItem('picinfo');
                setTimeout(()=>{this.props.history.push('/work');},1000);
            }else{
                Toast.info(res.Msg,1);
            }
        });
    };
    //获取用户的年级列表信息
    getUserGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({

        });
        postFetch(`${config.hyurl}youxin/user/getusergradeinfo`,null,req).then(res => {
            if(res.Code === 0){
                if(res.Data.gradelist){
                    res.Data.gradelist.sort((a,b) => {
                        return a.gradeid - b.gradeid
                    });
                }
                if(res.Data.gradelist.length === 0){
                    this.setState({
                        showGrade:true,
                    })
                }else{
                    this.setState({
                        gradeAry:res.Data.gradelist,
                        gradeID : res.Data.gradelist[0].gradeid
                    });
                    this.getUserCoupon(res.Data.gradelist[0].gradeid);//获取当前用户劵数量
                }
                if(this.state.subjectInfo && res.Data.gradelist.length !== 0){
                    this.state.subjectInfo.map((e,i) => {
                        if(e.gradeid === res.Data.gradelist[0].gradeid){
                            this.setState({
                                subjectAry:e.subjectlist,
                            })
                        }
                    });
                }
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    //获取年级基础信息
    getGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        let{grade1,grade2,grade3} = this.state;
        let gradeAry1 = [],gradeAry2 = [],gradeAry3 = [];
        postFetch(`${config.hyurl}youxin//guest/gradeinfo`,null,req).then(res => {
            if(res.Code === 0){
                if(res.Data.length !== 0){
                    res.Data.map((e,i) => {
                        if(e.grade.indexOf('年') >= 0){
                            gradeAry1.push(e);
                        }
                        if(e.grade.indexOf('初') >= 0){
                            gradeAry2.push(e);
                        }
                        if(e.grade.indexOf('高') >= 0){
                            gradeAry3.push(e);
                        }
                    });
                    this.setState({
                        gradeInfo: res.Data,
                        grade1:gradeAry1,
                        grade2:gradeAry2,
                        grade3:gradeAry3,
                    });
                }
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    //获取全部年级对应学科信息
    getSubjectInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        postFetch(`${config.hyurl}youxin/guest/subjectinfo`,null,req).then(res => {
            if(res.Code === 0){
                this.setState({
                    subjectInfo:res.Data,
                });
                this.getUserGradeInfo();//获取用户的年级列表信息
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    //获取当前用户劵数量
    getUserCoupon(gradeid){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            tasktype:2, //(1为难题 2为作业类型)
            gradeid:gradeid,
        });
        postFetch(`${config.hyurl}youxin/user/getusercoupon`,null,req).then(res => {
            if(res.Code === 0){
                this.setState({
                    hw_num:res.Data.hw_num,
                })
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }
    chooseMoreGrade(){
        if(this.state.memo !== undefined){
            sessionStorage.setItem('memo',this.state.memo);
        }
        if(this.state.workImg.length !== 0){
            sessionStorage.setItem('workImg',JSON.stringify(this.state.workImg));
        }
        if(this.state.picinfo.length !== 0){
            sessionStorage.setItem('picinfo',JSON.stringify(this.state.picinfo));
        }
        this.props.history.push('/gradeManagement');
    }



    render(){
        let {subjectID,gradeID,workImg,memo,addInfo,hw_num,subjectAry,grade1,grade2,grade3,showGrade,gradeAry} = this.state;
        let classAry = [...grade1,...grade2,...grade3];
        // if(workImg.length > 0 ){
        //     workImg.map((e,i) => {
        //         alert(e.ThumbPicUrl);
        //     })
        // }
        // alert(JSON.stringify(workImg))
        return(
            <div className="publish">
                <Modal
                    popup
                    visible={showGrade}
                    maskClosable={false}
                    animationType="slide-up"
                >
                    <div>
                        <div className="grade-info">
                            <h4>为了更好的服务，请确认孩子的年级信息</h4>
                            <img className="close-grade" src={require('../../../images/close.png')} alt="" onClick={this.onClose('showGrade')}/>
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
                    title=""
                    className="vote-tip"
                    transparent
                    maskClosable={false}
                    visible={addInfo}
                    footer={[{ text: hw_num === 0 ?  '放弃' :'否', onPress: () => {this.setState({addInfo:false})}},
                        { text: hw_num === 0 ?  '购买' :'是', onPress: () => this.publishStart()}]} platform="ios">
                    {
                        hw_num === 0 ? <div style={{color:'#333333',}}>你暂无作业券可用</div>
                            : <div style={{color:'#333333',}}>您目前有{hw_num}张作业券, 本次发布作业，会消耗{workImg.length}张</div>
                    }
                </Modal>
                <div className="publish-content  animated fadeIn">
                    <div className="photograph">
                        <h3>点击拍照（一次最多可上传4张）</h3>
                        <p>（清晰拍照、只可拍单科作业、空题不能超过2道）</p>
                        <div className="img-contain">
                            {
                                workImg.length !== 0 ? workImg.map((item,e)=>
                                    <div className="img-item" key={e}>
                                        <section>
                                            <img src={item.ThumbPicUrl} alt="没有图片"/>
                                        </section>
                                        <img className="del-icon"  onClick={()=>this.delImg(item,e)} src={require('../../../images/x.png')} alt=""/>
                                    </div>
                                ):''}
                            {
                                workImg.length < 4 ? <div className="file-but">
                                    <img className="up-img" src={require('../../../images/pic.png')}  onClick={()=>this.upImg()}/>
                                </div> : ''
                            }

                        </div>
                    </div>

                    <div className="grade">
                        <h3>年级</h3>
                        <div className="add-grade">


                            {
                                gradeAry.length !== 0 ? gradeAry.map((e,i) => {
                                    return  e.gradeid === gradeID ? <span key={i} className="choose-primary" onClick={()=>this.chooseGrade(e)}>{e.grade}</span> : <span key={i} className="user-grade" onClick={()=>this.chooseGrade(e)}>{e.grade}</span>
                                }) : ''
                            }

                            {
                                gradeAry.length === 0 ?
                                    classAry.map((e,i) => {
                                        return e.gradeid === gradeID ? <span key={i} className="choose-primary">{e.grade}</span> : ''
                                    }) : ''
                            }

                            {
                                gradeAry.length === 0 ? <span className="add-icon"  onClick={this.showModal('showGrade')}>+</span>
                                    : <span className="add-icon" onClick={()=> this.chooseMoreGrade()}>+</span>
                            }

                        </div>
                    </div>

                    <div className="subject">
                        <h3>学科</h3>
                        <h5 className="choose-error">选错科目会被举报或者删除</h5>
                        <div className="choose-subject">
                            { subjectAry ? subjectAry.map((e,i) =>
                                <span key={i}  className = {e.subjectid === subjectID ? 'choosed' : ''} onClick={ () => this.chooseSubject(e) }>{e.subject}</span>
                            ): null}
                        </div>
                    </div>

                    <div className="teacher-talk">
                        <h3>想对老师说什么</h3>
                        <div className="talk-text">
                            {/*<List>*/}
                            <TextareaItem
                                id='textArea'
                                rows={2}
                                maxLength = {24}
                                placeholder="麻烦老师批改下，谢谢老师。（24个字之内）"
                                onChange={(val)=>this.setState({
                                    memo:val
                                })}
                                value={memo}
                                autoHeight
                                editable={true}
                            />
                            {/*</List>*/}
                        </div>
                    </div>

                    <div className="publish-foot">
                        <div className="foot-text">
                            您目前有<span className="hw-num">{hw_num}</span>张可用作业券。
                        </div>
                        <div className="foot-btn">
                            <button className="foot-btn-main" onClick={() => this.confirm()}>发布作业</button>
                        </div>
                    </div>

                </div>
                <Footer {...this.props}/>
            </div>
        )
    }
}

export default Publish;
