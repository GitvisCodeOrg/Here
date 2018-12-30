import React, { Component } from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import { formatPlayCount } from '../../common/js/utl';
import {
  getChangeCollectorAction,
  getChangePlayListAction,
  getChangeCurrentIndex,
  playNextMusicAction
} from '../../store/actionCreator';
import './style.scss';
import ShowList from '../../base/ShowList';

const COLLECT = 0,
  FOUND = 1;

class Collect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: this.props.collector
        ? this.props.collector.foundList[0]
        : null,
      listType: FOUND,
      activeList: 0
    };
  }

  handleChangeCurrentList = (list, type) => {
    console.log('list', list);
    this.setState(() => ({
      currentList: list,
      listType: type
    }));
  };

  renderCollectList = () => {
    console.log('his.props.collector', this.props.collector);
    const collector = this.props.collector;
    if (!collector) {
      return null;
    }
    return collector.collectList.map((item, index) => {
      return (
        <li
          key={item.id}
          onClick={() =>
            this.handleChangeCurrentList(collector.collectList[index], COLLECT)
          }
        >
          <i className="iconfont icon-yinleliebiao" />
          <span>{item.name}</span>
        </li>
      );
    });
  };

  renderFoundList = () => {
    const collector = this.props.collector;
    if (!collector) {
      return null;
    }
    return collector.foundList.map((item, index) => {
      if (index === 0) {
        return (
          <li
            key={item.name}
            onClick={() =>
              this.handleChangeCurrentList(collector.foundList[index], FOUND)
            }
          >
            <i className="iconfont icon-will-love" />
            {item.name}
          </li>
        );
      }
      return (
        <li
          key={item.name}
          onClick={() =>
            this.handleChangeCurrentList(collector.foundList[index], FOUND)
          }
        >
          <i className="iconfont icon-yinleliebiao" />
          {item.name}
        </li>
      );
    });
  };

  renderFoundListImg = (tracks) => {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].imgUrl) {
        return <img src={tracks[i].imgUrl} alt="歌单图片" />;
      }
    }
  };

  renderCurrentList = () => {
    const list = this.state.currentList;
    if (!list) {
      return null;
    }
    return (
      <div>
        <div className="list-info">
          <div className="list-img">
            <If condition={this.state.listType === COLLECT}>
              <Then>
                <img src={list.coverImgUrl} alt="歌单图片" />
              </Then>
              <Else>
                <div className="found-list">
                  <div className="filter" />
                  {this.renderFoundListImg(list.tracks)}
                  <i className="iconfont icon-will-love" />
                </div>
              </Else>
            </If>
          </div>
          <div className="list-info-right">
            <h1 className="name">{list.name}</h1>
            <If
              condition={
                typeof list.description === 'string' &&
                list.description.length > 0
              }
            >
              <p className="desc">简介：{list.description}</p>
            </If>
            <div className="count">
              <p className="track-count">
                歌曲数 <span>{list.tracks.length + 1}</span>
              </p>
              <If condition={typeof list.playCount === 'number'}>
                <p className="track-count">
                  收听数 <span>{formatPlayCount(list.playCount)}</span>
                </p>
              </If>
            </div>
            <button className="play-btn" onClick={() => this.props.changeMusicList(list.tracks)}>
              <i className="iconfont icon-bofangicon" />
              <p>播放全部</p>
            </button>
          </div>
        </div>
        <div className="tracks-contianer">
          <ShowList
            showLikeBtn={false}
            showDislikeBtn={true}
            list={list.tracks}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div
        className={[
          'page-collect',
          this.props.showMusicList || this.props.showSingerInfo
            ? 'hide-page-collect'
            : ''
        ].join(' ')}
      >
        <div className="left-nav">
          <div className="nav-collect-found-list">
            <p className="title">创建的歌单</p>
            <ul>{this.renderFoundList()}</ul>
          </div>
          <div className="nav-collect-list-container">
            <p className="title">收藏的歌单</p>
            <ul>{this.renderCollectList()}</ul>
          </div>
        </div>
        <div className="collect-container">{this.renderCurrentList()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    collector: state.collector,
    showMusicList: state.showMusicList,
    showSingerInfo: state.showSingerInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handlehangeCollector(value) {
      dispatch(getChangeCollectorAction(value));
    },
    changeMusicList(value) {
      dispatch(getChangePlayListAction(value));
      dispatch(getChangeCurrentIndex(-1));
      dispatch(playNextMusicAction());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collect);