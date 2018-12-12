import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Messages } from "./Message";
import { findUsers, findSingleUser, getMessages } from "../Actions/actions";
import { Container } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";

class MessagesList extends Component {
  componentDidMount() {
    this.props.findUsers();
    this.props.findSingleUser(this.props.userID);
    this.props.getMessages();
  }

  matchUsernameId = userId => {
    let name = this.props.users.filter(user => user.id === userId);
    if (name[0]) return name[0].username;
    return "Not Found";
  };

  likedUserMessage = likes => {
    return likes.some(like => like.userId === this.props.userId);
  };

  likeId = likes => {
    let like = likes.filter(like => like.userId === this.props.userID);
    if (like.length > 0) {
      return like[0].id;
    } else {
      return null;
    }
  };

  formatKweetDate = date => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    const zeros = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];

    let dateObject = new Date(date);
    let month = dateObject.getUTCMonth();
    let day = dateObject.getUTCDate();
    let year = dateObject.getUTCFullYear();
    let hours = dateObject.getHours();

    let ending = "AM";
    if (hours === 0) {
      hours = 12;
    } else if (hours < 10) {
      hours = zeros[hours];
    } else if (hours === 12) {
      ending = "PM";
    } else if (hours > 12) {
      hours = hours - 12;
      ending = "PM";
    }
    let minutes = dateObject.getMinutes();
    if (minutes < 10) {
      minutes = zeros[minutes];
    }
    let seconds = dateObject.getSeconds();
    if (seconds < 10) {
      seconds = zeros[seconds];
    }
    return "${months[month]} ${day}, ${year} at ${hours}:${minutes}:${seconds} ${ending}";
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            border: "none"
          }}
        >
          <Switch>
            <Route path="/feed" />
            <Route path="/profile" />
          </Switch>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ userID, messages }) => ({
  messages,
  userID
});
/*possibly transfer*/
const mapDispatchToProps = dispatch => {
  return {
    findUsers: (limit, offset) => {
      dispatch(findUsers(limit, offset));
    },
    findSingleUser: userID => {
      dispatch(findSingleUser(userID));
    },
    getMessages: () => {
      dispatch(getMessages());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesList);