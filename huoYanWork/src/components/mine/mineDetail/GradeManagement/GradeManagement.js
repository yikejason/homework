import React, {Component} from 'react';
import './gradeManagement.less';
import './../../../commonComponents/animate.css';
import {postFetch,getFetch} from '../../../../config/fetch';
import publicMethod from '../../../../config/publicMethod';
import {Modal,Toast} from 'antd-mobile';
import config from '../../../../config/config';
class GradeManagement extends Component {
    state = {
        tasktype: 2,
        deleteInfo: false,
        showGrade:false,
        gradeID: undefined,//班级id
        grade1: [],//小学年级
        grade2: [],//初中年级
        grade3: [],//高中年级
        userGrade:[],
        isNoGrade:false,//
        noGrade:false,
    };

    componentWillMount() {
        publicMethod.showAppMenu();
    }

    componentDidMount() {
        publicMethod.getToken(() => this.getTokenId());
        // this.getGradeInfo();//获取年级基础信息
        // this.getUserGradeInfo();//获取用户的年级列表信息
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
                    this.getUserGradeInfo();//获取全部年级对应学科信息
                },100);
                this.getGradeInfo();//获取年级基础信息
            }
        })
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

    /**
     *获取用户年级浮层的信息
     */
    getGradeInfo() {
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({});
        let {grade1, grade2, grade3} = this.state;
        let gradeAry1 = [],gradeAry2 = [],gradeAry3 = [];
        postFetch(`${config.hyurl}youxin/guest/gradeinfo`, null, req).then(res => {
            if (res.Code === 0) {
                if (res.Data.length !== 0) {
                    res.Data.map((e, i) => {

                        if (e.grade.indexOf('年') >= 0) {
                            gradeAry1.push(e);
                        }
                        if (e.grade.indexOf('初') >= 0) {
                            gradeAry2.push(e);
                        }
                        if (e.grade.indexOf('高') >= 0) {
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
            }
        })
    }
    //获取用户的年级列表信息
    getUserGradeInfo(){
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({

        });

        postFetch(`${config.hyurl}youxin/user/getusergradeinfo`,null,req).then(res => {
            if(res.Code === 0){
                // console.log(res.Data.gradelist);
                if(res.Data.gradelist.length === 0){
                    console.log('弹出模态框');
                    if(this.state.noGrade){
                        this.setState({
                            showGrade:false,
                            userGrade:res.Data.gradelist,
                            isNoGrade:true,
                        })
                    }else{
                        this.setState({
                            showGrade:true,
                            userGrade:res.Data.gradelist,
                            isNoGrade:false,
                        })
                    }

                }else{
                    console.log('关闭模态框');
                    this.setState({
                        showGrade:false,
                        userGrade:res.Data.gradelist,
                    });
                }

            }else{
                Toast.info(res.Msg,1);
            }
        });
    }

    //选择年级的信息
    chooseGrade(data) {
        this.setState({
            gradeID: data.gradeid
        });
    };
    //增加年级
    addGrade(){
        this.setState({
            showGrade: false,
            isNoGrade:false,
        });
        if(!this.state.gradeID){
          return;
        };
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            gradeid:this.state.gradeID,
        });
        postFetch(`${config.hyurl}youxin/user/addusergrade`,null,req).then(res => {
            if(res.Code === 0){
                this.setState({
                    gradeID: undefined,
                },() =>{
                    this.getUserGradeInfo();
                });
                Toast.success('新增成功',1);
            }else{
                this.setState({
                    gradeID: undefined,
                });
                Toast.info(res.Msg,1);
            }
        });
    }

    //确认删除年级的信息
    delGrade(e) {
        this.setState({
            deleteInfo: true,
            delid:e.gradeid
        });

    }
    sureDelGrade(e){
        this.setState({deleteInfo: false});
        if(e === 1){
            return;
        }
        let req = config.appInfo;
        req.tokenid = sessionStorage.getItem('tokenId');
        req.data = JSON.stringify({
            gradeid:this.state.delid,
        });
        postFetch(`${config.hyurl}youxin/user/delusergrade`,null,req).then(res => {
            if(res.Code === 0){
                this.getUserGradeInfo();
                Toast.success('删除成功',1);
                this.setState({
                    deleteInfo: false,
                    noGrade:true,
                });
            }else{
                Toast.info(res.Msg,1);
            }
        });
    }



    render() {
        let {deleteInfo, gradeID, grade1, grade2, grade3,userGrade,showGrade,isNoGrade} = this.state;
        console.log(showGrade);
        return (
            <div className="gradeManagement">
                <Modal
                    popup
                    visible={showGrade}
                    maskClosable={false}
                    animationType="slide-up"
                >
                    <div>
                        <div className="grade-info">
                          <h4>为了更好的服务，请确认孩子的年级信息</h4>
                          <img className="close-grade" src={require('../../../../images/close.png')} alt="" onClick={this.onClose('showGrade')}/>
                        </div>
                        <div className="grade-modal">
                            <div className="grade-one">
                                <h4>小学</h4>
                                <div className="primary-list">
                                    {grade1 ? grade1.map((e, i) =>
                                        <span key={i} className={e.gradeid == gradeID ? 'choosed' : null}
                                              onClick={() => this.chooseGrade(e)}>{e.grade}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grade-one">
                                <h4>初中</h4>
                                <div className="primary-list">
                                    {grade2 ? grade2.map((e, i) =>
                                        <span key={i} className={e.gradeid == gradeID ? 'choosed' : null}
                                              onClick={() => this.chooseGrade(e)}>{e.grade}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grade-one">
                                <h4>高中</h4>
                                <div className="primary-list">
                                    {grade3 ? grade3.map((e, i) =>
                                        <span key={i} className={e.gradeid == gradeID ? 'choosed' : null}
                                              onClick={() => this.chooseGrade(e)}>{e.grade}</span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="grade-modal-btn">
                            <button className={gradeID ? 'grade-info-btn' : 'grade-info-sure-btn'}  onClick={() => this.addGrade()}>确定</button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    title=""
                    className="vote-tip"
                    transparent
                    maskClosable={false}
                    visible={deleteInfo}
                    footer={[{
                        text: '取消', onPress: () => {
                            this.sureDelGrade(1)
                        }
                    },
                        {
                            text: '确定', onPress: () => {
                            this.sureDelGrade(2)
                        }
                        }]} platform="ios">
                    <div className="Management-delete-grade">确定删除该年级?</div>
                    <div style={{'textAlign': 'left'}}>删除年级后，该年级的作业劵将无法使用</div>
                </Modal>
                <div className="gradeManagement-content">
                  <div style={{paddingTop:'10px'}}>
                    {
                      userGrade.length !== 0 ? userGrade.map((e,i) =>
                        <div className="content-item" key={i}>
                          <div className="grade-info-management">
                            <div>孩子年级</div>
                            <div className="grade">{e.grade}</div>
                          </div>
                          <div className="grade-delete" onClick={() => this.delGrade(e)}>
                            <div className="delete-text">删除</div>
                            <div><img src={require('../../../../images/grade-delete.png')} alt=""/></div>
                          </div>
                        </div>) : null
                    }
                      {
                          isNoGrade ? <div className="no-grade">
                              <img src={require('../../../../images/kong.png')} alt=""/>
                              <p>您暂时没有年级信息，请新增年级</p>
                          </div>:''
                      }

                  </div>
                </div>
                <div className="grade-btn">
                    <button className="add-grade-btn" onClick={this.showModal('showGrade')}>新增年级</button>
                </div>
            </div>
        )
    }
}

export default GradeManagement;
