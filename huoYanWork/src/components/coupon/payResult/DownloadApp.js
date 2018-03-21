import React, {Component} from 'react';
import './downloadApp.less';
import {Tabs} from 'antd-mobile';
import publicMethod from './../../../config/publicMethod';
class DownloadApp extends Component {
    state = {
        tab:0,
    };
    componentWillMount(){
        publicMethod.showAppMenu();
    }
    componentDidMount() {

    }
    componentWillUpdate(){
        publicMethod.showAppMenu();
    }
    /**
     *去下载
     */
    goDownLoad(){
        window.location.href = 'http://www.ucuxin.com/d';
    }
    render(){
        return(
            <div className="downloadApp">
                <div className="downloadApp-content">
                    <div className="instro-content">
                        <img src={require('./../../../images/download-intro.jpg')} alt=""/>
                    </div>
                    <div className="download-btn">
                        <img onClick={()=>this.goDownLoad()} src={require('./../../../images/download-btn.png')} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}

export default DownloadApp;
