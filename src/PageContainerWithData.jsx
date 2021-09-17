import { connect } from "react-redux";
import PageContainer from "./PageContainer";

function mapStateToProps(state) {
  return {
    drawerIsTransitioning: state.left_drawer.is_transitioning,
    transitionTime: state.left_drawer.transition_time,
  };
}

export default connect(mapStateToProps)(PageContainer);
